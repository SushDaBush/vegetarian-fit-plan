import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { recipes } from "@/data/recipes";
import { getDayLog, saveDayLog } from "@/lib/storage";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const SelectMeal = () => {
  const { date, mealType } = useParams<{ date: string; mealType: "lunch" | "dinner" }>();
  const navigate = useNavigate();

  const selectMeal = (recipeId: number) => {
    if (!date || !mealType) return;

    const log = getDayLog(date);
    if (log) {
      const updated = {
        ...log,
        [mealType]: recipeId,
      };
      saveDayLog(updated);
      toast.success("Meal selected!", {
        description: recipes.find((r) => r.id === recipeId)?.name,
      });
      navigate("/");
    }
  };

  const currentLog = date ? getDayLog(date) : null;
  const currentMealId = currentLog && mealType ? currentLog[mealType] : null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground p-6 shadow-lg">
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-foreground mb-2 -ml-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Select {mealType}</h1>
        <p className="text-sm opacity-90">{date}</p>
      </header>

      <main className="container max-w-2xl mx-auto p-4 space-y-3">
        {recipes.map((recipe) => {
          const isSelected = recipe.id === currentMealId;
          return (
            <Card
              key={recipe.id}
              className={`p-4 cursor-pointer hover:shadow-lg transition-all ${
                isSelected ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => selectMeal(recipe.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{recipe.name}</h3>
                <div className="flex gap-2">
                  {isSelected && (
                    <Badge variant="default">Selected</Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {recipe.category}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {recipe.proteinSource}
              </p>
            </Card>
          );
        })}
      </main>

      <Navigation />
    </div>
  );
};

export default SelectMeal;
