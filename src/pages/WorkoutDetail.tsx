import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { workouts } from "@/data/workouts";
import { ArrowLeft, Timer, Play, Pause } from "lucide-react";

const WorkoutDetail = () => {
  const { id } = useParams<{ id: "A" | "B" }>();
  const navigate = useNavigate();
  const [checkedSets, setCheckedSets] = useState<Record<string, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<string>("");

  const workout = id ? workouts[id] : null;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Workout not found</p>
      </div>
    );
  }

  const startTimer = (seconds: number, exerciseName: string) => {
    setTimerSeconds(seconds);
    setCurrentExercise(exerciseName);
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const toggleSet = (key: string) => {
    setCheckedSets((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
        <h1 className="text-2xl font-bold">{workout.name}</h1>
        <p className="text-sm opacity-90">{workout.exercises.length} exercises</p>
      </header>

      {/* Timer Display */}
      {timerSeconds > 0 && (
        <div className="sticky top-0 z-10 bg-accent text-accent-foreground p-4 shadow-md">
          <div className="container max-w-2xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Rest Timer</p>
              <p className="text-xs opacity-90">{currentExercise}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">
                {Math.floor(timerSeconds / 60)}:
                {(timerSeconds % 60).toString().padStart(2, "0")}
              </span>
              <Button
                size="icon"
                variant="outline"
                className="bg-accent-foreground/10"
                onClick={toggleTimer}
              >
                {isTimerRunning ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="container max-w-2xl mx-auto p-4 space-y-4">
        {workout.exercises.map((exercise, idx) => (
          <Card key={idx} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{exercise.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {exercise.sets} sets × {exercise.reps}
                </p>
              </div>
              {exercise.restSeconds > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startTimer(exercise.restSeconds, exercise.name)}
                >
                  <Timer className="h-4 w-4 mr-1" />
                  {exercise.restSeconds}s
                </Button>
              )}
            </div>

            {/* Set Checkboxes */}
            <div className="space-y-2">
              {Array.from({ length: exercise.sets }).map((_, setIdx) => {
                const key = `${idx}-${setIdx}`;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-2 p-2 rounded hover:bg-muted"
                  >
                    <Checkbox
                      id={key}
                      checked={checkedSets[key] || false}
                      onCheckedChange={() => toggleSet(key)}
                    />
                    <label
                      htmlFor={key}
                      className="text-sm cursor-pointer flex-1"
                    >
                      Set {setIdx + 1}
                    </label>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </main>

      <Navigation />
    </div>
  );
};

export default WorkoutDetail;
