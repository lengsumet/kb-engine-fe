# Minimal Blue Design System

A clean, modern design system focused on simplicity and usability with a blue color palette.

## Design Principles

### 1. Minimal & Clean
- Clean layouts with plenty of whitespace
- Subtle shadows and borders
- Focused content hierarchy

### 2. Blue-Centric Palette
- Primary blue (#0284c7) for key actions and branding
- Supporting blue tones for accents and states
- Neutral grays for text and backgrounds

### 3. Consistent & Predictable
- Standardized spacing scale (4px base unit)
- Consistent component patterns
- Predictable interaction states

### 4. Accessible & Inclusive
- WCAG 2.1 AA compliant color contrasts
- Keyboard navigation support
- Screen reader friendly markup

## Color Palette

### Primary Blues
```css
--blue-50: #f0f9ff   /* Very light blue backgrounds */
--blue-100: #e0f2fe  /* Light blue accents */
--blue-200: #bae6fd  /* Subtle blue borders */
--blue-300: #7dd3fc  /* Medium blue elements */
--blue-400: #38bdf8  /* Active blue states */
--blue-500: #0ea5e9  /* Standard blue */
--blue-600: #0284c7  /* Primary brand blue */
--blue-700: #0369a1  /* Dark blue hover states */
--blue-800: #075985  /* Darker blue text */
--blue-900: #0c4a6e  /* Darkest blue */
```

### Neutral Grays
```css
--gray-50: #f8fafc   /* Page background */
--gray-100: #f1f5f9  /* Card backgrounds */
--gray-200: #e2e8f0  /* Borders */
--gray-300: #cbd5e1  /* Dividers */
--gray-400: #94a3b8  /* Disabled states */
--gray-500: #64748b  /* Muted text */
--gray-600: #475569  /* Secondary text */
--gray-700: #334155  /* Body text */
--gray-800: #1e293b  /* Headings */
--gray-900: #0f172a  /* Primary text */
```

## Typography

### Font Stack
- **Primary**: Inter (Latin), Sarabun (Thai)
- **Monospace**: SF Mono, Monaco, Cascadia Code

### Scale
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px) - Body text
- **base**: 1rem (16px) - Default
- **lg**: 1.125rem (18px) - Large body
- **xl**: 1.25rem (20px) - Small headings
- **2xl**: 1.5rem (24px) - Medium headings
- **3xl**: 1.875rem (30px) - Large headings
- **4xl**: 2.25rem (36px) - Hero text

## Spacing Scale

Based on 4px increments for consistent rhythm:

```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-12: 3rem     /* 48px */
```

## Components

### Buttons

#### Primary Button
```html
<button class="btn btn-primary">Primary Action</button>
```
- Blue background (#0284c7)
- White text
- Used for main actions

#### Secondary Button
```html
<button class="btn btn-secondary">Secondary Action</button>
```
- White background with border
- Gray text
- Used for secondary actions

#### Ghost Button
```html
<button class="btn btn-ghost">Subtle Action</button>
```
- Transparent background
- Hover state with light gray background
- Used for subtle actions

### Cards

#### Basic Card
```html
<div class="card">
  <div class="card-body">
    Content goes here
  </div>
</div>
```

#### Card with Header
```html
<div class="card">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>
  <div class="card-body">
    Content goes here
  </div>
</div>
```

### Badges

```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-secondary">Secondary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-error">Error</span>
```

### Form Elements

#### Input Field
```html
<input type="text" class="input" placeholder="Enter text...">
```

#### Minimal Input (borderless)
```html
<input type="text" class="input-minimal" placeholder="Minimal input...">
```

## Layout Patterns

### Container Widths
- **container**: 1200px max-width
- **container-sm**: 768px max-width  
- **container-lg**: 1400px max-width

### Grid System
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Flexbox Utilities
```html
<div class="flex items-center justify-between gap-4">
  <div>Left content</div>
  <div>Right content</div>
</div>
```

## States & Interactions

### Hover Effects
- Subtle color transitions (0.15s ease)
- Slight elevation for cards (translateY(-1px))
- Color darkening for buttons

### Focus States
- Blue outline (2px solid)
- 2px offset for accessibility
- Consistent across all interactive elements

### Loading States
- Skeleton loading with animated gradient
- Spinner for async operations
- Disabled states with reduced opacity

## Responsive Design

### Breakpoints
- **Mobile**: 320px+ (base styles)
- **Tablet**: 768px+ (md: prefix)
- **Desktop**: 1024px+ (lg: prefix)
- **Large Desktop**: 1280px+ (xl: prefix)

### Mobile-First Approach
All styles are written mobile-first, with larger breakpoints adding complexity.

## Accessibility

### Color Contrast
- All text meets WCAG 2.1 AA standards
- Interactive elements have sufficient contrast ratios
- Focus indicators are clearly visible

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order throughout the interface
- Skip links for screen readers

### Screen Readers
- Semantic HTML structure
- Proper ARIA labels and descriptions
- Hidden content for screen readers only (.sr-only)

## Usage Guidelines

### Do's
✅ Use consistent spacing from the scale
✅ Stick to the defined color palette
✅ Follow the component patterns
✅ Test with keyboard navigation
✅ Verify color contrast ratios

### Don'ts
❌ Create custom spacing values
❌ Use colors outside the palette
❌ Override component styles arbitrarily
❌ Forget mobile responsiveness
❌ Ignore accessibility requirements

## Implementation

### CSS Custom Properties
The design system uses CSS custom properties (variables) for easy theming and consistency:

```css
:root {
  --primary: var(--blue-600);
  --text-primary: var(--gray-900);
  --space-4: 1rem;
  /* ... */
}
```

### Utility Classes
Utility classes follow a predictable naming convention:

```css
.text-{size}     /* Typography */
.p-{size}        /* Padding */
.m-{size}        /* Margin */
.gap-{size}      /* Gap */
.rounded-{size}  /* Border radius */
```

### Component Classes
Components use BEM-inspired naming:

```css
.btn              /* Block */
.btn-primary      /* Block + Modifier */
.card             /* Block */
.card-header      /* Block + Element */
```

## Future Enhancements

- Dark mode support
- Additional color themes
- Animation library
- Icon system integration
- Advanced form components