// Persistent offline storage using localStorage

export type DayLog = {
  date: string; // YYYY-MM-DD
  workout: "A" | "B" | "Rest" | null;
  workoutCompleted: boolean;
  lunch: number | null; // recipe id
  dinner: number | null; // recipe id
  weight?: number;
};

const STORAGE_KEYS = {
  START_DATE: "fitvegetarian_start_date",
  DAY_LOGS: "fitvegetarian_day_logs",
  SHOPPING_LIST: "fitvegetarian_shopping_list",
};

// Initialize start date if not set
export const getStartDate = (): string => {
  let startDate = localStorage.getItem(STORAGE_KEYS.START_DATE);
  if (!startDate) {
    startDate = new Date().toISOString().split("T")[0];
    localStorage.setItem(STORAGE_KEYS.START_DATE, startDate);
  }
  return startDate;
};

// Get all day logs
export const getDayLogs = (): Record<string, DayLog> => {
  const data = localStorage.getItem(STORAGE_KEYS.DAY_LOGS);
  return data ? JSON.parse(data) : {};
};

// Save day log
export const saveDayLog = (log: DayLog) => {
  const logs = getDayLogs();
  logs[log.date] = log;
  localStorage.setItem(STORAGE_KEYS.DAY_LOGS, JSON.stringify(logs));
};

// Get log for specific date
export const getDayLog = (date: string): DayLog | null => {
  const logs = getDayLogs();
  return logs[date] || null;
};

// Generate workout for a specific date based on pattern
export const getWorkoutForDate = (date: string): "A" | "B" | "Rest" => {
  const startDate = new Date(getStartDate());
  const currentDate = new Date(date);
  const daysSinceStart = Math.floor(
    (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Rest on: Tuesday (2), Thursday (4), Saturday (6), Sunday (0)
  if ([0, 2, 4, 6].includes(dayOfWeek)) {
    return "Rest";
  }
  
  // Calculate which week we're in
  const weekNumber = Math.floor(daysSinceStart / 7);
  
  // Alternate between weeks
  // Week 0 (even): Mon=A, Wed=B, Fri=A
  // Week 1 (odd): Mon=B, Wed=A, Fri=B
  const isEvenWeek = weekNumber % 2 === 0;
  
  if (dayOfWeek === 1) return isEvenWeek ? "A" : "B"; // Monday
  if (dayOfWeek === 3) return isEvenWeek ? "B" : "A"; // Wednesday
  if (dayOfWeek === 5) return isEvenWeek ? "A" : "B"; // Friday
  
  return "Rest";
};

// Get or create day log with workout pre-filled
export const getOrCreateDayLog = (date: string): DayLog => {
  let log = getDayLog(date);
  if (!log) {
    const workout = getWorkoutForDate(date);
    log = {
      date,
      workout: workout === "Rest" ? null : workout,
      workoutCompleted: false,
      lunch: null,
      dinner: null,
    };
    saveDayLog(log);
  }
  return log;
};

// Shopping list
export type ShoppingListItem = {
  ingredient: string;
  category: string;
  checked: boolean;
};

export const getShoppingList = (): ShoppingListItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
  return data ? JSON.parse(data) : [];
};

export const saveShoppingList = (list: ShoppingListItem[]) => {
  localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(list));
};

// Date utilities
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const parseDate = (dateStr: string): Date => {
  return new Date(dateStr + "T00:00:00");
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getDayName = (date: Date): string => {
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

export const getMonthDay = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
