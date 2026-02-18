import React, { useMemo, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Drawer, DrawerProps } from 'react-native-reanimated-drawer';
import { Alert } from 'react-native';

interface _DemoConfig extends DrawerProps {
  id: number;
  label: string;
};
type DemoConfig = Omit<_DemoConfig, "isOpen" | "onClose" | "children">

const DEMOS: DemoConfig[] = [
  { id: 1, label: '1', drawerWidth: 220, side: 'left', overlayOpacity: 0.4 },
  { id: 2, label: '2', drawerWidth: 280, side: 'left', overlayOpacity: 0.6 },
  { id: 3, label: '3', drawerWidth: 250, side: 'right', overlayOpacity: 0.5, onAnimationEnd: (state) => { Alert.alert(`"${state}" animation complete`); }},
];

export default function App() {
  const [selectedDemoId, setSelectedDemoId] = useState(DEMOS[0].id);
  const [isOpen, setIsOpen] = useState(false);

  const selectedDemo = useMemo(
    () => DEMOS.find((item) => item.id === selectedDemoId) ?? DEMOS[0],
    [selectedDemoId],
  );

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Drawer Demo</Text>

        <View style={styles.optionsRow}>
          {DEMOS.map((demo) => {
            const selected = demo.id === selectedDemo.id;

            return (
              <Pressable
                key={demo.id}
                onPress={() => {
                  setSelectedDemoId(demo.id);
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

        <Text style={styles.argumentsText}>
          {"temp"}
        </Text>

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
    gap: 12,
  },
  demoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#bbd3ff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  demoButtonSelected: {
    backgroundColor: '#0d6efd',
    borderColor: '#0d6efd',
  },
  demoButtonText: {
    color: '#0d6efd',
    fontWeight: '700',
  },
  demoButtonTextSelected: {
    color: '#ffffff',
  },
  argumentsText: {
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
    backgroundColor: '#ffffff',
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
