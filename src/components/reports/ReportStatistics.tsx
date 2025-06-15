import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportStatisticsProps {
  totalAnalyses: number;
  benignCount: number;
  malignantCount: number;
  avgConfidence: number;
  totalCells: number;
}

export const ReportStatistics = ({
  totalAnalyses,
  benignCount,
  malignantCount,
  avgConfidence,
  totalCells
}: ReportStatisticsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Statistics</CardTitle>
        <CardDescription>
          Overview of selected analyses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Analyses:</span>
            <span className="font-medium text-foreground">{totalAnalyses}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Benign Cases:</span>
            <span className="font-medium text-green-600">{benignCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Malignant Cases:</span>
            <span className="font-medium text-destructive">{malignantCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Avg. Confidence:</span>
            <span className="font-medium text-foreground">{avgConfidence}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Cells:</span>
            <span className="font-medium text-foreground">{totalCells.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};