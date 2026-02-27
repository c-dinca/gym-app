import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withTiming,
    useSharedValue,
    withSpring,
    FadeIn,
    FadeOut,
    LinearTransition
} from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { ChevronRight } from 'lucide-react-native';
import { theme } from '@theme/theme';
import { Exercise } from '@typesProject/index';
import { useWorkoutStore } from '@hooks/useWorkoutStore';

interface ExerciseCardProps {
    dayIndex: number;
    exerciseIndex: number;
    exercise: Exercise;
    onToggleSet: (setIndex: number) => void;
    onStartRest: (seconds: number) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const SetButton = React.memo(({
    index,
    isCompleted,
    onToggle,
    onStartRest,
    restSeconds
}: {
    index: number;
    isCompleted: boolean;
    onToggle: (index: number) => void;
    onStartRest: (s: number) => void;
    restSeconds: number;
}) => {
    const scale = useSharedValue(isCompleted ? 1 : 0.95);

    React.useEffect(() => {
        scale.value = withSpring(isCompleted ? 1 : 0.95, { damping: 15, stiffness: 150 });
    }, [isCompleted, scale]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            backgroundColor: withTiming(isCompleted ? theme.colors.primary : theme.colors.surfaceElevated, { duration: 200 }),
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            color: isCompleted ? theme.colors.textPrimary : theme.colors.textTertiary,
        };
    });

    const handlePress = useCallback(() => {
        ReactNativeHapticFeedback.trigger(isCompleted ? 'impactLight' : 'impactMedium', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
        });

        onToggle(index);

        // Only trigger rest timer if we are completing a set (not undoing)
        if (!isCompleted) {
            onStartRest(restSeconds);
        }
    }, [index, isCompleted, onToggle, onStartRest, restSeconds]);

    return (
        <AnimatedTouchableOpacity
            activeOpacity={0.8}
            onPress={handlePress}
            style={[styles.setButton, animatedStyle]}
        >
            <Animated.Text style={[styles.setButtonText, animatedTextStyle]}>
                {index + 1}
            </Animated.Text>
        </AnimatedTouchableOpacity>
    );
});

export const ExerciseCard: React.FC<ExerciseCardProps> = React.memo(({ dayIndex, exerciseIndex, exercise, onToggleSet, onStartRest }) => {
    const [expanded, setExpanded] = useState(false);
    const checkedSets = useWorkoutStore(state => state.checkedSets);

    const handleToggle = useCallback((idx: number) => {
        onToggleSet(idx);
    }, [onToggleSet]);

    const handleRest = useCallback((secs: number) => {
        onStartRest(secs);
    }, [onStartRest]);

    const allSetsCompleted = exercise.sets.length > 0 && exercise.sets.every((_, index) => !!checkedSets[`${dayIndex}-${exerciseIndex}-${index}`]);

    const rotation = useSharedValue(0);

    const toggleExpand = useCallback(() => {
        ReactNativeHapticFeedback.trigger('impactLight', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
        });
        setExpanded(prev => {
            rotation.value = withSpring(prev ? 0 : 90, { damping: 15, stiffness: 150 });
            return !prev;
        });
    }, [rotation]);

    const chevronStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }]
        };
    });

    return (
        <Animated.View style={styles.card} layout={LinearTransition.duration(200)}>
            <TouchableOpacity activeOpacity={0.9} onPress={toggleExpand}>
                {/* Row 1: Exercise Name & Chevron */}
                <View style={styles.headerRow}>
                    <Text style={[styles.exerciseName, allSetsCompleted && styles.exerciseNameCompleted]}>
                        {exercise.name}
                    </Text>
                    <Animated.View style={chevronStyle}>
                        <ChevronRight color={theme.colors.textSecondary} size={20} />
                    </Animated.View>
                </View>

                {/* Row 2: Badges */}
                <View style={styles.badgesRow}>
                    <View style={[styles.badge, styles.badgePrimary]}>
                        <Text style={[styles.badgeText, styles.badgeTextPrimary]}>{exercise.sets.length} SETURI</Text>
                    </View>
                    {exercise.rpe && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{exercise.rpe.toUpperCase()}</Text>
                        </View>
                    )}
                    {exercise.rir && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{exercise.rir.toUpperCase()}</Text>
                        </View>
                    )}
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{exercise.restTimeDisplay}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: 'transparent', borderWidth: 0, paddingHorizontal: 0 }]}>
                        <Text style={[styles.badgeText, { color: theme.colors.textTertiary }]}>{exercise.targetMuscle.toUpperCase()}</Text>
                    </View>
                </View>

                {/* Expandable Content (Form & Alternative) */}
                {expanded && (
                    <Animated.View
                        style={styles.expandedContent}
                        entering={FadeIn.delay(100).duration(200)}
                        exiting={FadeOut.duration(150)}
                    >
                        <View style={styles.expandedSection}>
                            <Text style={styles.expandedLabel}>ALTERNATIVA</Text>
                            <Text style={styles.expandedText}>{exercise.alternative}</Text>
                        </View>
                        <View style={styles.expandedSection}>
                            <Text style={styles.expandedLabel}>INDICAȚII FORMĂ</Text>
                            <Text style={styles.expandedText}>{exercise.formInstruction}</Text>
                        </View>
                    </Animated.View>
                )}

                {/* Row 3: Checkboxes */}
                <View style={styles.setsRow}>
                    {exercise.sets.map((set, index) => {
                        const isCompleted = !!checkedSets[`${dayIndex}-${exerciseIndex}-${index}`];
                        return (
                            <SetButton
                                key={set.id}
                                index={index}
                                isCompleted={isCompleted}
                                onToggle={handleToggle}
                                onStartRest={handleRest}
                                restSeconds={exercise.restTimeSeconds}
                            />
                        );
                    })}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    exerciseName: {
        color: theme.colors.textPrimary,
        ...theme.typography.subheading,
        fontSize: 16,
    },
    exerciseNameCompleted: {
        color: theme.colors.success,
    },
    badgesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
        marginBottom: theme.spacing.lg,
    },
    badge: {
        backgroundColor: theme.colors.surfaceElevated,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme.colors.borderActive,
    },
    badgePrimary: {
        backgroundColor: theme.colors.primaryDim,
        borderColor: theme.colors.primaryGlow,
    },
    badgeText: {
        color: theme.colors.textSecondary,
        ...theme.typography.caption,
        fontSize: 10,
        letterSpacing: 1,
    },
    badgeTextPrimary: {
        color: theme.colors.primary,
    },
    setsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.md,
    },
    setButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.borderActive,
    },
    setButtonText: {
        ...theme.typography.heading,
        fontSize: 18,
    },
    expandedContent: {
        marginBottom: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    expandedSection: {
        marginBottom: theme.spacing.sm,
    },
    expandedLabel: {
        color: theme.colors.textTertiary,
        ...theme.typography.caption,
        fontSize: 10,
        letterSpacing: 1.5,
        marginBottom: 2,
    },
    expandedText: {
        color: theme.colors.textSecondary,
        ...theme.typography.body,
        fontSize: 13,
        lineHeight: 18,
    }
});
