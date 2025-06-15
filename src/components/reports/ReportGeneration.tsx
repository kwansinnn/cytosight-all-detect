import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, Mail, Plus } from 'lucide-react';
import { ReportConfig } from './ReportConfigForm';

interface ReportGenerationProps {
  reportConfig: ReportConfig;
  setReportConfig: (config: ReportConfig | ((prev: ReportConfig) => ReportConfig)) => void;
  generatingReport: boolean;
  selectedUploadsCount: number;
  onGenerate: () => void;
}

export const ReportGeneration = ({
  reportConfig,
  setReportConfig,
  generatingReport,
  selectedUploadsCount,
  onGenerate
}: ReportGenerationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Report</CardTitle>
        <CardDescription>
          Create and download your analysis report
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={onGenerate}
          disabled={generatingReport || selectedUploadsCount === 0}
          className="w-full"
          size="lg"
        >
          {generatingReport ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
              Generating Report...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generate {reportConfig.format.toUpperCase()} Report
            </>
          )}
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" disabled>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="font-medium text-foreground mb-2">Quick Actions</h4>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => {
                setReportConfig(prev => ({
                  ...prev,
                  title: "Weekly Analysis Summary",
                  includeSummary: true,
                  includeStatistics: true,
                  includeDetailedResults: false
                }));
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Weekly Summary Template
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => {
                setReportConfig(prev => ({
                  ...prev,
                  title: "Detailed Clinical Report",
                  includeSummary: true,
                  includeDetailedResults: true,
                  includeImages: true,
                  includeTechnicalDetails: true
                }));
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Clinical Report Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};