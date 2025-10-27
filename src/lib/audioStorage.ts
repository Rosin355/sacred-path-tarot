import { supabase } from '@/integrations/supabase/client';

const AUDIO_BUCKET = 'audio';
const AUDIO_FILE_NAME = 'ambient-music.mp3';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const uploadAudioFile = async (file: File): Promise<{ error?: string }> => {
  try {
    // Validate file type
    if (!file.type.includes('audio/mpeg') && !file.name.endsWith('.mp3')) {
      return { error: 'Il file deve essere in formato MP3' };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return { error: 'Il file non può superare i 50MB' };
    }

    // Delete existing file if present
    const { error: deleteError } = await supabase.storage
      .from(AUDIO_BUCKET)
      .remove([AUDIO_FILE_NAME]);

    if (deleteError && deleteError.message !== 'Object not found') {
      console.error('Error deleting old file:', deleteError);
    }

    // Upload new file
    const { error: uploadError } = await supabase.storage
      .from(AUDIO_BUCKET)
      .upload(AUDIO_FILE_NAME, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      return { error: uploadError.message };
    }

    return {};
  } catch (error: any) {
    return { error: error.message || 'Errore durante l\'upload del file' };
  }
};

export const getAudioFileUrl = (): string | null => {
  try {
    const { data } = supabase.storage
      .from(AUDIO_BUCKET)
      .getPublicUrl(AUDIO_FILE_NAME);

    return data.publicUrl;
  } catch (error) {
    console.error('Error getting audio URL:', error);
    return null;
  }
};

export const deleteAudioFile = async (): Promise<{ error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .remove([AUDIO_FILE_NAME]);

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (error: any) {
    return { error: error.message || 'Errore durante l\'eliminazione del file' };
  }
};

export const checkAudioFileExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .list('', {
        search: AUDIO_FILE_NAME
      });

    if (error) return false;
    return data.length > 0;
  } catch (error) {
    return false;
  }
};
