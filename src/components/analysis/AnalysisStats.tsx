import { Card, CardContent } from '@/components/ui/card';
import { FileImage, CheckCircle, AlertTriangle } from 'lucide-react';

interface AnalysisStatsProps {
  totalAnalyses: number;
  completedAnalyses: number;
  benignCount: number;
  malignantCount: number;
}

export const AnalysisStats = ({
  totalAnalyses,
  completedAnalyses,
  benignCount,
  malignantCount
}: AnalysisStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Analyses</p>
              <p className="text-2xl font-bold text-foreground">{totalAnalyses}</p>
            </div>
            <FileImage className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-foreground">{completedAnalyses}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Benign Cases</p>
              <p className="text-2xl font-bold text-green-600">{benignCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Malignant Cases</p>
              <p className="text-2xl font-bold text-destructive">{malignantCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};