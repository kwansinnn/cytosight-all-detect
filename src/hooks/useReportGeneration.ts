import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { ReportConfig } from '@/components/reports/ReportConfigForm';

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

interface ReportStatistics {
  totalAnalyses: number;
  malignantCount: number;
  benignCount: number;
  avgConfidence: number;
  totalCells: number;
}

export const useReportGeneration = () => {
  const [generatingReport, setGeneratingReport] = useState(false);

  const generateReport = async (
    reportConfig: ReportConfig,
    selectedUploadData: Upload[],
    reportStatistics: ReportStatistics,
    profileName?: string,
    profileEmail?: string
  ) => {
    if (selectedUploadData.length === 0) {
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
        generatedBy: profileName || profileEmail,
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

  return {
    generatingReport,
    generateReport
  };
};