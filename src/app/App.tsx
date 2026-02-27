import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TabNavigator } from '@navigation/TabNavigator';
import { theme } from '@theme/theme';
import { StatusBar } from 'react-native';
import { useWorkoutStore } from '@hooks/useWorkoutStore';

const NavigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.textPrimary,
        border: theme.colors.border,
        primary: theme.colors.primary,
    },
};

export const App = () => {
    const { init, isLoading } = useWorkoutStore();

    React.useEffect(() => {
        init();
    }, [init]);

    if (isLoading) return null; // Avoid rendering until storage is loaded

    return (
        <SafeAreaProvider>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
            <NavigationContainer theme={NavigationTheme}>
                <TabNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    );
};

export default App;
