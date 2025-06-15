import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Shield, Users, Zap, Microscope, BarChart3 } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/a52e9727-e953-466a-bcf3-6c44855a2876.png" 
                  alt="CytoSight Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-4xl font-bold text-foreground">CytoSight</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-8">
              Revolutionizing Cell Image Analysis for Medical Professionals
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              CytoSight is an advanced AI-powered platform designed specifically for medical professionals 
              to analyze cell images with unprecedented accuracy and efficiency. Our cutting-edge technology 
              streamlines the diagnostic process while maintaining the highest standards of security and compliance.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Our Mission</h2>
            <Card className="p-8">
              <CardContent className="p-0">
                <p className="text-lg text-muted-foreground text-center">
                  To empower healthcare professionals with intelligent tools that enhance diagnostic accuracy, 
                  reduce analysis time, and improve patient outcomes through innovative AI-driven cell image analysis.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Why Choose CytoSight?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="w-12 h-12 bg-medical-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-muted-foreground">
                  Advanced machine learning algorithms trained on vast datasets provide accurate cell classification and analysis.
                </p>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 bg-medical-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">HIPAA Compliant</h3>
                <p className="text-muted-foreground">
                  Enterprise-grade security ensures all patient data and medical images are protected according to healthcare standards.
                </p>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 bg-medical-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Get analysis results in seconds, dramatically reducing the time from sample to diagnosis.
                </p>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 bg-medical-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
                <p className="text-muted-foreground">
                  Share findings, discuss cases, and collaborate with colleagues in a secure, real-time environment.
                </p>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 bg-medical-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Track patterns, generate comprehensive reports, and gain insights from your analysis history.
                </p>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 bg-medical-100 rounded-lg flex items-center justify-center mb-4">
                  <Microscope className="h-6 w-6 text-medical-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Medical Expertise</h3>
                <p className="text-muted-foreground">
                  Built by medical professionals for medical professionals, ensuring clinically relevant results.
                </p>
              </Card>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">How It Works</h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Upload Cell Images</h3>
                  <p className="text-muted-foreground">
                    Securely upload your cell images in various formats. Our platform supports high-resolution images 
                    and maintains image quality throughout the analysis process.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
                  <p className="text-muted-foreground">
                    Our advanced AI algorithms analyze your images, identifying cell types, detecting abnormalities, 
                    and providing detailed classification results with confidence scores.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Review & Collaborate</h3>
                  <p className="text-muted-foreground">
                    Review detailed results, share findings with colleagues, and collaborate on complex cases. 
                    Export reports and integrate findings into your existing workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="p-8 bg-gradient-to-r from-medical-50 to-medical-100 border-medical-200">
              <CardContent className="p-0">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Transform Your Cell Analysis Workflow?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Join thousands of medical professionals who trust CytoSight for accurate, 
                  fast, and secure cell image analysis.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/contact" 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    Contact Us
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;