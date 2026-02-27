export interface ExerciseSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  sets: ExerciseSet[];
  restTimeSeconds: number;
  restTimeDisplay: string;
  rpe?: string;
  rir?: string;
  alternative: string;
  formInstruction: string;
}

export interface WarmupPhase {
  id: string;
  title: string;
  description: string;
}

export interface WorkoutDay {
  id: string;
  dayOfWeek: string; // 'Luni', 'Marti', etc. or 'L', 'Ma', etc.
  shortName: string; // e.g. 'Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'
  title: string;
  subtitle?: string;
  exercises: Exercise[];
  warmup: WarmupPhase[];
}

export interface VolumeData {
  muscleGroup: string;
  currentSets: number;
  targetSets: number;
}

export interface ProgressionData {
  week: number;
  mesocyclePhase: string;
  description: string;
  isActive: boolean;
}

export type RootStackParamList = {
  MainTabs: undefined;
};

export type BottomTabParamList = {
  Workout: undefined;
  Volume: undefined;
  Progression: undefined;
};
