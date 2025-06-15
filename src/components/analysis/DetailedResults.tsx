import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter
} from 'lucide-react';

interface Upload {
  id: string;
  filename: string;
  status: string;
  cell_count?: number;
  confidence_score?: number;
  analysis_result?: any;
  created_at: string;
}

interface DetailedResultsProps {
  uploads: Upload[];
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export const DetailedResults = ({ uploads, selectedStatus, onStatusChange }: DetailedResultsProps) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Detailed Analysis Results</CardTitle>
        <CardDescription>
          Complete list of all analyzed images with classifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full sm:w-48">
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
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Filename</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Classification</TableHead>
                  <TableHead className="min-w-[100px] hidden md:table-cell">Cell Count</TableHead>
                  <TableHead className="min-w-[100px] hidden sm:table-cell">Confidence</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploads.map((upload) => (
                  <TableRow key={upload.id}>
                    <TableCell className="font-medium">
                      <div className="truncate max-w-[150px]" title={upload.filename}>
                        {upload.filename}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(upload.status)}
                        <span className="capitalize text-xs sm:text-sm">{upload.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {upload.status === 'completed' 
                        ? getClassificationBadge(upload.analysis_result)
                        : '-'
                      }
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {upload.cell_count ? upload.cell_count.toLocaleString() : '-'}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {upload.confidence_score 
                        ? `${Math.round(upload.confidence_score * 100)}%`
                        : '-'
                      }
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {new Date(upload.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};