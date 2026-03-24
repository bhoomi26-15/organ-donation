import { supabase } from '../lib/supabase';
import { auditLog, auditService } from './auditService';
import { Database } from '../types/database.types';

type Match = Database['public']['Tables']['matches']['Row'];
type MatchInsert = Database['public']['Tables']['matches']['Insert'];

/**
 * Blood Group Compatibility Logic
 * O- can donate to anyone (Universal Donor)
 * O+ can donate to O+, A+, B+, AB+
 * A- can donate to A-, A+, AB-, AB+
 * A+ can donate to A+, AB+
 * B- can donate to B-, B+, AB-, AB+
 * B+ can donate to B+, AB+
 * AB- can donate to AB-, AB+
 * AB+ can donate to AB+ (Universal Recipient)
 */
export const checkBloodCompatibility = (donorBlood: string, recipientBlood: string): boolean => {
  const d = donorBlood.toUpperCase();
  const r = recipientBlood.toUpperCase();

  if (d === 'O-') return true;
  if (d === 'O+' && ['O+', 'A+', 'B+', 'AB+'].includes(r)) return true;
  if (d === 'A-' && ['A-', 'A+', 'AB-', 'AB+'].includes(r)) return true;
  if (d === 'A+' && ['A+', 'AB+'].includes(r)) return true;
  if (d === 'B-' && ['B-', 'B+', 'AB-', 'AB+'].includes(r)) return true;
  if (d === 'B+' && ['B+', 'AB+'].includes(r)) return true;
  if (d === 'AB-' && ['AB-', 'AB+'].includes(r)) return true;
  if (d === 'AB+' && r === 'AB+') return true;

  return false;
};

/**
 * Matching Algorithm
 * Evaluates donors against a specific request based on rules
 */
export const calculateMatchScore = (donor: any, request: any, recipient: any): number => {
  let score = 0;

  // Rule 1: Organ Match (Mandatory, already filtered ideally, but extra check)
  const isOrganMatch = donor.organ_types.includes(request.required_organ);
  if (!isOrganMatch) return 0;
  score += 30;

  // Rule 2: Blood Group Match (High Priority)
  const isBloodMatch = checkBloodCompatibility(donor.blood_group, request.blood_group);
  if (!isBloodMatch) return 0; // If not compatible, score 0 (can't match)
  score += 40;

  // Exact blood match gets a slight bump
  if (donor.blood_group === request.blood_group) {
    score += 5;
  }

  // Rule 3: Location Match
  const cityMatch = donor.city.toLowerCase() === recipient.city.toLowerCase();
  const stateMatch = donor.state.toLowerCase() === recipient.state.toLowerCase();
  
  if (cityMatch) score += 15;
  else if (stateMatch) score += 10;

  // Rule 4: Urgency Boost
  let urgencyBoost = 0;
  switch (request.urgency_level) {
    case 'critical': urgencyBoost = 15; break;
    case 'high': urgencyBoost = 10; break;
    case 'medium': urgencyBoost = 5; break;
    default: urgencyBoost = 0;
  }
  score += urgencyBoost;

  return score;
};

export const matchService = {
  /**
   * Find donor matches for a request
   */
  async findDonorsForRequest(requestId: string) {
    // Fetch Request and Recipient
    const { data: request, error: requestError } = await supabase
      .from('requests')
      .select('*, recipients(*)')
      .eq('id', requestId)
      .single();

    if (requestError || !request) throw new Error('Request not found');

    const recipient = (request as any).recipients;

    // Fetch Eligible Donors - verified, available, organ type matches
    const { data: donors, error: donorError } = await supabase
      .from('donors')
      .select('*')
      .eq('donor_status', 'verified')
      .eq('is_available', true)
      .contains('organ_types', [request.required_organ]);

    if (donorError || !donors) return [];

    // Calculate Scores and Build Matches Details
    const evaluatedMatches = donors
      .map(donor => {
        const isOrganMatch = true;
        const isBloodMatch = checkBloodCompatibility(donor.blood_group, request.blood_group);
        
        if (!isBloodMatch) return null;

        const cityMatch = donor.city.toLowerCase() === recipient.city.toLowerCase();
        const stateMatch = donor.state.toLowerCase() === recipient.state.toLowerCase();
        
        let urgencyBoost = 0;
        if (request.urgency_level === 'critical') urgencyBoost = 15;
        if (request.urgency_level === 'high') urgencyBoost = 10;

        const match_score = calculateMatchScore(donor, request, recipient);

        return {
          donor_id: donor.id,
          recipient_id: recipient.id,
          request_id: request.id,
          hospital_id: donor.hospital_id,
          match_score,
          organ_match: isOrganMatch,
          blood_group_match: isBloodMatch,
          city_match: cityMatch,
          state_match: stateMatch,
          urgency_boost: urgencyBoost,
          status: 'pending'
        };
      })
      .filter(Boolean);

    return evaluatedMatches.sort((a: any, b: any) => b.match_score - a.match_score);
  },

  /**
   * Create match record
   */
  async createMatch(matchData: MatchInsert) {
    const { data, error } = await supabase
      .from('matches')
      .insert(matchData)
      .select()
      .single();

    if (error) throw error;

    await auditService.log(
      'MATCH_CREATED',
      `Match created with score ${matchData.match_score}`,
      data.id,
      'matches'
    );

    return data;
  },

  /**
   * Get matches for a recipient
   */
  async getMatchesForRecipient(recipientId: string) {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('recipient_id', recipientId)
      .order('match_score', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get matches for a donor
   */
  async getMatchesForDonor(donorId: string) {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('donor_id', donorId)
      .order('match_score', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get all matches
   */
  async getMatches(filters?: { status?: string; request_id?: string }) {
    let query = supabase.from('matches').select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.request_id) {
      query = query.eq('request_id', filters.request_id);
    }

    const { data, error } = await query.order('match_score', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  /**
   * Confirm match
   */
  async confirmMatch(matchId: string, confirmedBy: string) {
    const { data, error } = await supabase
      .from('matches')
      .update({
        status: 'confirmed',
        confirmed_by: confirmedBy,
        confirmed_at: new Date().toISOString(),
      })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;

    await auditService.log(
      'MATCH_CONFIRMED',
      `Match confirmed by ${confirmedBy}`,
      matchId,
      'matches'
    );

    return data;
  },

  /**
   * Reject match
   */
  async rejectMatch(matchId: string) {
    const { data, error } = await supabase
      .from('matches')
      .update({ status: 'rejected' })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;

    await auditService.log(
      'MATCH_REJECTED',
      `Match rejected`,
      matchId,
      'matches'
    );

    return data;
  },
};

// Legacy exports for backward compatibility
export const findDonorsForRequest = async (requestId: string) => {
  return matchService.findDonorsForRequest(requestId);
};

export const createMatchProposal = async (matchData: any) => {
  return matchService.createMatch(matchData);
};
