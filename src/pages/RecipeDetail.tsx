import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { recipes } from "@/data/recipes";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipe = recipes.find((r) => r.id === parseInt(id || "0"));

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Recipe not found</p>
      </div>
    );
  }

  const addToShoppingList = () => {
    toast.success("Added to shopping list!", {
      description: `Ingredients for ${recipe.name}`,
    });
    // Navigate to shopping after a brief delay
    setTimeout(() => navigate("/shopping"), 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground p-6 shadow-lg">
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-foreground mb-2 -ml-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{recipe.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary">{recipe.category}</Badge>
          <p className="text-sm opacity-90">{recipe.proteinSource}</p>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto p-4 space-y-4">
        {/* Ingredients */}
        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-3">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Instructions */}
        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-3">Instructions</h2>
          <ol className="space-y-3">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {idx + 1}
                </span>
                <span className="flex-1 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </Card>

        {/* Add to Shopping List Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={addToShoppingList}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Shopping List
        </Button>
      </main>

      <Navigation />
    </div>
  );
};

export default RecipeDetail;
