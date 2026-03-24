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
      donors: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string
          age: number
          gender: string
          blood_group: string
          organ_type: string
          city: string
          state: string
          address: string
          medical_history: string | null
          emergency_contact: string
          donor_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone: string
          age: number
          gender: string
          blood_group: string
          organ_type: string
          city: string
          state: string
          address: string
          medical_history?: string | null
          emergency_contact: string
          donor_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string
          age?: number
          gender?: string
          blood_group?: string
          organ_type?: string
          city?: string
          state?: string
          address?: string
          medical_history?: string | null
          emergency_contact?: string
          donor_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      needers: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string
          age: number
          gender: string
          blood_group: string
          needed_organ: string
          city: string
          state: string
          address: string
          medical_condition: string
          urgency_level: string
          doctor_name: string
          needer_status: string
          matched_donor_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone: string
          age: number
          gender: string
          blood_group: string
          needed_organ: string
          city: string
          state: string
          address: string
          medical_condition: string
          urgency_level?: string
          doctor_name: string
          needer_status?: string
          matched_donor_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string
          age?: number
          gender?: string
          blood_group?: string
          needed_organ?: string
          city?: string
          state?: string
          address?: string
          medical_condition?: string
          urgency_level?: string
          doctor_name?: string
          needer_status?: string
          matched_donor_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      admins: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string
          password_hint: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone: string
          password_hint?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string
          password_hint?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
