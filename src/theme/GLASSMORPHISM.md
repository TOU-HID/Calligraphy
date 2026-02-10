# Glassmorphism Design System

> **A modern, premium design pattern using frosted-glass effects throughout the Calligraphy app.**

---

## What is Glassmorphism?

Glassmorphism is a modern UI design trend that creates a frosted-glass effect using:
- **Semi-transparent backgrounds** with blur
- **Subtle borders** for depth
- **Soft shadows** for elevation
- **Vibrant backgrounds** showing through the glass

**Examples**: iOS Control Center, Windows 11 Acrylic, macOS Big Sur

---

## Implementation

### 1. Theme System

**File**: `src/theme/glassmorphism.ts`

We've created a comprehensive glassmorphism theme with:

#### Glass Colors
```typescript
glassLight: 'rgba(255, 255, 255, 0.1)'      // Light glass
glassMedium: 'rgba(255, 255, 255, 0.2)'     // Medium glass
glassStrong: 'rgba(255, 255, 255, 0.3)'     // Strong glass
glassPrimary: 'rgba(0, 122, 255, 0.15)'     // Colored glass
```

#### Blur Levels
```typescript
subtle: 10   // Minimal blur
medium: 20   // Standard blur
strong: 30   // Heavy blur
intense: 40  // Maximum blur
```

#### Pre-built Styles
- `glassStyles.container` - Basic glass container
- `glassStyles.card` - Glass card with shadow
- `glassStyles.button` - Glass button
- `glassStyles.toolbar` - Glass toolbar/header
- `glassStyles.modal` - Glass modal/overlay

---

### 2. Reusable Components

We've created three core glass components:

#### GlassContainer
**File**: `src/shared/components/GlassContainer.tsx`

Basic container with blur effect.

```tsx
import { GlassContainer } from '@/shared/components';

<GlassContainer blurAmount="medium" blurType="light">
  <Text>Your content</Text>
</GlassContainer>
```

**Props**:
- `blurAmount`: 'subtle' | 'medium' | 'strong' | 'intense'
- `blurType`: 'light' | 'dark' | 'xlight' | 'prominent'
- `variant`: 'container' | 'card' | 'toolbar' | 'modal'

#### GlassCard
**File**: `src/shared/components/GlassCard.tsx`

Card component with padding and optional press handling.

```tsx
import { GlassCard } from '@/shared/components';

<GlassCard 
  blurAmount="strong" 
  padding="lg"
  onPress={() => console.log('Pressed')}
>
  <Text>Card content</Text>
</GlassCard>
```

**Props**:
- All GlassContainer props
- `padding`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'
- `onPress`: Optional press handler

#### GlassButton
**File**: `src/shared/components/GlassButton.tsx`

Button with glassmorphism effect.

```tsx
import { GlassButton } from '@/shared/components';

<GlassButton 
  title="Click Me"
  onPress={() => console.log('Clicked')}
  blurAmount="medium"
/>
```

**Props**:
- `title`: Button text
- `onPress`: Press handler
- `blurAmount`: Blur intensity
- `disabled`: Disable button

---

### 3. Usage in App

**File**: `App.tsx`

We've updated the main app to use glassmorphism:

```tsx
<GlassCard blurAmount="strong" blurType="light" padding="xxl">
  <Text style={styles.title}>Calligraphy</Text>
  <Text style={styles.subtitle}>Phase 1: Setup Complete ✓</Text>
</GlassCard>
```

---

## Best Practices

### 1. Layering
Stack glass elements for depth:
```tsx
<GlassContainer variant="modal">
  <GlassCard>
    <GlassButton title="Action" />
  </GlassCard>
</GlassContainer>
```

### 2. Contrast
Use vibrant backgrounds behind glass elements:
```tsx
<View style={{ backgroundColor: '#007AFF' }}>
  <GlassCard>
    {/* Glass effect shows blue background */}
  </GlassCard>
</View>
```

### 3. Blur Amount
- **Subtle**: For subtle overlays
- **Medium**: Standard UI elements
- **Strong**: Modals, important cards
- **Intense**: Full-screen overlays

### 4. Performance
- Limit blur to visible elements only
- Use `React.memo` for glass components
- Avoid nesting too many blur views

---

## Dark Mode Support

We've included dark mode variants:

```tsx
import { darkGlassStyles } from '@/theme';

// Use dark glass styles in dark mode
<View style={darkGlassStyles.card}>
  {/* Content */}
</View>
```

---

## Examples

### Glass Toolbar
```tsx
<GlassContainer variant="toolbar">
  <Text>Toolbar Title</Text>
</GlassContainer>
```

### Glass Modal
```tsx
<GlassContainer variant="modal" blurAmount="strong">
  <Text>Modal Content</Text>
  <GlassButton title="Close" onPress={closeModal} />
</GlassContainer>
```

### Glass Card Grid
```tsx
<View style={{ flexDirection: 'row', gap: 16 }}>
  <GlassCard padding="md">
    <Text>Card 1</Text>
  </GlassCard>
  <GlassCard padding="md">
    <Text>Card 2</Text>
  </GlassCard>
</View>
```

---

## Next Steps

As we build the Canvas Drawing System, we'll use glassmorphism for:
- **Toolbar**: Glass toolbar with drawing tools
- **Property Panel**: Glass panel for shape properties
- **Mini-map**: Glass overlay showing canvas overview
- **Context Menu**: Glass menu on long-press
- **Modals**: Glass modals for export, templates, etc.

---

**The glassmorphism design system is now ready!** 🎨✨
