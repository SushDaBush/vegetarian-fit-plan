import { WeeklyDashboard } from "@/components/WeeklyDashboard";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground p-6 shadow-lg">
        <h1 className="text-2xl font-bold">FitVegetarian</h1>
        <p className="text-sm opacity-90">Body Recomposition Companion</p>
      </header>
      
      <main className="container max-w-2xl mx-auto p-4">
        <WeeklyDashboard />
      </main>

      <Navigation />
    </div>
  );
};

export default Index;
