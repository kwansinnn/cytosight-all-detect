import { useState, useMemo } from 'react';
import { useUploads } from '@/hooks/useUploads';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Eye, 
  Download,
  Calendar,
  FileImage,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const History = () => {
  const { uploads, loading } = useUploads();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classificationFilter, setClassificationFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedUpload, setSelectedUpload] = useState<any>(null);

  const filteredUploads = useMemo(() => {
    return uploads.filter(upload => {
      // Search filter
      const matchesSearch = upload.filename.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || upload.status === statusFilter;
      
      // Classification filter
      let matchesClassification = true;
      if (classificationFilter !== 'all' && upload.analysis_result) {
        const classification = upload.analysis_result?.classification;
        matchesClassification = classification === classificationFilter;
      }
      
      // Date filter
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const uploadDate = new Date(upload.created_at);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - uploadDate.getTime()) / (1000 * 3600 * 24));
        
        switch (dateFilter) {
          case '7d':
            matchesDate = daysDiff <= 7;
            break;
          case '30d':
            matchesDate = daysDiff <= 30;
            break;
          case '90d':
            matchesDate = daysDiff <= 90;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesClassification && matchesDate;
    });
  }, [uploads, searchTerm, statusFilter, classificationFilter, dateFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getAnalysisDetails = (upload: any) => {
    if (!upload.analysis_result) return null;
    
    return {
      classification: upload.analysis_result.classification || 'Unknown',
      confidence: upload.confidence_score ? Math.round(upload.confidence_score * 100) : 0,
      cellCount: upload.cell_count || 0,
      cellTypes: upload.cell_types || [],
      processingTime: upload.analysis_result.processing_time_ms || 'N/A'
    };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analysis history...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <HistoryIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analysis History</h1>
            <p className="text-muted-foreground mt-1">
              Complete record of all your microscopy image analyses
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileImage className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{uploads.length}</p>
                  <p className="text-sm text-muted-foreground">Total Uploads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {uploads.filter(u => u.status === 'completed').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {uploads.filter(u => u.status === 'processing').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Processing</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {uploads.filter(u => u.status === 'failed').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by filename..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={classificationFilter} onValueChange={setClassificationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classifications</SelectItem>
                  <SelectItem value="benign">Benign</SelectItem>
                  <SelectItem value="malignant">Malignant</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setClassificationFilter('all');
                  setDateFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Records</CardTitle>
            <CardDescription>
              {filteredUploads.length} of {uploads.length} records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredUploads.length === 0 ? (
              <div className="text-center py-12">
                <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No records found</h3>
                <p className="text-muted-foreground">
                  {uploads.length === 0 
                    ? "No analyses have been performed yet."
                    : "No records match your current filters. Try adjusting your search criteria."
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filename</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Classification</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Cell Count</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUploads.map((upload) => {
                      const dateTime = formatDate(upload.created_at);
                      const details = getAnalysisDetails(upload);
                      
                      return (
                        <TableRow key={upload.id} className="animate-fade-in">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileImage className="h-4 w-4 text-muted-foreground" />
                              {upload.filename}
                            </div>
                          </TableCell>
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
                            {details?.confidence 
                              ? `${details.confidence}%`
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            {details?.cellCount 
                              ? details.cellCount.toLocaleString()
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{dateTime.date}</div>
                              <div className="text-muted-foreground">{dateTime.time}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedUpload(upload)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <FileImage className="h-5 w-5" />
                                      Analysis Details
                                    </DialogTitle>
                                    <DialogDescription>
                                      Detailed information for {upload.filename}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {upload && (
                                    <div className="space-y-6">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="font-medium text-foreground mb-2">File Information</h4>
                                          <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Filename:</span>
                                              <span className="font-medium">{upload.filename}</span>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Status:</span>
                                              <div className="flex items-center gap-1">
                                                {getStatusIcon(upload.status)}
                                                <span className="capitalize">{upload.status}</span>
                                              </div>
                                            </div>
                                            <div className="flex justify-between">
                                              <span className="text-muted-foreground">Upload Date:</span>
                                              <span>{dateTime.date} at {dateTime.time}</span>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {details && (
                                          <div>
                                            <h4 className="font-medium text-foreground mb-2">Analysis Results</h4>
                                            <div className="space-y-2 text-sm">
                                              <div className="flex justify-between">
                                                <span className="text-muted-foreground">Classification:</span>
                                                {getClassificationBadge(upload.analysis_result)}
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-muted-foreground">Confidence:</span>
                                                <span className="font-medium">{details.confidence}%</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-muted-foreground">Cell Count:</span>
                                                <span className="font-medium">{details.cellCount.toLocaleString()}</span>
                                              </div>
                                              {details.cellTypes.length > 0 && (
                                                <div>
                                                  <span className="text-muted-foreground">Cell Types:</span>
                                                  <div className="flex flex-wrap gap-1 mt-1">
                                                    {details.cellTypes.map((type, index) => (
                                                      <Badge key={index} variant="outline" className="text-xs">
                                                        {type}
                                                      </Badge>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {upload.analysis_result && (
                                        <div>
                                          <h4 className="font-medium text-foreground mb-2">Technical Details</h4>
                                          <div className="bg-muted/30 rounded-lg p-3">
                                            <pre className="text-xs text-muted-foreground overflow-auto">
                                              {JSON.stringify(upload.analysis_result, null, 2)}
                                            </pre>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={upload.status !== 'completed'}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default History;