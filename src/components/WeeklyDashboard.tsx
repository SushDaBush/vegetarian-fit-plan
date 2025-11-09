import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Dumbbell, UtensilsCrossed, CheckCircle2 } from "lucide-react";
import {
  formatDate,
  addDays,
  getDayName,
  getMonthDay,
  getOrCreateDayLog,
  saveDayLog,
  type DayLog,
} from "@/lib/storage";
import { recipes } from "@/data/recipes";
import { useNavigate } from "react-router-dom";

export const WeeklyDashboard = () => {
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Get Monday
    return addDays(today, diff);
  });
  
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadWeekData();
  }, [weekStart]);

  const loadWeekData = () => {
    const logs: DayLog[] = [];
    for (let i = 0; i < 7; i++) {
      const date = formatDate(addDays(weekStart, i));
      logs.push(getOrCreateDayLog(date));
    }
    setDayLogs(logs);
  };

  const goToPreviousWeek = () => {
    setWeekStart(addDays(weekStart, -7));
  };

  const goToNextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  const toggleWorkoutComplete = (log: DayLog) => {
    const updated = { ...log, workoutCompleted: !log.workoutCompleted };
    saveDayLog(updated);
    loadWeekData();
  };

  const getLunchRecipe = (recipeId: number | null) => {
    if (!recipeId) return null;
    return recipes.find((r) => r.id === recipeId);
  };

  const getDinnerRecipe = (recipeId: number | null) => {
    if (!recipeId) return null;
    return recipes.find((r) => r.id === recipeId);
  };

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {getMonthDay(weekStart)} - {getMonthDay(addDays(weekStart, 6))}
        </h2>
        <Button variant="outline" size="icon" onClick={goToNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekly Grid */}
      <div className="grid gap-4">
        {dayLogs.map((log, index) => {
          const date = addDays(weekStart, index);
          const isToday = formatDate(new Date()) === log.date;
          const lunch = getLunchRecipe(log.lunch);
          const dinner = getDinnerRecipe(log.dinner);

          return (
            <Card
              key={log.date}
              className={`p-4 ${isToday ? "ring-2 ring-primary" : ""}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{getDayName(date)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {getMonthDay(date)}
                  </p>
                </div>
                {isToday && (
                  <Badge variant="default" className="bg-primary">
                    Today
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                {/* Workout */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">
                        {log.workout ? `Workout ${log.workout}` : "Rest Day"}
                      </p>
                      {log.workout && (
                        <Button
                          variant="link"
                          className="h-auto p-0 text-xs"
                          onClick={() => navigate(`/workout/${log.workout}`)}
                        >
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                  {log.workout && (
                    <Button
                      variant={log.workoutCompleted ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleWorkoutComplete(log)}
                    >
                      {log.workoutCompleted && (
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                      )}
                      {log.workoutCompleted ? "Done" : "Mark Done"}
                    </Button>
                  )}
                </div>

                {/* Lunch */}
                <div
                  className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                  onClick={() =>
                    navigate(`/day/${log.date}/meal/lunch`)
                  }
                >
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="font-medium">Lunch</p>
                      <p className="text-sm text-muted-foreground">
                        {lunch ? lunch.name : "Select meal"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dinner */}
                <div
                  className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                  onClick={() =>
                    navigate(`/day/${log.date}/meal/dinner`)
                  }
                >
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5 text-secondary" />
                    <div>
                      <p className="font-medium">Dinner</p>
                      <p className="text-sm text-muted-foreground">
                        {dinner ? dinner.name : "Select meal"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
