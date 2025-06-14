import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileImage } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UploadSectionProps {
  onUploadComplete: (newUpload: any) => void;
}

const UploadSection = ({ onUploadComplete }: UploadSectionProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      // Simulate image analysis (in real app, this would call an AI service)
      const mockAnalysis = {
        cell_count: Math.floor(Math.random() * 500) + 50,
        cell_types: ['Red Blood Cells', 'White Blood Cells', 'Platelets'],
        confidence_score: Math.random() * 0.3 + 0.7, // 0.7 to 1.0
      };

      const { data, error } = await supabase
        .from('uploads')
        .insert({
          user_id: user.id,
          filename: file.name,
          file_url: URL.createObjectURL(file), // In real app, upload to storage
          analysis_result: mockAnalysis,
          cell_count: mockAnalysis.cell_count,
          cell_types: mockAnalysis.cell_types,
          confidence_score: mockAnalysis.confidence_score,
          status: 'completed',
        })
        .select()
        .single();

      if (error) throw error;

      onUploadComplete(data);
      toast({
        title: "Success!",
        description: `Analysis complete: ${mockAnalysis.cell_count} cells detected`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload New Image
        </CardTitle>
        <CardDescription>
          Upload microscopy images for AI-powered cell analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">
            Drag and drop your images here
          </p>
          <p className="text-muted-foreground mb-4">
            or click to browse files
          </p>
          <Button asChild disabled={uploading}>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? "Analyzing..." : "Choose File"}
            </label>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadSection;