import { Card } from "@/components/ui/card";
import { Shield, Zap, Database, MessageSquare, BarChart3, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "HIPAA-compliant infrastructure ensures your data is protected with enterprise-grade security."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get analysis results in seconds with our optimized AI models and cloud infrastructure."
  },
  {
    icon: Database,
    title: "Data Management",
    description: "Organize, search, and manage your cell image library with powerful database tools."
  },
  {
    icon: MessageSquare,
    title: "Team Collaboration",
    description: "Share findings, discuss cases, and collaborate with colleagues in real-time."
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track patterns, generate reports, and gain insights from your analysis history."
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access your analysis tools anytime, anywhere with our cloud-based platform."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Built for Medical Professionals
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every feature is designed with the needs of healthcare professionals in mind, 
            ensuring accuracy, security, and efficiency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-medical-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-medical-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;