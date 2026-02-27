import React, { useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, ListRenderItemInfo } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, FadeIn } from 'react-native-reanimated';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutStore } from '@hooks/useWorkoutStore';
import { DaySelector } from '@components/DaySelector';
import { ExerciseCard } from '@components/ExerciseCard';
import { WarmupCard } from '@components/WarmupCard';
import { RestTimer } from '@components/RestTimer';
import { useRestTimer } from '@hooks/useRestTimer';
import { theme } from '@theme/theme';
import { Exercise } from '@typesProject/index';
import { workoutDays } from '@data/workoutData';

export const WorkoutScreen = () => {
    const { currentDayId, setCurrentDayId, toggleSet } = useWorkoutStore();
    const checkedSets = useWorkoutStore(state => state.checkedSets);
    const getCompletedCount = useWorkoutStore(state => state.getCompletedCount);
    const getTotalSets = useWorkoutStore(state => state.getTotalSets);
    const { startTimer } = useRestTimer();

    const currentDayIndex = useMemo(() => workoutDays.findIndex((day) => day.id === currentDayId), [currentDayId]);
    const currentDay = currentDayIndex !== -1 ? workoutDays[currentDayIndex] : null;

    const handleSelectDay = useCallback((id: string) => {
        setCurrentDayId(id);
    }, [setCurrentDayId]);

    const handleToggleSet = useCallback((exIndex: number, setIndex: number) => {
        if (currentDayIndex !== -1) {
            toggleSet(currentDayIndex, exIndex, setIndex);
        }
    }, [currentDayIndex, toggleSet]);

    const renderExercise = useCallback(({ item, index }: ListRenderItemInfo<Exercise>) => (
        <ExerciseCard
            dayIndex={currentDayIndex}
            exerciseIndex={index}
            exercise={item}
            onToggleSet={(setIndex) => handleToggleSet(index, setIndex)}
            onStartRest={startTimer}
        />
    ), [currentDayIndex, handleToggleSet, startTimer]);

    const keyExtractor = useCallback((item: Exercise) => item.id, []);

    const getItemLayout = useCallback((_: any, index: number) => (
        // Approximation: exercise card height around 150px depending on sets
        { length: 150, offset: 150 * index, index }
    ), []);

    // Derived stats
    const stats = useMemo(() => {
        if (!currentDay || currentDayIndex === -1) return { current: 0, total: 0, progress: 0 };
        const current = getCompletedCount(currentDayIndex);
        const total = getTotalSets(currentDayIndex);
        const progress = total === 0 ? 0 : (current / total) * 100;
        return { current, total, progress };
    }, [currentDay, currentDayIndex, getCompletedCount, getTotalSets, checkedSets]);

    const animatedProgressValue = useSharedValue(0);

    useEffect(() => {
        if (stats.progress === 100 && animatedProgressValue.value < 100 && stats.total > 0) {
            ReactNativeHapticFeedback.trigger('notificationSuccess', {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
            });
        }
        animatedProgressValue.value = withTiming(stats.progress, { duration: 400 });
    }, [stats.progress, stats.total, animatedProgressValue]);

    const progressBarStyle = useAnimatedStyle(() => {
        return {
            width: `${animatedProgressValue.value}%`,
        };
    });

    return (
        <Animated.View style={styles.container} entering={FadeIn.duration(150)}>
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.globalHeader}>
                    <View>
                        <Text style={styles.topCaption}>PROGRAM ANTRENAMENT</Text>
                        <Text style={styles.topHeading}>Masă & Forță</Text>
                    </View>
                    {/* Empty right area intentionally left minimal */}
                </View>

                <DaySelector
                    days={workoutDays}
                    selectedDayId={currentDayId}
                    onSelectDay={handleSelectDay}
                />

                {currentDay ? (
                    <>
                        <View style={styles.heroCard}>
                            <View style={styles.heroHeaderRow}>
                                <View style={styles.heroLeft}>
                                    <Text style={styles.heroTitle}>{currentDay.title}</Text>
                                    <Text style={styles.heroSubtitle}>
                                        {currentDay.dayOfWeek} · {currentDay.subtitle}
                                    </Text>
                                </View>
                                <View style={styles.heroRight}>
                                    <Text style={styles.heroStatValue}>
                                        <Text style={{ color: theme.colors.textPrimary }}>{stats.current}</Text>
                                        /{stats.total}
                                    </Text>
                                    <Text style={styles.heroStatLabel}>seturi</Text>
                                </View>
                            </View>
                            <View style={styles.progressBarBg}>
                                <Animated.View style={[styles.progressBarFill, progressBarStyle]} />
                            </View>
                        </View>

                        {currentDay.warmup && currentDay.warmup.length > 0 && (
                            <WarmupCard warmups={currentDay.warmup} />
                        )}

                        <FlatList
                            data={currentDay.exercises}
                            keyExtractor={keyExtractor}
                            renderItem={renderExercise}
                            getItemLayout={getItemLayout}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={<Text style={styles.emptyText}>Lista este goală. Exercițiile vor fi afișate aici.</Text>}
                        />
                    </>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Selectează o zi pentru a vedea antrenamentul.</Text>
                    </View>
                )}

                <RestTimer />
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    globalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.lg,
    },
    topCaption: {
        color: theme.colors.textTertiary,
        ...theme.typography.caption,
        letterSpacing: 2,
        marginBottom: theme.spacing.xs,
        fontSize: 10,
    },
    topHeading: {
        color: theme.colors.textPrimary,
        ...theme.typography.heading,
        fontSize: 28,
    },
    heroCard: {
        backgroundColor: theme.colors.surfaceElevated,
        borderWidth: 1,
        borderColor: theme.colors.borderActive,
        margin: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
    },
    heroHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: theme.spacing.lg,
    },
    heroLeft: {
        flex: 1,
    },
    heroTitle: {
        color: theme.colors.textPrimary,
        ...theme.typography.heading,
        fontSize: 24,
        marginBottom: theme.spacing.xs,
    },
    heroSubtitle: {
        color: theme.colors.textAccent,
        ...theme.typography.caption,
    },
    heroRight: {
        alignItems: 'flex-end',
    },
    heroStatValue: {
        color: theme.colors.textTertiary,
        ...theme.typography.heading,
        fontSize: 28,
    },
    heroStatLabel: {
        color: theme.colors.textSecondary,
        ...theme.typography.caption,
        fontSize: 10,
        textTransform: 'uppercase',
        marginTop: -4,
    },
    progressBarBg: {
        height: 3,
        backgroundColor: theme.colors.border,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 2,
    },
    listContent: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: 120, // Space for RestTimer
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: theme.colors.textTertiary,
        ...theme.typography.body,
        textAlign: 'center',
        marginTop: theme.spacing.xxxl,
    },
});
