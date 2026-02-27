import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@fitness_';

// Debounce helper
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return function(this: any, ...args: Parameters<T>) {
        const context = this;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            func.apply(context, args);
        }, wait);
    } as T;
}

export const storage = {
    async save<T>(key: string, value: T): Promise<boolean> {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(`${PREFIX}${key}`, jsonValue);
            return true;
        } catch (e) {
            console.error(`Error saving ${key}:`, e);
            return false;
        }
    },

    async load<T>(key: string): Promise<T | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(`${PREFIX}${key}`);
            return jsonValue != null ? JSON.parse(jsonValue) as T : null;
        } catch (e) {
            console.error(`Error loading ${key}:`, e);
            return null;
        }
    },

    async remove(key: string): Promise<boolean> {
        try {
            await AsyncStorage.removeItem(`${PREFIX}${key}`);
            return true;
        } catch (e) {
             console.error(`Error removing ${key}:`, e);
             return false;
        }
    },

    async clear(): Promise<boolean> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const fitnessKeys = keys.filter(k => k.startsWith(PREFIX));
            await Promise.all(fitnessKeys.map(k => AsyncStorage.removeItem(k)));
            return true;
        } catch (e) {
            console.error('Error clearing storage:', e);
            return false;
        }
    }
};

export const debouncedSave = debounce(async <T>(key: string, value: T) => {
    await storage.save<T>(key, value);
}, 500);
