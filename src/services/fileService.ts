import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type FileRecord = Database['public']['Tables']['files']['Row'];

export const fileService = {
  /**
   * Upload file to Supabase Storage
   */
  async uploadFile(
    userId: string,
    bucket: string,
    filePath: string,
    file: File
  ) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;
    return data;
  },

  /**
   * Get public URL for file
   */
  getPublicUrl(bucket: string, filePath: string) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data?.publicUrl;
  },

  /**
   * Delete file from storage
   */
  async deleteFile(bucket: string, filePath: string) {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) throw error;
  },

  /**
   * Create file record in database
   */
  async createFileRecord(
    userId: string,
    relatedTable: string,
    relatedId: string,
    fileName: string,
    fileUrl: string,
    fileType: string
  ) {
    const { data, error } = await supabase
      .from('files')
      .insert({
        user_id: userId,
        related_table: relatedTable,
        related_id: relatedId,
        file_name: fileName,
        file_url: fileUrl,
        file_type: fileType,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get files for a record
   */
  async getFiles(relatedTable: string, relatedId: string) {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('related_table', relatedTable)
      .eq('related_id', relatedId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Delete file record
   */
  async deleteFileRecord(fileId: string) {
    const { error } = await supabase.from('files').delete().eq('id', fileId);
    if (error) throw error;
  },

  /**
   * Upload donor document
   */
  async uploadDonorDocument(userId: string, donorId: string, file: File) {
    const timestamp = Date.now();
    const fileName = `donor_${donorId}_${timestamp}_${file.name}`;
    const filePath = `donors/${donorId}/${fileName}`;

    const uploadedFile = await this.uploadFile(userId, 'organ-documents', filePath, file);
    const fileUrl = this.getPublicUrl('organ-documents', uploadedFile.path);

    return this.createFileRecord(
      userId,
      'donors',
      donorId,
      file.name,
      fileUrl,
      file.type
    );
  },

  /**
   * Upload recipient document
   */
  async uploadRecipientDocument(userId: string, recipientId: string, file: File) {
    const timestamp = Date.now();
    const fileName = `recipient_${recipientId}_${timestamp}_${file.name}`;
    const filePath = `recipients/${recipientId}/${fileName}`;

    const uploadedFile = await this.uploadFile(userId, 'organ-documents', filePath, file);
    const fileUrl = this.getPublicUrl('organ-documents', uploadedFile.path);

    return this.createFileRecord(
      userId,
      'recipients',
      recipientId,
      file.name,
      fileUrl,
      file.type
    );
  },

  /**
   * Upload hospital verification document
   */
  async uploadVerificationDocument(userId: string, hospitalId: string, file: File) {
    const timestamp = Date.now();
    const fileName = `verification_${hospitalId}_${timestamp}_${file.name}`;
    const filePath = `hospitals/${hospitalId}/${fileName}`;

    const uploadedFile = await this.uploadFile(userId, 'organ-documents', filePath, file);
    const fileUrl = this.getPublicUrl('organ-documents', uploadedFile.path);

    return this.createFileRecord(
      userId,
      'hospitals',
      hospitalId,
      file.name,
      fileUrl,
      file.type
    );
  },
};
