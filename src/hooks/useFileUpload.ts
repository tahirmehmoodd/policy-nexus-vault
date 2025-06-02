
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, policyId: string) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${policyId}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('policy-files')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('policy-files')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Download Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  return {
    uploadFile,
    downloadFile,
    uploading,
  };
}
