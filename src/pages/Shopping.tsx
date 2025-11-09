import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  formatDate,
  addDays,
  getDayLog,
  getShoppingList,
  saveShoppingList,
  type ShoppingListItem,
} from "@/lib/storage";
import { recipes } from "@/data/recipes";
import { ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Shopping = () => {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setShoppingList(getShoppingList());
  }, []);

  const generateListForNextWeek = () => {
    setIsGenerating(true);
    const ingredientsMap: Record<string, boolean> = {};
    
    // Get next 7 days
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = formatDate(addDays(today, i));
      const log = getDayLog(date);
      
      if (log) {
        // Add lunch ingredients
        if (log.lunch) {
          const recipe = recipes.find((r) => r.id === log.lunch);
          recipe?.ingredients.forEach((ing) => {
            ingredientsMap[ing] = false;
          });
        }
        
        // Add dinner ingredients
        if (log.dinner) {
          const recipe = recipes.find((r) => r.id === log.dinner);
          recipe?.ingredients.forEach((ing) => {
            ingredientsMap[ing] = false;
          });
        }
      }
    }

    const newList: ShoppingListItem[] = Object.keys(ingredientsMap).map((ing) => ({
      ingredient: ing,
      category: categorizeIngredient(ing),
      checked: false,
    }));

    // Sort by category
    newList.sort((a, b) => a.category.localeCompare(b.category));

    setShoppingList(newList);
    saveShoppingList(newList);
    setIsGenerating(false);
    toast.success("Shopping list generated!", {
      description: `${newList.length} items for the next 7 days`,
    });
  };

  const categorizeIngredient = (ingredient: string): string => {
    const lower = ingredient.toLowerCase();
    if (lower.includes("paneer") || lower.includes("tofu") || lower.includes("yogurt") || lower.includes("soya")) {
      return "Protein";
    }
    if (lower.includes("onion") || lower.includes("tomato") || lower.includes("spinach") || lower.includes("pepper") || lower.includes("vegetable")) {
      return "Produce";
    }
    if (lower.includes("oil") || lower.includes("spice") || lower.includes("masala") || lower.includes("salt") || lower.includes("turmeric")) {
      return "Spices & Oil";
    }
    if (lower.includes("lentil") || lower.includes("bean") || lower.includes("chickpea") || lower.includes("dal") || lower.includes("oats") || lower.includes("flour")) {
      return "Grains & Legumes";
    }
    return "Pantry";
  };

  const toggleItem = (index: number) => {
    const updated = [...shoppingList];
    updated[index].checked = !updated[index].checked;
    setShoppingList(updated);
    saveShoppingList(updated);
  };

  const clearList = () => {
    setShoppingList([]);
    saveShoppingList([]);
    toast.success("Shopping list cleared");
  };

  const groupedList = shoppingList.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Shopping List</h1>
        <p className="text-sm opacity-90">
          {shoppingList.length} items • {shoppingList.filter((i) => i.checked).length} checked
        </p>
      </header>

      <main className="container max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={generateListForNextWeek}
            disabled={isGenerating}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Generate for Next 7 Days
          </Button>
          {shoppingList.length > 0 && (
            <Button variant="outline" onClick={clearList}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {shoppingList.length === 0 ? (
          <Card className="p-8 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No items in your shopping list yet
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Generate a list for the next 7 days or add items from recipes
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedList).map(([category, items]) => (
              <Card key={category} className="p-4">
                <h3 className="font-semibold mb-3 text-primary">{category}</h3>
                <div className="space-y-2">
                  {items.map((item, idx) => {
                    const globalIdx = shoppingList.indexOf(item);
                    return (
                      <div
                        key={globalIdx}
                        className="flex items-center gap-2 p-2 rounded hover:bg-muted"
                      >
                        <Checkbox
                          id={`item-${globalIdx}`}
                          checked={item.checked}
                          onCheckedChange={() => toggleItem(globalIdx)}
                        />
                        <label
                          htmlFor={`item-${globalIdx}`}
                          className={`text-sm cursor-pointer flex-1 ${
                            item.checked ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {item.ingredient}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default Shopping;
