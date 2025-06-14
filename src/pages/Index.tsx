import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AnalysisSection from "@/components/AnalysisSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import IndexSidebar from "@/components/IndexSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <IndexSidebar />
        <main className="flex-1">
          <div className="sticky top-0 z-50 bg-card border-b border-border p-2">
            <SidebarTrigger />
          </div>
          <Header />
          <HeroSection />
          <AnalysisSection />
          <FeaturesSection />
          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;