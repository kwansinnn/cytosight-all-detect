import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  ResponsiveContainer
} from 'recharts';

interface OverviewChartsProps {
  classificationData: Array<{ name: string; value: number; color: string }>;
  confidenceData: Array<{ filename: string; confidence: number; date: string }>;
}

export const OverviewCharts = ({ classificationData, confidenceData }: OverviewChartsProps) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
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
  );
};