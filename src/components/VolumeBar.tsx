import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { theme } from '@theme/theme';

interface VolumeBarProps {
    muscleGroup: string;
    currentSets: number;
    targetSets: number;
    index: number;
}

export const VolumeBar: React.FC<VolumeBarProps> = React.memo(({
    muscleGroup,
    currentSets,
    targetSets,
    index,
}) => {
    const progressWidth = useSharedValue(0);

    const safeTarget = Math.max(targetSets, 1); // prevent division by 0
    const clampedCurrent = Math.min(currentSets, safeTarget); // clamp for visual
    const percentage = (clampedCurrent / safeTarget) * 100;

    useEffect(() => {
        progressWidth.value = withDelay(
            index * 80, // Stagger animation
            withTiming(percentage, {
                duration: 600,
                easing: Easing.out(Easing.cubic),
            })
        );
    }, [percentage, index, progressWidth]);

    const animatedBarStyle = useAnimatedStyle(() => {
        return {
            width: `${progressWidth.value}%`,
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.textRow}>
                <Text style={styles.muscleText}>{muscleGroup}</Text>
                <Text style={styles.setsText}>
                    <Text style={{ color: theme.colors.primary }}>{currentSets}</Text> / {targetSets} SETURI
                </Text>
            </View>

            <View style={styles.barBackground}>
                <Animated.View style={[styles.barFill, animatedBarStyle]} />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.lg, // 16px
    },
    textRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: theme.spacing.xs,
    },
    muscleText: {
        color: theme.colors.textSecondary,
        ...theme.typography.body,
        fontSize: 14,
    },
    setsText: {
        color: theme.colors.textTertiary,
        fontFamily: 'Courier', // monospace
        fontSize: 12,
        letterSpacing: 1,
    },
    barBackground: {
        height: 4,
        backgroundColor: theme.colors.surfaceElevated,
        borderRadius: theme.borderRadius.pill,
        width: '100%',
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.pill,
        // Linear gradient mockup via CSS since linear-gradient not supported directly 
        // without react-native-linear-gradient, we will use a solid premium color
    },
});
