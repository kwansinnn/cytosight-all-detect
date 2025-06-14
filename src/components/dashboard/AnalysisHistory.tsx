import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Upload {
  id: string;
  filename: string;
  status: string;
  cell_count?: number;
  cell_types?: string[];
  confidence_score?: number;
  created_at: string;
}

interface AnalysisHistoryProps {
  uploads: Upload[];
}

const AnalysisHistory = ({ uploads }: AnalysisHistoryProps) => {
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

  return (
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
  );
};

export default AnalysisHistory;