import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUploads } from '@/hooks/useUploads';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  FileImage, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Download,
  Filter
} from 'lucide-react';

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return null;
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

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cell Analysis Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive analysis of your microscopy images
            </p>
          </div>
          <div className="flex gap-4">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Analyses</p>
                  <p className="text-2xl font-bold text-foreground">{uploads.length}</p>
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
                  <p className="text-2xl font-bold text-foreground">{completedUploads.length}</p>
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

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Classification Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Classification Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of benign vs malignant classifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={classificationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {classificationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Confidence Scores */}
              <Card>
                <CardHeader>
                  <CardTitle>Confidence Scores</CardTitle>
                  <CardDescription>
                    Model confidence for recent analyses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={confidenceData.slice(-10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="filename" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="confidence" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analysis Results</CardTitle>
                <CardDescription>
                  Complete list of all analyzed images with classifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Filename</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Classification</TableHead>
                        <TableHead>Cell Count</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploads.map((upload) => (
                        <TableRow key={upload.id}>
                          <TableCell className="font-medium">{upload.filename}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(upload.status)}
                              <span className="capitalize">{upload.status}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {upload.status === 'completed' 
                              ? getClassificationBadge(upload.analysis_result)
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            {upload.cell_count ? upload.cell_count.toLocaleString() : '-'}
                          </TableCell>
                          <TableCell>
                            {upload.confidence_score 
                              ? `${Math.round(upload.confidence_score * 100)}%`
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            {new Date(upload.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
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