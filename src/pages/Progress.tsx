import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDayLogs, saveDayLog, formatDate, getStartDate } from "@/lib/storage";
import { TrendingUp, Calendar, Dumbbell } from "lucide-react";
import { toast } from "sonner";

const Progress = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [stats, setStats] = useState({
    totalDays: 0,
    workoutsCompleted: 0,
    startDate: "",
    lastWeight: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const logs = getDayLogs();
    const startDate = getStartDate();
    const today = new Date();
    const start = new Date(startDate);
    const totalDays = Math.floor(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    let workoutsCompleted = 0;
    let lastWeight = 0;
    let latestWeightDate = "";

    Object.values(logs).forEach((log) => {
      if (log.workoutCompleted) workoutsCompleted++;
      if (log.weight && log.date > latestWeightDate) {
        lastWeight = log.weight;
        latestWeightDate = log.date;
      }
    });

    setStats({
      totalDays: totalDays + 1,
      workoutsCompleted,
      startDate,
      lastWeight,
    });
  };

  const logWeight = () => {
    const weight = parseFloat(currentWeight);
    if (isNaN(weight) || weight <= 0) {
      toast.error("Please enter a valid weight");
      return;
    }

    const today = formatDate(new Date());
    const logs = getDayLogs();
    const todayLog = logs[today];

    if (todayLog) {
      saveDayLog({ ...todayLog, weight });
    } else {
      saveDayLog({
        date: today,
        workout: null,
        workoutCompleted: false,
        lunch: null,
        dinner: null,
        weight,
      });
    }

    toast.success("Weight logged!", {
      description: `${weight} kg recorded for today`,
    });
    setCurrentWeight("");
    loadStats();
  };

  const weightLogs = Object.values(getDayLogs())
    .filter((log) => log.weight)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Progress Tracker</h1>
        <p className="text-sm opacity-90">Track your fitness journey</p>
      </header>

      <main className="container max-w-2xl mx-auto p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">Total Days</p>
            </div>
            <p className="text-3xl font-bold">{stats.totalDays}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Since {new Date(stats.startDate).toLocaleDateString()}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">Workouts</p>
            </div>
            <p className="text-3xl font-bold">{stats.workoutsCompleted}</p>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </Card>
        </div>

        {/* Log Weight */}
        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-4">Log Today's Weight</h2>
          {stats.lastWeight > 0 && (
            <p className="text-sm text-muted-foreground mb-3">
              Last recorded: {stats.lastWeight} kg
            </p>
          )}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="weight" className="sr-only">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="Weight in kg"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
              />
            </div>
            <Button onClick={logWeight}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Log
            </Button>
          </div>
        </Card>

        {/* Weight History */}
        {weightLogs.length > 0 && (
          <Card className="p-5">
            <h2 className="text-lg font-semibold mb-4">Weight History</h2>
            <div className="space-y-3">
              {weightLogs.map((log) => (
                <div
                  key={log.date}
                  className="flex justify-between items-center p-2 rounded bg-muted"
                >
                  <span className="text-sm">
                    {new Date(log.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-semibold">{log.weight} kg</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default Progress;
