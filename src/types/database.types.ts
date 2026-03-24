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
          profile_completed: boolean
          created_at: string
          updated_at: string
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
          profile_completed?: boolean
          created_at?: string
          updated_at?: string
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
          profile_completed?: boolean
          created_at?: string
          updated_at?: string
        }
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
          hospital_status: 'pending' | 'verified' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hospital_name: string
          hospital_email: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          license_number?: string | null
          authorized_person_name?: string | null
          verification_document_url?: string | null
          hospital_status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
          updated_at?: string
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
          hospital_status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      donors: {
        Row: {
          id: string
          user_id: string
          hospital_id: string | null
          full_name: string
          age: number
          gender: string
          blood_group: string
          phone: string
          email: string
          city: string
          state: string
          address: string
          organ_types: string[]
          medical_history: string | null
          emergency_contact: string
          national_id: string
          consent_accepted: boolean
          donor_status: 'active' | 'inactive' | 'pending_verification' | 'verified' | 'rejected'
          hospital_verification_status: string | null
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hospital_id?: string | null
          full_name: string
          age: number
          gender: string
          blood_group: string
          phone: string
          email: string
          city: string
          state: string
          address: string
          organ_types: string[]
          medical_history?: string | null
          emergency_contact: string
          national_id: string
          consent_accepted?: boolean
          donor_status?: 'active' | 'inactive' | 'pending_verification' | 'verified' | 'rejected'
          hospital_verification_status?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          hospital_id?: string | null
          full_name?: string
          age?: number
          gender?: string
          blood_group?: string
          phone?: string
          email?: string
          city?: string
          state?: string
          address?: string
          organ_types?: string[]
          medical_history?: string | null
          emergency_contact?: string
          national_id?: string
          consent_accepted?: boolean
          donor_status?: 'active' | 'inactive' | 'pending_verification' | 'verified' | 'rejected'
          hospital_verification_status?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      recipients: {
        Row: {
          id: string
          user_id: string
          hospital_id: string | null
          full_name: string
          age: number
          gender: string
          blood_group: string
          phone: string
          email: string
          city: string
          state: string
          address: string
          required_organ: string
          urgency_level: 'low' | 'medium' | 'high' | 'critical'
          doctor_name: string
          medical_condition: string
          required_date: string
          status: 'pending' | 'approved' | 'matched' | 'completed' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hospital_id?: string | null
          full_name: string
          age: number
          gender: string
          blood_group: string
          phone: string
          email: string
          city: string
          state: string
          address: string
          required_organ: string
          urgency_level?: 'low' | 'medium' | 'high' | 'critical'
          doctor_name: string
          medical_condition: string
          required_date: string
          status?: 'pending' | 'approved' | 'matched' | 'completed' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          hospital_id?: string | null
          full_name?: string
          age?: number
          gender?: string
          blood_group?: string
          phone?: string
          email?: string
          city?: string
          state?: string
          address?: string
          required_organ?: string
          urgency_level?: 'low' | 'medium' | 'high' | 'critical'
          doctor_name?: string
          medical_condition?: string
          required_date?: string
          status?: 'pending' | 'approved' | 'matched' | 'completed' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      requests: {
        Row: {
          id: string
          recipient_id: string
          hospital_id: string | null
          required_organ: string
          blood_group: string
          urgency_level: 'low' | 'medium' | 'high' | 'critical'
          medical_notes: string | null
          status: string
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipient_id: string
          hospital_id?: string | null
          required_organ: string
          blood_group: string
          urgency_level?: 'low' | 'medium' | 'high' | 'critical'
          medical_notes?: string | null
          status?: string
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipient_id?: string
          hospital_id?: string | null
          required_organ?: string
          blood_group?: string
          urgency_level?: 'low' | 'medium' | 'high' | 'critical'
          medical_notes?: string | null
          status?: string
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          donor_id: string
          recipient_id: string
          request_id: string
          hospital_id: string | null
          match_score: number
          organ_match: boolean
          blood_group_match: boolean
          city_match: boolean
          state_match: boolean
          urgency_boost: number
          status: string
          confirmed_by: string | null
          confirmed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          donor_id: string
          recipient_id: string
          request_id: string
          hospital_id?: string | null
          match_score?: number
          organ_match?: boolean
          blood_group_match?: boolean
          city_match?: boolean
          state_match?: boolean
          urgency_boost?: number
          status?: string
          confirmed_by?: string | null
          confirmed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          donor_id?: string
          recipient_id?: string
          request_id?: string
          hospital_id?: string | null
          match_score?: number
          organ_match?: boolean
          blood_group_match?: boolean
          city_match?: boolean
          state_match?: boolean
          urgency_boost?: number
          status?: string
          confirmed_by?: string | null
          confirmed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          actor_uid: string | null
          actor_role: string | null
          action_type: string
          target_id: string | null
          target_table: string | null
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          actor_uid?: string | null
          actor_role?: string | null
          action_type: string
          target_id?: string | null
          target_table?: string | null
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          actor_uid?: string | null
          actor_role?: string | null
          action_type?: string
          target_id?: string | null
          target_table?: string | null
          description?: string
          created_at?: string
        }
      }
      files: {
        Row: {
          id: string
          user_id: string
          related_table: string | null
          related_id: string | null
          file_name: string
          file_url: string
          file_type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          related_table?: string | null
          related_id?: string | null
          file_name: string
          file_url: string
          file_type?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          related_table?: string | null
          related_id?: string | null
          file_name?: string
          file_url?: string
          file_type?: string
          created_at?: string
        }
      }
    }
  }
}
