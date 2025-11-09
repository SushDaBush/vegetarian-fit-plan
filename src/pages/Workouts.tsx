import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { workouts } from "@/data/workouts";
import { useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";

const Workouts = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <p className="text-sm opacity-90">Your training routines</p>
      </header>

      <main className="container max-w-2xl mx-auto p-4 space-y-4">
        {Object.values(workouts).map((workout) => (
          <Card
            key={workout.id}
            className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/workout/${workout.id}`)}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Dumbbell className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{workout.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {workout.exercises.length} exercises
                </p>
                <div className="space-y-1">
                  {workout.exercises.map((exercise, idx) => (
                    <p key={idx} className="text-sm">
                      • {exercise.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </main>

      <Navigation />
    </div>
  );
};

export default Workouts;
