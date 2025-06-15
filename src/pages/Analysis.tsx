import { useState } from 'react';
import { useUploads } from '@/hooks/useUploads';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { Download } from 'lucide-react';
import { AnalysisStats } from '@/components/analysis/AnalysisStats';
import { OverviewCharts } from '@/components/analysis/OverviewCharts';
import { DetailedResults } from '@/components/analysis/DetailedResults';

const Analysis = () => {
  const { uploads, loading } = useUploads();
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

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

  const completedUploads = uploads.filter(upload => upload.status === 'completed');
  const malignantCount = completedUploads.filter(upload => 
    upload.analysis_result && 
    typeof upload.analysis_result === 'object' && 
    'classification' in upload.analysis_result &&
    upload.analysis_result.classification === 'malignant'
  ).length;
  const benignCount = completedUploads.length - malignantCount;

  // Sample data for charts
  const classificationData = [
    { name: 'Benign', value: benignCount, color: '#22c55e' },
    { name: 'Malignant', value: malignantCount, color: '#ef4444' }
  ];

  const monthlyData = [
    { month: 'Jan', benign: 12, malignant: 3 },
    { month: 'Feb', benign: 15, malignant: 2 },
    { month: 'Mar', benign: 18, malignant: 5 },
    { month: 'Apr', benign: 14, malignant: 4 },
    { month: 'May', benign: 20, malignant: 6 },
    { month: 'Jun', benign: 16, malignant: 3 }
  ];

  const confidenceData = completedUploads.map(upload => ({
    filename: upload.filename,
    confidence: Math.round((upload.confidence_score || 0) * 100),
    date: new Date(upload.created_at).toLocaleDateString()
  }));

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Cell Analysis Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">
              Comprehensive analysis of your microscopy images
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>

        <AnalysisStats
          totalAnalyses={uploads.length}
          completedAnalyses={completedUploads.length}
          benignCount={benignCount}
          malignantCount={malignantCount}
        />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewCharts
              classificationData={classificationData}
              confidenceData={confidenceData}
            />
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <DetailedResults
              uploads={uploads}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Analysis Trends</CardTitle>
                <CardDescription>
                  Classification trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="benign" 
                      stroke="#22c55e" 
                      name="Benign"
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="malignant" 
                      stroke="#ef4444" 
                      name="Malignant"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analysis;