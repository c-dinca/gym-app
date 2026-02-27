import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withDelay,
    withSpring,
    Easing,
    FadeInLeft
} from 'react-native-reanimated';
import { theme } from '@theme/theme';
import { ProgressionData } from '@typesProject/index';

interface ProgressionTimelineProps {
    data: ProgressionData[];
}

const TimelineItem = React.memo(({ item, index, isLast }: { item: ProgressionData, index: number, isLast: boolean }) => {
    const dotScale = useSharedValue(0);
    const lineHeight = useSharedValue(0);

    useEffect(() => {
        const delay = index * 100;

        // Dot pop in
        dotScale.value = withDelay(delay, withSpring(1, { damping: 12, stiffness: 180 }));

        // Line growth
        lineHeight.value = withDelay(delay + 100, withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }));
    }, [index, dotScale, lineHeight]);

    const dotStyle = useAnimatedStyle(() => ({
        transform: [{ scale: dotScale.value }]
    }));

    const lineStyle = useAnimatedStyle(() => ({
        transform: [
            { scaleY: lineHeight.value },
            { translateY: (lineHeight.value - 1) * 20 } // offset anchor point simulation if needed, or simply scale
        ]
    }));

    return (
        <View style={styles.timelineRow}>
            {/* Left Column: Line & Dot */}
            <View style={styles.timelineIndicator}>
                <Animated.View style={[styles.dot, item.isActive && styles.dotActive, dotStyle]} />
                {!isLast && <Animated.View style={[styles.line, { transformOrigin: 'top' }, lineStyle]} />}
            </View>

            {/* Right Column: Card */}
            <Animated.View
                entering={FadeInLeft.delay(index * 100).duration(400)}
                style={[styles.card, item.isActive && styles.cardActive]}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.phaseLabel}>{item.mesocyclePhase}</Text>
                    {/* Keep week simple in this layout since we baked it into mesocyclePhase text */}
                </View>
                <Text style={styles.descriptionText}>{item.description}</Text>
            </Animated.View>
        </View>
    );
});

export const ProgressionTimeline: React.FC<ProgressionTimelineProps> = ({ data }) => {
    return (
        <View style={styles.container}>
            {data.map((item, index) => (
                <TimelineItem
                    key={item.week}
                    item={item}
                    index={index}
                    isLast={index === data.length - 1}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: theme.spacing.lg,
    },
    timelineRow: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
    },
    timelineIndicator: {
        width: 32,
        alignItems: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.surfaceElevated,
        borderWidth: 2,
        borderColor: theme.colors.borderActive,
        zIndex: 1,
        marginTop: 6,
    },
    dotActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 4,
    },
    line: {
        width: 2,
        flex: 1,
        backgroundColor: theme.colors.border,
        position: 'absolute',
        top: 16,
        bottom: -theme.spacing.md, // Connect to next item
        zIndex: 0,
    },
    card: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginLeft: theme.spacing.sm,
    },
    cardActive: {
        borderColor: theme.colors.borderActive,
        backgroundColor: theme.colors.surfaceElevated,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    phaseLabel: {
        color: theme.colors.primary,
        ...theme.typography.subheading,
        fontSize: 14,
    },
    descriptionText: {
        color: theme.colors.textSecondary,
        ...theme.typography.body,
        fontSize: 13,
        lineHeight: 18,
    }
});
