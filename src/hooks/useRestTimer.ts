import { create } from 'zustand';

interface RestTimerState {
  isActive: boolean;
  timeRemaining: number;
  totalTime: number;
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  tick: () => void;
  addTime: (seconds: number) => void;
}

export const useRestTimer = create<RestTimerState>((set, get) => ({
  isActive: false,
  timeRemaining: 0,
  totalTime: 0,
  startTimer: (seconds: number) => set({ isActive: true, timeRemaining: seconds, totalTime: seconds }),
  stopTimer: () => set({ isActive: false, timeRemaining: 0, totalTime: 0 }),
  tick: () => {
    const { timeRemaining, isActive } = get();
    if (isActive && timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    } else if (timeRemaining === 0) {
      set({ isActive: false });
    }
  },
  addTime: (seconds: number) => set((state: RestTimerState) => ({ timeRemaining: state.timeRemaining + seconds })),
}));
