import React, { useMemo, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Drawer, DrawerProps } from 'react-native-reanimated-drawer';
import { Alert } from 'react-native';
import { Easing } from 'react-native-reanimated';

type DemoConfig = Omit<DrawerProps, "isOpen" | "onClose" | "children"> & {
  label: string;
  description: string;
};

const DEMOS: DemoConfig[] = [
  {
    label: 'Default Left',
    description: 'Baseline behavior with left-side drawer and default interactions.',
  },
  {
    label: 'Right + Callback',
    description: 'Right-side drawer with animation-end callback.',
    side: 'right',
    onAnimationEnd: (state) => {
      Alert.alert(`Animation finished: ${state}`);
    },
  },
  {
    label: 'Styled',
    description: 'Custom drawer + overlay color',
    drawerWidth: 260,
    drawerStyle: { backgroundColor: '#b2b0f7', boxShadow: '10px 0 10px -5px #555' },
    overlayStyle: { backgroundColor: '#04006e' },
    overlayOpacity: 0.35,
  },
  {
    label: 'Slow + No Swipe',
    description: 'Gesture close disabled with slower animation and custom easing.',
    swipeToClose: false,
    durationMs: 1000,
    easing: Easing.inOut(Easing.cubic),
  },
  {
    label: 'High Thresholds',
    description: 'Requires strong swipe velocity or deep drag to close.',
    closeVelocityThreshold: 1300,
    closeDragThreshold: 0.8,
    onOverlayPress: () => {
      Alert.alert('Overlay pressed');
    },
  },
  {
    label: 'Override Overlay',
    description: 'Override overlay press behavior and show a custom alert.',
    onOverlayPress: () => {
      Alert.alert('Overlay pressed');
    },
  },
];

export default function App() {
  const [selectedDemoLabel, setSelectedDemoLabel] = useState(DEMOS[0].label);
  const [isOpen, setIsOpen] = useState(false);

  const selectedDemo = useMemo(
    () => DEMOS.find((item) => item.label === selectedDemoLabel) ?? DEMOS[0],
    [selectedDemoLabel],
  );

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Drawer Demo</Text>

        <View style={styles.optionsRow}>
          {DEMOS.map((demo) => {
            const selected = demo.label === selectedDemo.label;

            return (
              <Pressable
                key={demo.label}
                onPress={() => {
                  setSelectedDemoLabel(demo.label);
                  setIsOpen(false);
                }}
                style={[styles.demoButton, selected && styles.demoButtonSelected]}
              >
                <Text style={[styles.demoButtonText, selected && styles.demoButtonTextSelected]}>
                  {demo.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            {selectedDemo.description}
          </Text>
        </View>

        <Pressable style={styles.openButton} onPress={() => setIsOpen(true)}>
          <Text style={styles.openButtonText}>Open Drawer</Text>
        </Pressable>
      </View>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        {...selectedDemo}
      >
        <View style={styles.drawerContent}>
          <Text style={styles.drawerTitle}>Drawer Content</Text>
          <Text style={styles.drawerSubtitle}>Demo {selectedDemo.label}</Text>

          <Pressable style={styles.closeButton} onPress={() => setIsOpen(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1b1f24',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  demoButton: {
    minWidth: 120,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bbd3ff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  demoButtonSelected: {
    backgroundColor: '#0d6efd',
    borderColor: '#0d6efd',
  },
  demoButtonText: {
    color: '#0d6efd',
    fontWeight: '700',
    fontSize: 12,
  },
  demoButtonTextSelected: {
    color: '#ffffff',
  },
  descriptionContainer: {
    minHeight: 40,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#2f3d4f',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  openButton: {
    backgroundColor: '#0d6efd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  openButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 72,
    paddingHorizontal: 20,
    gap: 12,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1b1f24',
  },
  drawerSubtitle: {
    fontSize: 16,
    color: '#526173',
  },
  closeButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    borderRadius: 8,
    backgroundColor: '#eef3fb',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  closeButtonText: {
    color: '#1b1f24',
    fontWeight: '600',
  },
});
