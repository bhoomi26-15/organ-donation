import { supabase } from '../lib/supabase';
import { auditLog } from './auditService';

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

export const findDonorsForRequest = async (requestId: string) => {
  // Fetch Request and Recipient
  const { data: request } = await supabase.from('requests').select('*, recipients(*)').eq('id', requestId).single();
  if (!request) throw new Error("Request not found");

  const recipient = request.recipients;

  // Fetch Eligible Donors
  // Rules: verified, available, organ type matches
  const { data: donors } = await supabase
    .from('donors')
    .select('*')
    .eq('donor_status', 'verified')
    .eq('is_available', true)
    .contains('organ_types', [request.required_organ]);

  if (!donors) return [];

  // Calculate Scores and Build Matches Details
  const evaluatedMatches = donors.map(donor => {
    const isOrganMatch = true; // since filtered via contains
    const isBloodMatch = checkBloodCompatibility(donor.blood_group, request.blood_group);
    
    // Only return compatible blood types
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
  }).filter(Boolean); // Remove nulls (incompatible)

  // Sort descending by score
  return evaluatedMatches.sort((a: any, b: any) => b.match_score - a.match_score);
};

export const createMatchProposal = async (matchData: any, actorUid: string) => {
  const { data, error } = await supabase.from('matches').insert(matchData).select().single();
  if (error) throw error;

  await auditLog(
    actorUid,
    'system',
    'MATCH_PROPOSED',
    data.id,
    'matches',
    `Proposed match created with score ${data.match_score}`
  );

  return data;
};
