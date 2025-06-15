import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { ReportConfig } from './ReportConfigForm';

interface ReportPreviewProps {
  reportConfig: ReportConfig;
  selectedUploadsCount: number;
}

export const ReportPreview = ({ reportConfig, selectedUploadsCount }: ReportPreviewProps) => {
  if (selectedUploadsCount === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-2">
          <div className="font-medium text-foreground">
            {reportConfig.title || "Untitled Report"}
          </div>
          <div className="text-muted-foreground">
            Format: {reportConfig.format.toUpperCase()}
          </div>
          <div className="text-muted-foreground">
            Analyses: {selectedUploadsCount}
          </div>
          <div className="text-muted-foreground">
            Generated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};