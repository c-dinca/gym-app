import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressionTimeline } from '@components/ProgressionTimeline';
import { progressionData } from '@data/workoutData';
import { theme } from '@theme/theme';

const TIPS = [
    "Surplus caloric +300-500 kcal/zi (ești 64 kg la 178 cm)",
    "Minim 130g proteine/zi (2g/kg corp)",
    "7-9 ore somn — non-negociabil",
    "Notează TOATE greutățile în fiecare antrenament",
    "Cântărește-te de 3x/săpt. dimineața",
    "Poze progres la fiecare 4 săptămâni",
    "Nu schimba programul minim 18 săpt. (2 cicluri complete)"
];

export const ProgressionScreen = () => {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.title}>PROGRESIE</Text>
                    <Text style={styles.subtitle}>
                        Plan mezociclu 9 săptămâni. Obiectiv: Hipertrofie & Forță.
                    </Text>
                </View>

                {/* Timeline Section */}
                <ProgressionTimeline data={progressionData} />

                {/* Tips Section */}
                <View style={styles.tipsContainer}>
                    <Text style={styles.tipsHeader}>SFATURI RAPIDE</Text>

                    <View style={styles.tipsCard}>
                        {TIPS.map((tip, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.tipRow,
                                    index === TIPS.length - 1 && styles.tipRowLast
                                ]}
                            >
                                <Text style={styles.tipBullet}>›</Text>
                                <Text style={styles.tipText}>{tip}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xxxl,
    },
    header: {
        marginBottom: theme.spacing.lg,
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
    tipsContainer: {
        marginTop: 32,
    },
    tipsHeader: {
        color: theme.colors.textPrimary,
        ...theme.typography.subheading,
        fontSize: 18,
        marginBottom: theme.spacing.md,
    },
    tipsCard: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
    },
    tipRow: {
        flexDirection: 'row',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        alignItems: 'flex-start',
    },
    tipRowLast: {
        borderBottomWidth: 0,
    },
    tipBullet: {
        color: theme.colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: theme.spacing.sm,
        marginTop: -3, // optical alignment
    },
    tipText: {
        color: theme.colors.textSecondary,
        ...theme.typography.body,
        fontSize: 13,
        lineHeight: 18,
        flex: 1,
    }
});
