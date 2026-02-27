import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { theme } from '@theme/theme';
import { WarmupPhase } from '@typesProject/index';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface WarmupCardProps {
    warmups: WarmupPhase[];
}

export const WarmupCard: React.FC<WarmupCardProps> = React.memo(({ warmups }) => {
    const [expanded, setExpanded] = useState(false);
    const height = useSharedValue(0);

    const toggleExpand = () => {
        ReactNativeHapticFeedback.trigger('impactLight', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
        });
        setExpanded(!expanded);
    };

    const rotation = useDerivedValue(() => {
        return withTiming(expanded ? 180 : 0, { duration: 250 });
    });

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    if (!warmups || warmups.length === 0) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                activeOpacity={0.7}
                onPress={toggleExpand}
            >
                <View style={styles.headerLeft}>
                    <Text style={styles.iconEmote}>🔥</Text>
                    <Text style={styles.headerTitle}>Încălzire</Text>
                </View>
                <Animated.View style={animatedIconStyle}>
                    <ChevronDown color={theme.colors.textSecondary} size={20} />
                </Animated.View>
            </TouchableOpacity>

            {expanded && (
                <Animated.View style={[styles.content]}>
                    {warmups.map((w, index) => (
                        <View key={w.id || index} style={styles.warmupItem}>
                            <Text style={styles.warmupDescription}>{w.description}</Text>
                        </View>
                    ))}
                </Animated.View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    iconEmote: {
        fontSize: 16,
    },
    headerTitle: {
        color: theme.colors.warning,
        ...theme.typography.subheading,
    },
    content: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.md,
        paddingTop: theme.spacing.xs,
    },
    warmupItem: {
        marginBottom: theme.spacing.xs,
    },
    warmupDescription: {
        color: theme.colors.textSecondary,
        ...theme.typography.body,
        lineHeight: 20,
    }
});
