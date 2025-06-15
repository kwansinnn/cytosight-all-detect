import { useState, useMemo } from 'react';
import { useUploads } from '@/hooks/useUploads';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { FileText } from 'lucide-react';
import { ReportConfigForm, ReportConfig } from '@/components/reports/ReportConfigForm';
import { AnalysisSelection } from '@/components/reports/AnalysisSelection';
import { ReportStatistics } from '@/components/reports/ReportStatistics';
import { ReportGeneration } from '@/components/reports/ReportGeneration';
import { ReportPreview } from '@/components/reports/ReportPreview';
import { useReportGeneration } from '@/hooks/useReportGeneration';

const Reports = () => {
  const { uploads, loading } = useUploads();
  const { profile } = useAuth();
  const { generatingReport, generateReport } = useReportGeneration();
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

  const handleGenerateReport = () => {
    generateReport(
      reportConfig,
      selectedUploadData,
      reportStatistics,
      profile?.full_name,
      profile?.email
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
            <ReportConfigForm 
              reportConfig={reportConfig}
              setReportConfig={setReportConfig}
            />

            <AnalysisSelection
              uploads={uploads}
              selectedUploads={selectedUploads}
              onSelectAll={handleSelectAll}
              onSelectUpload={handleSelectUpload}
            />
          </div>

          {/* Report Preview and Actions */}
          <div className="space-y-6">
            <ReportStatistics {...reportStatistics} />

            <ReportGeneration
              reportConfig={reportConfig}
              setReportConfig={setReportConfig}
              generatingReport={generatingReport}
              selectedUploadsCount={selectedUploads.length}
              onGenerate={handleGenerateReport}
            />

            <ReportPreview
              reportConfig={reportConfig}
              selectedUploadsCount={selectedUploads.length}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;