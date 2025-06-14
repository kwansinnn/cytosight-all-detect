import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Brain, Users, BarChart3 } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Advanced Cell Image 
          <span className="text-primary"> Analysis</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Harness the power of AI to analyze cell images with precision. Upload, classify, and collaborate with medical professionals worldwide.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="px-8">
            Start Analysis
          </Button>
          <Button variant="outline" size="lg" className="px-8">
            View Demo
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-medical-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="h-6 w-6 text-medical-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload Images</h3>
            <p className="text-muted-foreground">
              Securely upload cell images for instant AI-powered analysis and classification.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-medical-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-medical-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Classification</h3>
            <p className="text-muted-foreground">
              Advanced machine learning models provide accurate cell type identification and analysis.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-medical-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-medical-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Collaborate</h3>
            <p className="text-muted-foreground">
              Share findings and discuss results with colleagues in a secure environment.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;