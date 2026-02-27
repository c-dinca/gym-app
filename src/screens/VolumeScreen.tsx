import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutStore } from '@hooks/useWorkoutStore';
import { VolumeBar } from '@components/VolumeBar';
import { theme } from '@theme/theme';
import { VolumeData } from '@typesProject/index';
import { workoutDays } from '@data/workoutData';

export const VolumeScreen = () => {
    const checkedSets = useWorkoutStore(state => state.checkedSets);

    // Dynamically calculate current sets based on checkedSets hashmap
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

        // Calculate based on ticked boxes in checkedSets cache
        Object.keys(checkedSets).forEach(key => {
            if (checkedSets[key]) {
                const parts = key.split('-');
                if (parts.length === 3) {
                    const dIdx = parseInt(parts[0], 10);
                    const eIdx = parseInt(parts[1], 10);
                    const ex = workoutDays[dIdx]?.exercises[eIdx];

                    if (ex) {
                        const group = targetVolumeData.find(v => v.muscleGroup.toLowerCase() === ex.targetMuscle.toLowerCase() || ex.targetMuscle.includes(v.muscleGroup));
                        if (group) {
                            group.currentSets++;
                        } else {
                            if (ex.targetMuscle.includes('Piept')) {
                                const chest = targetVolumeData.find(v => v.muscleGroup === 'Piept');
                                if (chest) chest.currentSets++;
                            }
                            if (ex.targetMuscle.includes('Delt. Lat.')) {
                                const lat = targetVolumeData.find(v => v.muscleGroup === 'Umeri (lateral)');
                                if (lat) lat.currentSets++;
                            }
                            if (ex.targetMuscle.includes('Delt. Post.')) {
                                const post = targetVolumeData.find(v => v.muscleGroup === 'Umeri (posterior)');
                                if (post) post.currentSets++;
                            }
                            if (ex.targetMuscle.includes('Spate/Post.')) {
                                const back = targetVolumeData.find(v => v.muscleGroup === 'Spate');
                                if (back) back.currentSets++;
                            }
                        }
                    }
                }
            }
        });

        return targetVolumeData;
    }, [checkedSets]);

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
