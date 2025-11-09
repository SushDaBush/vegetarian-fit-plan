export type Exercise = {
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
};

export type Workout = {
  id: "A" | "B";
  name: string;
  exercises: Exercise[];
};

export const workouts: Record<"A" | "B", Workout> = {
  A: {
    id: "A",
    name: "Workout A",
    exercises: [
      {
        name: "Goblet Squats",
        sets: 3,
        reps: "8-10",
        restSeconds: 90,
      },
      {
        name: "Push-ups",
        sets: 3,
        reps: "to failure",
        restSeconds: 60,
      },
      {
        name: "Dumbbell Rows (per arm)",
        sets: 3,
        reps: "8-10",
        restSeconds: 60,
      },
      {
        name: "Plank",
        sets: 3,
        reps: "30-60s hold",
        restSeconds: 60,
      },
      {
        name: "Cardio Finisher",
        sets: 1,
        reps: "10 min jogging/cycling",
        restSeconds: 0,
      },
    ],
  },
  B: {
    id: "B",
    name: "Workout B",
    exercises: [
      {
        name: "Romanian Deadlifts",
        sets: 3,
        reps: "10-12",
        restSeconds: 90,
      },
      {
        name: "Dumbbell Overhead Press",
        sets: 3,
        reps: "8-10",
        restSeconds: 60,
      },
      {
        name: "Bodyweight Lunges (per leg)",
        sets: 3,
        reps: "10",
        restSeconds: 60,
      },
      {
        name: "Lat Pulldowns",
        sets: 3,
        reps: "10-12",
        restSeconds: 60,
      },
      {
        name: "Cardio Finisher",
        sets: 1,
        reps: "15 min walk/jump rope",
        restSeconds: 0,
      },
    ],
  },
};
