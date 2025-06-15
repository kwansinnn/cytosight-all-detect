import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export interface ReportConfig {
  title: string;
  includeSummary: boolean;
  includeDetailedResults: boolean;
  includeImages: boolean;
  includeStatistics: boolean;
  includeTechnicalDetails: boolean;
  format: 'pdf' | 'docx' | 'html';
  selectedUploads: string[];
  dateRange: {
    start: string;
    end: string;
  };
  notes: string;
}

interface ReportConfigFormProps {
  reportConfig: ReportConfig;
  setReportConfig: (config: ReportConfig | ((prev: ReportConfig) => ReportConfig)) => void;
}

export const ReportConfigForm = ({ reportConfig, setReportConfig }: ReportConfigFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Report Configuration
        </CardTitle>
        <CardDescription>
          Configure your report settings and select analyses to include
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Report Title</label>
            <Input
              placeholder="Enter report title..."
              value={reportConfig.title}
              onChange={(e) => setReportConfig(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Format</label>
            <Select
              value={reportConfig.format}
              onValueChange={(value: 'pdf' | 'docx' | 'html') => 
                setReportConfig(prev => ({ ...prev, format: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="docx">Word Document</SelectItem>
                <SelectItem value="html">HTML Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Options */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">Include in Report</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="summary"
                checked={reportConfig.includeSummary}
                onCheckedChange={(checked) => 
                  setReportConfig(prev => ({ ...prev, includeSummary: !!checked }))
                }
              />
              <label htmlFor="summary" className="text-sm text-foreground">Executive Summary</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="detailed"
                checked={reportConfig.includeDetailedResults}
                onCheckedChange={(checked) => 
                  setReportConfig(prev => ({ ...prev, includeDetailedResults: !!checked }))
                }
              />
              <label htmlFor="detailed" className="text-sm text-foreground">Detailed Results</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="statistics"
                checked={reportConfig.includeStatistics}
                onCheckedChange={(checked) => 
                  setReportConfig(prev => ({ ...prev, includeStatistics: !!checked }))
                }
              />
              <label htmlFor="statistics" className="text-sm text-foreground">Statistics</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="images"
                checked={reportConfig.includeImages}
                onCheckedChange={(checked) => 
                  setReportConfig(prev => ({ ...prev, includeImages: !!checked }))
                }
              />
              <label htmlFor="images" className="text-sm text-foreground">Images</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="technical"
                checked={reportConfig.includeTechnicalDetails}
                onCheckedChange={(checked) => 
                  setReportConfig(prev => ({ ...prev, includeTechnicalDetails: !!checked }))
                }
              />
              <label htmlFor="technical" className="text-sm text-foreground">Technical Details</label>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Additional Notes</label>
          <Textarea
            placeholder="Add any additional notes or comments for the report..."
            value={reportConfig.notes}
            onChange={(e) => setReportConfig(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};