import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutStore } from '@hooks/useWorkoutStore';
import { VolumeBar } from '@components/VolumeBar';
import { theme } from '@theme/theme';
import { VolumeData } from '@typesProject/index';

export const VolumeScreen = () => {
    const { workouts } = useWorkoutStore();

    // Dynamically calculate current sets based on what's marked as complete in workouts
    const calculatedVolume = useMemo(() => {
        // Start by mapping over the target volume data to create our base
        // But for this mockup, we'll just import the target data and modify currentSets
        // Let's import it directly inside useMemo since we are aggregating
        const targetVolumeData: VolumeData[] = [
            { muscleGroup: 'Piept', currentSets: 0, targetSets: 17 },
            { muscleGroup: 'Spate', currentSets: 0, targetSets: 18 },
            { muscleGroup: 'Umeri (lateral)', currentSets: 0, targetSets: 8 },
            { muscleGroup: 'Umeri (posterior)', currentSets: 0, targetSets: 6 },
            { muscleGroup: 'Biceps', currentSets: 0, targetSets: 12 },
            { muscleGroup: 'Triceps', currentSets: 0, targetSets: 14 },
            { muscleGroup: 'Cvadriceps', currentSets: 0, targetSets: 18 },
            { muscleGroup: 'Hamstrings', currentSets: 0, targetSets: 14 },
            { muscleGroup: 'Fesieri', currentSets: 0, targetSets: 12 },
            { muscleGroup: 'Gambe', currentSets: 0, targetSets: 8 },
            { muscleGroup: 'Abdomen', currentSets: 0, targetSets: 6 },
        ];

        // This is a naive count based exactly on targetMuscle string match
        // In a real app we might normalize keys, but this connects directly to workoutData strings
        workouts.forEach(day => {
            day.exercises.forEach(ex => {
                const completedCount = ex.sets.filter(s => s.completed).length;
                if (completedCount > 0) {
                    const group = targetVolumeData.find(v => v.muscleGroup.toLowerCase() === ex.targetMuscle.toLowerCase() || ex.targetMuscle.includes(v.muscleGroup));
                    if (group) {
                        group.currentSets += completedCount;
                    } else {
                        // Some edge cases like 'Piept sus' map to 'Piept'
                        if (ex.targetMuscle.includes('Piept')) {
                            const chest = targetVolumeData.find(v => v.muscleGroup === 'Piept');
                            if (chest) chest.currentSets += completedCount;
                        }
                        if (ex.targetMuscle.includes('Delt. Lat.')) {
                            const lat = targetVolumeData.find(v => v.muscleGroup === 'Umeri (lateral)');
                            if (lat) lat.currentSets += completedCount;
                        }
                        if (ex.targetMuscle.includes('Delt. Post.')) {
                            const post = targetVolumeData.find(v => v.muscleGroup === 'Umeri (posterior)');
                            if (post) post.currentSets += completedCount;
                        }
                        if (ex.targetMuscle.includes('Spate/Post.')) {
                            const back = targetVolumeData.find(v => v.muscleGroup === 'Spate');
                            if (back) back.currentSets += completedCount;
                        }
                    }
                }
            });
        });

        return targetVolumeData;
    }, [workouts]);

    const renderItem = useCallback(({ item, index }: ListRenderItemInfo<VolumeData>) => (
        <VolumeBar
            muscleGroup={item.muscleGroup}
            currentSets={item.currentSets}
            targetSets={item.targetSets}
            index={index}
        />
    ), []);

    const keyExtractor = useCallback((item: VolumeData) => item.muscleGroup, []);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>VOLUM SĂPTĂMÂNAL</Text>
                <Text style={styles.subtitle}>
                    Seturi directe de lucru/săptămână.{'\n'}Optim: 14-20 grupe mari, 8-14 grupe mici.
                </Text>
            </View>

            <FlatList
                data={calculatedVolume}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
    },
    title: {
        color: theme.colors.textPrimary,
        ...theme.typography.heading,
        fontSize: 28,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        color: theme.colors.textSecondary,
        ...theme.typography.caption,
        fontSize: 12,
        lineHeight: 18,
    },
    listContent: {
        paddingHorizontal: theme.spacing.xl,
        paddingBottom: theme.spacing.xxxl,
    }
});
