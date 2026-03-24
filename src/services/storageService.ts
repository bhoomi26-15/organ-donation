import { supabase } from '../lib/supabase';

export const uploadFile = async (
  file: File,
  bucketName: string,
  userId: string,
  relatedTable: string,
  relatedId: string
) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `${bucketName}/${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    // Record in files table
    const { data: fileRecord, error: dbError } = await supabase.from('files').insert({
      user_id: userId,
      related_table: relatedTable,
      related_id: relatedId,
      file_name: file.name,
      file_url: publicUrl,
      file_type: file.type,
    }).select().single();

    if (dbError) throw dbError;

    return fileRecord;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};
