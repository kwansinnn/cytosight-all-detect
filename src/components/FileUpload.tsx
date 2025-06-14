import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const FileUpload = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.tiff', '.bmp']
    },
    multiple: true
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!user || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        // Simulate analysis (replace with real AI service)
        const analysisResult = {
          cellCount: Math.floor(Math.random() * 100) + 50,
          cellTypes: ['Red Blood Cells', 'White Blood Cells', 'Platelets'],
          confidenceScore: Math.random() * 0.3 + 0.7
        };

        // Insert upload record
        const { error } = await supabase
          .from('uploads')
          .insert({
            user_id: user.id,
            filename: file.name,
            file_url: URL.createObjectURL(file), // In real app, upload to storage
            analysis_result: analysisResult,
            cell_count: analysisResult.cellCount,
            cell_types: analysisResult.cellTypes,
            confidence_score: analysisResult.confidenceScore,
            status: 'completed'
          });

        if (error) throw error;
      }

      toast.success(`Successfully analyzed ${files.length} image${files.length > 1 ? 's' : ''}`);
      setFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload and analyze images');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? 'Drop the files here' : 'Upload Cell Images'}
            </h3>
            <p className="text-muted-foreground">
              Drag & drop your microscopy images here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Supports: JPEG, PNG, TIFF, BMP
            </p>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4">Selected Files ({files.length})</h4>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center space-x-2">
                    <File className="h-4 w-4 text-primary" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleUpload} 
              disabled={uploading}
              className="w-full mt-4"
            >
              {uploading ? 'Analyzing...' : 'Start Analysis'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};