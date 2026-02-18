import React, { useEffect, useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type EasingFunction,
} from 'react-native-reanimated';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  drawerWidth?: number | ((screenWidth: number) => number);
  drawerStyle?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
  overlayOpacity?: number;
  zIndex?: number;
  side?: 'left' | 'right';
  swipeToClose?: boolean;
  durationMs?: number;
  easing?: EasingFunction;
  closeVelocityThreshold?: number;
  closeDragThreshold?: number;
  onAnimationEnd?: (state: 'open' | 'closed') => void;
  onOverlayPress?: () => void;
}

const DEFAULT_DRAWER_WIDTH = (screenWidth: number) => screenWidth * 0.85;
const DEFAULT_DURATION_MS = 150;
const DEFAULT_OVERLAY_OPACITY = 0.8;
const DEFAULT_Z_INDEX = 10;
const DEFAULT_CLOSE_VELOCITY_THRESHOLD = 500;
const DEFAULT_CLOSE_DRAG_THRESHOLD = 0.5;
const CLOSED_EPSILON = 0.001;

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  drawerWidth = DEFAULT_DRAWER_WIDTH,
  drawerStyle,
  overlayStyle,
  overlayOpacity = DEFAULT_OVERLAY_OPACITY,
  zIndex = DEFAULT_Z_INDEX,
  side = 'left',
  swipeToClose = true,
  durationMs = DEFAULT_DURATION_MS,
  easing = Easing.out(Easing.quad),
  closeVelocityThreshold = DEFAULT_CLOSE_VELOCITY_THRESHOLD,
  closeDragThreshold = DEFAULT_CLOSE_DRAG_THRESHOLD,
  onAnimationEnd,
  onOverlayPress,
}) => {
  const { width: screenWidth } = useWindowDimensions();

  const resolvedDrawerWidth = useMemo(() => {
    const width =
      typeof drawerWidth === 'function' ? drawerWidth(screenWidth) : drawerWidth;

    return Math.max(0, Math.min(width, screenWidth));
  }, [drawerWidth, screenWidth]);

  const animationProgress = useSharedValue(isOpen ? 1 : 0);

  useEffect(() => {
    if (
      animationProgress.value <= 0.01 && !isOpen ||
      animationProgress.value >= 0.99 && isOpen
    ) return;
    animationProgress.value = withTiming(
      isOpen ? 1 : 0,
      { duration: durationMs, easing },
      (finished) => {
        if (!finished || !onAnimationEnd) {
          return;
        }
        runOnJS(onAnimationEnd)(isOpen ? 'open' : 'closed');
    });
  }, [isOpen, durationMs, easing]);

  const animatedDrawerStyle = useAnimatedStyle(() => {
    const direction = side === 'left' ? -1 : 1;
    const offset = (1 - animationProgress.value) * resolvedDrawerWidth;

    return {
      transform: [{ translateX: direction * offset }],
      width: resolvedDrawerWidth,
    };
  });

  const animatedOverlayStyle = useAnimatedStyle(() => {
    const isClosed = animationProgress.value <= CLOSED_EPSILON;

    return {
      opacity: animationProgress.value * overlayOpacity,
      display: isClosed ? 'none' : 'flex',
    };
  });

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(swipeToClose)
        .onChange((event) => {
          const signedDelta = side === 'left' ? -event.translationX : event.translationX;
          const progress = 1 - signedDelta / resolvedDrawerWidth;

          animationProgress.value = Math.max(0, Math.min(1, progress));
        })
        .onEnd((event) => {
          const signedVelocity = side === 'left' ? -event.velocityX : event.velocityX;
          const signedTranslation =
            side === 'left' ? -event.translationX : event.translationX;
          const dragThresholdPx =
            closeDragThreshold > 0 && closeDragThreshold <= 1
              ? resolvedDrawerWidth * closeDragThreshold
              : closeDragThreshold;

          const shouldClose =
            signedVelocity > closeVelocityThreshold ||
            signedTranslation > dragThresholdPx;

          if (shouldClose) {
            runOnJS(onClose)();
          } else {
            animationProgress.value = withTiming(
              1,
              { duration: durationMs, easing }
            );
          }
        }),
    [
      closeDragThreshold,
      closeVelocityThreshold,
      durationMs,
      easing,
      onClose,
      onAnimationEnd,
      resolvedDrawerWidth,
      side,
      swipeToClose,
    ],
  );

  const handleOverlayPress = () => {
    onOverlayPress?.();
    onClose();
  };

  return (
    <>
      <Animated.View
        pointerEvents={isOpen ? 'auto' : 'none'}
        style={[
          styles.overlay,
          side === 'left' ? { left: 0 } : { right: 0 },
          { zIndex },
          animatedOverlayStyle,
          overlayStyle,
        ]}
      >
        <Pressable onPress={handleOverlayPress} style={styles.fill}>
          <View style={styles.fill} />
        </Pressable>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.drawer,
            side === 'left' ? { left: 0 } : { right: 0 },
            { zIndex },
            animatedDrawerStyle,
            drawerStyle,
          ]}
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  fill: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
});

export default Drawer;
