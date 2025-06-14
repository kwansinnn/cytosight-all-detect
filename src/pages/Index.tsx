import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AnalysisSection from "@/components/AnalysisSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { FileUpload } from "@/components/FileUpload";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {user ? (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">
              Upload your cell images for AI-powered analysis
            </p>
          </div>
          <FileUpload />
        </div>
      ) : (
        <>
          <HeroSection />
          <AnalysisSection />
          <FeaturesSection />
        </>
      )}
      <Footer />
    </div>
  );
};

export default Index;
