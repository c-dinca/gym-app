import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WorkoutScreen } from '@screens/WorkoutScreen';
import { VolumeScreen } from '@screens/VolumeScreen';
import { ProgressionScreen } from '@screens/ProgressionScreen';
import { BottomTabParamList } from '@typesProject/index';
import { theme } from '@theme/theme';
import { Dumbbell, Activity, TrendingUp } from 'lucide-react-native';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
            }}
        >
            <Tab.Screen
                name="Workout"
                component={WorkoutScreen}
                options={{
                    tabBarLabel: 'Antrenament',
                    tabBarIcon: ({ color, size }) => (
                        <Dumbbell color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Volume"
                component={VolumeScreen}
                options={{
                    tabBarLabel: 'Volum',
                    tabBarIcon: ({ color, size }) => (
                        <Activity color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Progression"
                component={ProgressionScreen}
                options={{
                    tabBarLabel: 'Progresie',
                    tabBarIcon: ({ color, size }) => (
                        <TrendingUp color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};
