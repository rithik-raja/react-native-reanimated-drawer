# react-native-reanimated-drawer

A configurable React Native drawer component powered by Reanimated and Gesture Handler.

<table>
  <tr>
    <td>
      <video src="https://github.com/user-attachments/assets/974cd293-2065-49ab-96a6-e0181fdc1bf5" width="1170" height="2532" controls></video>
    </td>
  </tr>
</table>

## Features

- Left or right drawer
- Customizable drawer and overlay
- Swipe-to-close support with customizable velocity/drag thresholds
- Custom animation duration/easing
- Animation-end callback and overlay press override

## Installation

Install the package and its peer dependencies:

```bash
npm install react-native-reanimated-drawer react-native-reanimated react-native-gesture-handler react-native-worklets
```

Wrap your app with `GestureHandlerRootView` (at your app root):

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView>
      {/* app content */}
    </GestureHandlerRootView>
  );
}
```

## Basic usage

```tsx
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'react-native-reanimated-drawer';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title='Open drawer' onPress={() => setIsOpen(true)} />
      </View>

      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <View style={{ flex: 1, padding: 24 }}>
          <Text>Drawer content</Text>
          <Button title='Close' onPress={() => setIsOpen(false)} />
        </View>
      </Drawer>
    </GestureHandlerRootView>
  );
}
```

## Props

| Prop | Type | Default | Description | Required |
| --- | --- | --- | --- | --- |
| `isOpen` | `boolean` | - | Controls drawer open/closed state. | Yes |
| `onClose` | `() => void` | - | Called when drawer should close (overlay press/swipe). | Yes |
| `drawerWidth` | `number \| (screenWidth: number) => number` | `screenWidth * 0.8` | Drawer width. | No |
| `drawerStyle` | `StyleProp<ViewStyle>` | - | Style override for drawer container. | No |
| `overlayStyle` | `StyleProp<ViewStyle>` | - | Style override for overlay. | No |
| `overlayOpacity` | `number` | `0.6` | Max overlay opacity when open. | No |
| `zIndex` | `number` | `10` | z-index for overlay and drawer. | No |
| `side` | `'left' \| 'right'` | `'left'` | Drawer side. | No |
| `swipeToClose` | `boolean` | `true` | Enables swipe-to-close gesture. | No |
| `durationMs` | `number` | `200` | Open/close animation duration. | No |
| `easing` | `EasingFunction` | `Easing.out(Easing.quad)` | Animation easing. | No |
| `closeVelocityThreshold` | `number` | `500` | Swipe velocity threshold to close. | No |
| `closeDragThreshold` | `number` | `0.5` | Drag threshold to close. `0-1` is treated as width ratio; values `>1` are pixels. | No |
| `onAnimationEnd` | `(state: 'open' \| 'closed') => void` | - | Called after open/close animation finishes. | No |
| `onOverlayPress` | `(() => void) \| null` | `undefined` | Override overlay press behavior. Set `null` to disable overlay press closing. Calls `onClose` if `undefined` | No |

## Test the example app with Expo Go

```bash
cd react-native-reanimated-drawer
npm install
npm run build:package
npm run start:example
```
