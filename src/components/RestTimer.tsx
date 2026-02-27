import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withTiming,
    useSharedValue,
    withSpring,
    Easing
} from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useRestTimer } from '@hooks/useRestTimer';
import { theme } from '@theme/theme';

export const RestTimer = React.memo(() => {
    const { isActive, timeRemaining, stopTimer, tick } = useRestTimer();

    const translateY = useSharedValue(150);
    const opacity = useSharedValue(0);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isActive) {
            interval = setInterval(() => {
                tick();
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, tick]);

    useEffect(() => {
        if (isActive) {
            translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
            opacity.value = withTiming(1, { duration: 300 });
        } else {
            translateY.value = withTiming(150, { duration: 300, easing: Easing.in(Easing.ease) });
            opacity.value = withTiming(0, { duration: 300 });
        }
    }, [isActive, translateY, opacity]);

    const handleDismiss = useCallback(() => {
        ReactNativeHapticFeedback.trigger('impactLight', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
        });
        stopTimer();
    }, [stopTimer]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const isWarning = timeRemaining <= 10 && timeRemaining > 0;

    const animatedPillStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: withTiming(isWarning ? '#FF3B30' : theme.colors.primary, { duration: 300 }),
            shadowColor: withTiming(isWarning ? '#FF3B30' : theme.colors.primary, { duration: 300 }),
        };
    });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    if (!isActive && translateY.value === 150) return null;

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <Animated.View style={[styles.pill, animatedPillStyle]}>
                <View style={styles.content}>
                    <Text style={styles.label}>Pauză </Text>
                    <Text style={styles.timeText}>
                        {formatTime(timeRemaining)}
                    </Text>
                </View>
                <TouchableOpacity
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                    onPress={handleDismiss}
                    style={styles.closeBtn}
                >
                    <X color={theme.colors.textPrimary} size={18} strokeWidth={2.5} />
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 40 : 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1000,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.pill,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8, // for android
        minWidth: 160,
        justifyContent: 'space-between',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        color: theme.colors.textPrimary,
        ...theme.typography.subheading,
        marginRight: theme.spacing.sm,
    },
    timeText: {
        color: theme.colors.textPrimary,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 2,
        lineHeight: 24,
    },
    closeBtn: {
        marginLeft: theme.spacing.lg,
        padding: theme.spacing.xs,
        backgroundColor: '#00000030', // slight dark overlay
        borderRadius: theme.borderRadius.pill,
    },
});
