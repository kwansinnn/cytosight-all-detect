import { useState, useMemo } from 'react';
import { useUploads } from '@/hooks/useUploads';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  FileText, 
  Download, 
  Printer, 
  Mail, 
  Calendar,
  FileImage,
  CheckCircle,
  AlertTriangle,
  Settings,
  Eye,
  Plus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReportConfig {
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

const Reports = () => {
  const { uploads, loading } = useUploads();
  const { profile } = useAuth();
  const [selectedUploads, setSelectedUploads] = useState<string[]>([]);
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    title: '',
    includeSummary: true,
    includeDetailedResults: true,
    includeImages: false,
    includeStatistics: true,
    includeTechnicalDetails: false,
    format: 'pdf',
    selectedUploads: [],
    dateRange: {
      start: '',
      end: ''
    },
    notes: ''
  });
  const [generatingReport, setGeneratingReport] = useState(false);

  const completedUploads = useMemo(() => 
    uploads.filter(upload => upload.status === 'completed'), 
    [uploads]
  );

  const selectedUploadData = useMemo(() => 
    completedUploads.filter(upload => selectedUploads.includes(upload.id)),
    [completedUploads, selectedUploads]
  );

  const reportStatistics = useMemo(() => {
    const selected = selectedUploadData;
    const malignantCount = selected.filter(upload => 
      upload.analysis_result?.classification === 'malignant'
    ).length;
    const benignCount = selected.length - malignantCount;
    const avgConfidence = selected.length > 0 
      ? selected.reduce((sum, upload) => sum + (upload.confidence_score || 0), 0) / selected.length
      : 0;
    const totalCells = selected.reduce((sum, upload) => sum + (upload.cell_count || 0), 0);

    return {
      totalAnalyses: selected.length,
      malignantCount,
      benignCount,
      avgConfidence: Math.round(avgConfidence * 100),
      totalCells
    };
  }, [selectedUploadData]);

  const handleSelectAll = () => {
    if (selectedUploads.length === completedUploads.length) {
      setSelectedUploads([]);
    } else {
      setSelectedUploads(completedUploads.map(upload => upload.id));
    }
  };

  const handleSelectUpload = (uploadId: string) => {
    setSelectedUploads(prev => 
      prev.includes(uploadId) 
        ? prev.filter(id => id !== uploadId)
        : [...prev, uploadId]
    );
  };

  const generateReport = async () => {
    if (selectedUploads.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one analysis to include in the report.",
        variant: "destructive",
      });
      return;
    }

    if (!reportConfig.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please provide a title for your report.",
        variant: "destructive",
      });
      return;
    }

    setGeneratingReport(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would call an edge function to generate the report
      const reportData = {
        ...reportConfig,
        selectedUploads: selectedUploadData,
        statistics: reportStatistics,
        generatedBy: profile?.full_name || profile?.email,
        generatedAt: new Date().toISOString(),
        organizationName: "CytoSight Medical Center" // This could come from user's profile
      };

      // Create a mock download
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportConfig.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Report Generated",
        description: `Your ${reportConfig.format.toUpperCase()} report has been downloaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingReport(false);
    }
  };

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analysis data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analysis Reports</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Generate professional reports for your cell analysis results
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          {/* Report Configuration */}
          <div className="xl:col-span-2 space-y-6">
            {/* Selection and Statistics */}
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

            {/* Analysis Selection */}
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
                    onClick={handleSelectAll}
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
                            onCheckedChange={() => handleSelectUpload(upload.id)}
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
          </div>

          {/* Report Preview and Actions */}
          <div className="space-y-6">
            {/* Report Statistics */}
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
                    <span className="font-medium text-foreground">{reportStatistics.totalAnalyses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Benign Cases:</span>
                    <span className="font-medium text-green-600">{reportStatistics.benignCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Malignant Cases:</span>
                    <span className="font-medium text-destructive">{reportStatistics.malignantCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Confidence:</span>
                    <span className="font-medium text-foreground">{reportStatistics.avgConfidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Cells:</span>
                    <span className="font-medium text-foreground">{reportStatistics.totalCells.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generation Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Report</CardTitle>
                <CardDescription>
                  Create and download your analysis report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={generateReport}
                  disabled={generatingReport || selectedUploads.length === 0}
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

            {/* Report Preview */}
            {selectedUploads.length > 0 && (
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
                      Analyses: {selectedUploads.length}
                    </div>
                    <div className="text-muted-foreground">
                      Generated: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;