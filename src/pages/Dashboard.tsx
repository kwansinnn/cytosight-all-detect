import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileImage, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Upload {
  id: string;
  filename: string;
  status: string;
  cell_count?: number;
  cell_types?: string[];
  confidence_score?: number;
  created_at: string;
}

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUploads();
  }, []);

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

      setUploads(prev => [data, ...prev]);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {profile?.full_name || user?.email}
          </h1>
          <p className="text-muted-foreground">
            Upload and analyze your cell images with AI-powered precision
          </p>
        </div>

        {/* Upload Section */}
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

        {/* Analysis History */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis History</CardTitle>
            <CardDescription>
              Your recent cell analysis results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploads.length === 0 ? (
              <div className="text-center py-8">
                <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No analyses yet. Upload your first image to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {uploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(upload.status)}
                      <div>
                        <p className="font-medium text-foreground">
                          {upload.filename}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(upload.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {upload.status === 'completed' && (
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          {upload.cell_count} cells
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Math.round((upload.confidence_score || 0) * 100)}% confidence
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;