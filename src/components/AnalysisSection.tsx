import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Eye, Download, Share2 } from "lucide-react";

const AnalysisSection = () => {
  return (
    <section className="py-16 px-4 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Powerful Analysis Tools
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your cell images and get instant AI-powered analysis with detailed classifications and insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Image Upload</h3>
                  <p className="text-sm text-muted-foreground">Drag and drop or browse files</p>
                </div>
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Drop cell images here or</p>
                <Button variant="outline" size="sm">Browse Files</Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-medical-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-medical-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Real-time Analysis</h3>
                  <p className="text-sm text-muted-foreground">Instant AI classification</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Processing...</span>
                  <div className="w-32 h-2 bg-secondary rounded-full">
                    <div className="w-3/4 h-2 bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Analysis Results</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Cell Type: Lymphocyte</p>
                    <p className="text-sm text-muted-foreground">Confidence: 94.2%</p>
                  </div>
                  <Badge variant="secondary">High</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Abnormality: None detected</p>
                    <p className="text-sm text-muted-foreground">Confidence: 89.7%</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Normal</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Size: 8.2 μm</p>
                    <p className="text-sm text-muted-foreground">Within normal range</p>
                  </div>
                  <Badge variant="outline">Measured</Badge>
                </div>
              </div>

              <div className="flex space-x-2 mt-6">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisSection;