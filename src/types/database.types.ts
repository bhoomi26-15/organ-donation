export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          phone: string | null
          role: 'donor' | 'recipient' | 'hospital' | 'admin' | null
          avatar_url: string | null
          city: string | null
          state: string | null
          address: string | null
          account_status: string | null
          profile_completed: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          role?: 'donor' | 'recipient' | 'hospital' | 'admin' | null
          avatar_url?: string | null
          city?: string | null
          state?: string | null
          address?: string | null
          account_status?: string | null
          profile_completed?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          role?: 'donor' | 'recipient' | 'hospital' | 'admin' | null
          avatar_url?: string | null
          city?: string | null
          state?: string | null
          address?: string | null
          account_status?: string | null
          profile_completed?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: any[]
      }
      hospitals: {
        Row: {
          id: string
          user_id: string
          hospital_name: string
          hospital_email: string
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          license_number: string | null
          authorized_person_name: string | null
          verification_document_url: string | null
          hospital_status: 'pending' | 'verified' | 'rejected' | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string
          hospital_name?: string
          hospital_email?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          license_number?: string | null
          authorized_person_name?: string | null
          verification_document_url?: string | null
          hospital_status?: 'pending' | 'verified' | 'rejected' | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          hospital_name?: string
          hospital_email?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          license_number?: string | null
          authorized_person_name?: string | null
          verification_document_url?: string | null
          hospital_status?: 'pending' | 'verified' | 'rejected' | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: any[]
      }
      donors: {
        Row: {
          id: string
          user_id: string
          hospital_id: string | null
          full_name: string
          age: number | null
          gender: string | null
          blood_group: string | null
          phone: string | null
          email: string | null
          city: string | null
          state: string | null
          address: string | null
          organ_types: string[] | null
          medical_history: string | null
          emergency_contact: string | null
          national_id: string | null
          consent_accepted: boolean | null
          donor_status: 'active' | 'inactive' | 'pending_verification' | 'verified' | 'rejected' | null
          hospital_verification_status: string | null
          is_available: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string
          hospital_id?: string | null
          full_name?: string
          age?: number | null
          gender?: string | null
          blood_group?: string | null
          phone?: string | null
          email?: string | null
          city?: string | null
          state?: string | null
          address?: string | null
          organ_types?: string[] | null
          medical_history?: string | null
          emergency_contact?: string | null
          national_id?: string | null
          consent_accepted?: boolean | null
          donor_status?: 'active' | 'inactive' | 'pending_verification' | 'verified' | 'rejected' | null
          hospital_verification_status?: string | null
          is_available?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          hospital_id?: string | null
          full_name?: string
          age?: number | null
          gender?: string | null
          blood_group?: string | null
          phone?: string | null
          email?: string | null
          city?: string | null
          state?: string | null
          address?: string | null
          organ_types?: string[] | null
          medical_history?: string | null
          emergency_contact?: string | null
          national_id?: string | null
          consent_accepted?: boolean | null
          donor_status?: 'active' | 'inactive' | 'pending_verification' | 'verified' | 'rejected' | null
          hospital_verification_status?: string | null
          is_available?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: any[]
      }
      recipients: {
        Row: {
          id: string
          user_id: string
          hospital_id: string | null
          full_name: string
          age: number | null
          gender: string | null
          blood_group: string | null
          phone: string | null
          email: string | null
          city: string | null
          state: string | null
          address: string | null
          required_organ: string | null
          urgency_level: 'low' | 'medium' | 'high' | 'critical' | null
          doctor_name: string | null
          medical_condition: string | null
          required_date: string | null
          status: 'pending' | 'approved' | 'matched' | 'completed' | 'rejected' | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string
          hospital_id?: string | null
          full_name?: string
          age?: number | null
          gender?: string | null
          blood_group?: string | null
          phone?: string | null
          email?: string | null
          city?: string | null
          state?: string | null
          address?: string | null
          required_organ?: string | null
          urgency_level?: 'low' | 'medium' | 'high' | 'critical' | null
          doctor_name?: string | null
          medical_condition?: string | null
          required_date?: string | null
          status?: 'pending' | 'approved' | 'matched' | 'completed' | 'rejected' | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          hospital_id?: string | null
          full_name?: string
          age?: number | null
          gender?: string | null
          blood_group?: string | null
          phone?: string | null
          email?: string | null
          city?: string | null
          state?: string | null
          address?: string | null
          required_organ?: string | null
          urgency_level?: 'low' | 'medium' | 'high' | 'critical' | null
          doctor_name?: string | null
          medical_condition?: string | null
          required_date?: string | null
          status?: 'pending' | 'approved' | 'matched' | 'completed' | 'rejected' | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: any[]
      }
      requests: {
        Row: {
          id: string
          recipient_id: string
          hospital_id: string | null
          required_organ: string | null
          blood_group: string | null
          urgency_level: string | null
          medical_notes: string | null
          status: string | null
          approved_by: string | null
          approved_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          recipient_id?: string
          hospital_id?: string | null
          required_organ?: string | null
          blood_group?: string | null
          urgency_level?: string | null
          medical_notes?: string | null
          status?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          recipient_id?: string
          hospital_id?: string | null
          required_organ?: string | null
          blood_group?: string | null
          urgency_level?: string | null
          medical_notes?: string | null
          status?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: any[]
      }
      matches: {
        Row: {
          id: string
          donor_id: string
          recipient_id: string
          request_id: string
          hospital_id: string | null
          match_score: number | null
          organ_match: boolean | null
          blood_group_match: boolean | null
          city_match: boolean | null
          state_match: boolean | null
          urgency_boost: number | null
          status: string | null
          confirmed_by: string | null
          confirmed_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          donor_id?: string
          recipient_id?: string
          request_id?: string
          hospital_id?: string | null
          match_score?: number | null
          organ_match?: boolean | null
          blood_group_match?: boolean | null
          city_match?: boolean | null
          state_match?: boolean | null
          urgency_boost?: number | null
          status?: string | null
          confirmed_by?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          donor_id?: string
          recipient_id?: string
          request_id?: string
          hospital_id?: string | null
          match_score?: number | null
          organ_match?: boolean | null
          blood_group_match?: boolean | null
          city_match?: boolean | null
          state_match?: boolean | null
          urgency_boost?: number | null
          status?: string | null
          confirmed_by?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: any[]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string | null
          is_read: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string | null
          is_read?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string | null
          is_read?: boolean | null
          created_at?: string | null
        }
        Relationships: any[]
      }
      audit_logs: {
        Row: {
          id: string
          actor_uid: string | null
          actor_role: string | null
          action_type: string
          target_id: string | null
          target_table: string | null
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          actor_uid?: string | null
          actor_role?: string | null
          action_type?: string
          target_id?: string | null
          target_table?: string | null
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          actor_uid?: string | null
          actor_role?: string | null
          action_type?: string
          target_id?: string | null
          target_table?: string | null
          description?: string | null
          created_at?: string | null
        }
        Relationships: any[]
      }
      files: {
        Row: {
          id: string
          user_id: string
          related_table: string | null
          related_id: string | null
          file_name: string
          file_url: string
          file_type: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string
          related_table?: string | null
          related_id?: string | null
          file_name?: string
          file_url?: string
          file_type?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          related_table?: string | null
          related_id?: string | null
          file_name?: string
          file_url?: string
          file_type?: string | null
          created_at?: string | null
        }
        Relationships: any[]
      }
    }
  }
}
