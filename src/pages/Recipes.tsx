import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { recipes } from "@/data/recipes";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Recipes = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>("all");

  const filteredRecipes =
    filter === "all"
      ? recipes
      : recipes.filter((r) => r.category === filter);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <p className="text-sm opacity-90">15 high-protein vegetarian meals</p>
      </header>

      <main className="container max-w-2xl mx-auto p-4">
        <Tabs defaultValue="all" className="mb-4" onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
            <TabsTrigger value="lunch">Lunch</TabsTrigger>
            <TabsTrigger value="dinner">Dinner</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          {filteredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{recipe.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {recipe.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {recipe.proteinSource}
              </p>
              <p className="text-xs text-muted-foreground">
                {recipe.ingredients.length} ingredients
              </p>
            </Card>
          ))}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Recipes;
