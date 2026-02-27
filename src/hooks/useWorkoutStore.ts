import { create } from 'zustand';
import { storage, debouncedSave } from '@utils/storage';
import { workoutDays } from '@data/workoutData';

interface WorkoutState {
    checkedSets: Record<string, boolean>;
    isLoading: boolean;
    currentDayId: string | null;
    
    // Actions
    setCurrentDayId: (id: string) => void;
    toggleSet: (dayIndex: number, exIndex: number, setIndex: number) => void;
    
    // Selectors
    getCompletedCount: (dayIndex: number) => number;
    getTotalSets: (dayIndex: number) => number;
    
    // Life cycles
    resetWeek: () => void;
    init: () => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
    checkedSets: {},
    isLoading: true,
    currentDayId: workoutDays.length > 0 ? workoutDays[0].id : null,
    
    setCurrentDayId: (id: string) => set({ currentDayId: id }),
    
    toggleSet: (dayIndex: number, exIndex: number, setIndex: number) => {
        const key = `${dayIndex}-${exIndex}-${setIndex}`;
        const { checkedSets } = get();
        
        const newCheckedSets = {
            ...checkedSets,
            [key]: !checkedSets[key]
        };
        
        if (!newCheckedSets[key]) {
            delete newCheckedSets[key]; // cleanup false keys
        }
        
        set({ checkedSets: newCheckedSets });
        debouncedSave('checked_sets', newCheckedSets);
    },
    
    getCompletedCount: (dayIndex: number) => {
        const { checkedSets } = get();
        let count = 0;
        Object.keys(checkedSets).forEach(key => {
            if (key.startsWith(`${dayIndex}-`) && checkedSets[key]) {
                count++;
            }
        });
        return count;
    },
    
    getTotalSets: (dayIndex: number) => {
        const day = workoutDays[dayIndex];
        if (!day) return 0;
        return day.exercises.reduce((total, ex) => total + ex.sets.length, 0);
    },
    
    resetWeek: () => {
        set({ checkedSets: {} });
        storage.save('checked_sets', {});
        storage.save('last_reset_date', new Date().toISOString());
    },
    
    init: async () => {
        try {
            const loadedSets = await storage.load<Record<string, boolean>>('checked_sets');
            const lastReset = await storage.load<string>('last_reset_date');
            
            let shouldReset = false;
            const now = new Date();
            
            if (lastReset) {
                const resetDate = new Date(lastReset);
                
                // Get Monday of the reset date week
                const getMonday = (d: Date) => {
                    const date = new Date(d);
                    const day = date.getDay();
                    const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
                    date.setDate(diff);
                    date.setHours(0, 0, 0, 0);
                    return date;
                };
                
                const lastMonday = getMonday(resetDate);
                const thisMonday = getMonday(now);
                
                if (thisMonday.getTime() > lastMonday.getTime()) {
                    shouldReset = true;
                }
            } else {
                storage.save('last_reset_date', now.toISOString());
            }
            
            if (shouldReset) {
                set({ checkedSets: {}, isLoading: false });
                storage.save('checked_sets', {});
                storage.save('last_reset_date', now.toISOString());
            } else {
                set({ checkedSets: loadedSets || {}, isLoading: false });
            }
        } catch (e) {
            console.error('Failed to init store', e);
            set({ isLoading: false });
        }
    }
}));
