import React, { useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming } from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { theme } from '@theme/theme';
import { WorkoutDay } from '@typesProject/index';

interface DaySelectorProps {
    days: WorkoutDay[];
    selectedDayId: string | null;
    onSelectDay: (id: string) => void;
}

const DayPill = React.memo(({ day, isSelected, onPress }: { day: WorkoutDay; isSelected: boolean; onPress: (id: string) => void }) => {
    const scale = useSharedValue(isSelected ? 1.05 : 1);
    const bgOpacity = useSharedValue(isSelected ? 1 : 0);
    const bgScale = useSharedValue(isSelected ? 1 : 0.8);

    React.useEffect(() => {
        scale.value = withSpring(isSelected ? 1.05 : 1, { damping: 15, stiffness: 200 });
        bgOpacity.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
        bgScale.value = withSpring(isSelected ? 1 : 0.8, { damping: 15, stiffness: 200 });
    }, [isSelected, scale, bgOpacity, bgScale]);

    const animatedTextStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const animatedBgStyle = useAnimatedStyle(() => ({
        opacity: bgOpacity.value,
        transform: [{ scale: bgScale.value }]
    }));

    const handlePress = useCallback(() => {
        ReactNativeHapticFeedback.trigger('impactLight', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
        });
        onPress(day.id);
    }, [day.id, onPress]);

    return (
        <View style={styles.pillWrapper}>
            <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
                <View style={styles.pill}>
                    <Animated.View style={[styles.activePillBg, animatedBgStyle]} />
                    <Animated.Text style={[styles.text, isSelected && styles.textSelected, animatedTextStyle]}>
                        {day.shortName}
                    </Animated.Text>
                </View>
            </TouchableOpacity>
            <Text style={[styles.subtitleLabel, isSelected && { color: theme.colors.textAccent }]}>
                {day.subtitle?.toUpperCase()}
            </Text>
        </View>
    );
});

export const DaySelector: React.FC<DaySelectorProps> = ({ days, selectedDayId, onSelectDay }) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {days.map((day) => (
                    <DayPill
                        key={day.id}
                        day={day}
                        isSelected={selectedDayId === day.id}
                        onPress={onSelectDay}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingVertical: theme.spacing.md,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    pillWrapper: {
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    activePillBg: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: theme.borderRadius.pill,
        backgroundColor: theme.colors.primary,
        zIndex: -1,
    },
    pill: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.pill,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: theme.colors.textTertiary,
        ...theme.typography.subheading,
    },
    textSelected: {
        color: theme.colors.textPrimary,
        ...theme.typography.heading,
    },
    subtitleLabel: {
        color: theme.colors.textTertiary,
        fontSize: 8,
        fontFamily: theme.typography.caption.fontFamily,
        fontWeight: theme.typography.caption.fontWeight,
        letterSpacing: 0.5,
    },
});
