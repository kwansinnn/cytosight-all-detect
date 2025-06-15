import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Upload {
  id: string;
  filename: string;
  status: string;
  cell_count?: number;
  cell_types?: string[];
  confidence_score?: number;
  analysis_result?: any;
  created_at: string;
}

export const useUploads = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUploads = async () => {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUploads(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your uploads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addUpload = (newUpload: Upload) => {
    setUploads(prev => [newUpload, ...prev]);
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  return {
    uploads,
    loading,
    addUpload,
    refetch: fetchUploads,
  };
};