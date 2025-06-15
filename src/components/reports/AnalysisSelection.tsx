import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FileImage } from 'lucide-react';

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

interface AnalysisSelectionProps {
  uploads: Upload[];
  selectedUploads: string[];
  onSelectAll: () => void;
  onSelectUpload: (uploadId: string) => void;
}

export const AnalysisSelection = ({ 
  uploads, 
  selectedUploads, 
  onSelectAll, 
  onSelectUpload 
}: AnalysisSelectionProps) => {
  const completedUploads = useMemo(() => 
    uploads.filter(upload => upload.status === 'completed'), 
    [uploads]
  );

  const getClassificationBadge = (result: any) => {
    if (!result || typeof result !== 'object' || !('classification' in result)) {
      return <Badge variant="secondary">Unknown</Badge>;
    }
    
    const classification = result.classification;
    return (
      <Badge variant={classification === 'malignant' ? 'destructive' : 'default'}>
        {classification === 'malignant' ? 'Malignant' : 'Benign'}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Select Analyses</CardTitle>
            <CardDescription>
              Choose which completed analyses to include in your report
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={onSelectAll}
            className="text-sm"
          >
            {selectedUploads.length === completedUploads.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {completedUploads.length === 0 ? (
          <div className="text-center py-8">
            <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No completed analyses available for reporting.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {completedUploads.map((upload) => (
              <div
                key={upload.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors gap-3"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <Checkbox
                    checked={selectedUploads.includes(upload.id)}
                    onCheckedChange={() => onSelectUpload(upload.id)}
                  />
                  <div className="flex items-center gap-2 min-w-0">
                    <FileImage className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium text-foreground truncate">{upload.filename}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  {getClassificationBadge(upload.analysis_result)}
                  <span className="text-sm text-muted-foreground">
                    {new Date(upload.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};