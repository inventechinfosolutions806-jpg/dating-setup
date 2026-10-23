import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useUpdateProfile } from '@/features/auth/hooks/useAuth';

export function usePhotoUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateProfile = useUpdateProfile();

  const uploadPhoto = useCallback(
    async (uri: string) => {
      setUploading(true);
      setError(null);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No active session');

        const fileExt = uri.split('.').pop() ?? 'jpg';
        const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;

        const formData = new FormData();
        formData.append('file', {
          uri,
          type: `image/${fileExt}`,
          name: fileName,
        } as unknown as Blob);

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, formData);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        updateProfile.mutate({ photoUrl: publicUrl });
        return publicUrl;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setError(message);
        return null;
      } finally {
        setUploading(false);
      }
    },
    [updateProfile],
  );

  return { uploadPhoto, uploading, error };
}
