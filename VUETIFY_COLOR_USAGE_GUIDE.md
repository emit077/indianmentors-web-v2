# Vuetify Theme Colors Usage Guide

## 📋 Overview

This guide ensures consistent usage of Vuetify theme-based colors across the entire Indian Mentors project. **Always use theme colors instead of hardcoded hex values.**

---

## ✅ CORRECT Usage Examples

### 1. **Vuetify Component Color Prop**

```vue
<!-- ✅ CORRECT - Using color prop -->
<v-btn color="primary">Button</v-btn>
<v-card color="white">Card</v-card>
<v-alert color="success">Alert</v-alert>
<v-chip color="secondary">Chip</v-chip>
<v-avatar color="info">Avatar</v-avatar>
```

### 2. **Vuetify Color Classes**

```vue
<!-- ✅ CORRECT - Using Vuetify classes -->
<div class="bg-primary">Background</div>
<span class="text-success">Text</span>
<div class="bg-surface">Surface</div>
```

### 3. **CSS Variables in SCSS**

```scss
// ✅ CORRECT - Using CSS variables
.custom-element {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-white));
  border-color: rgb(var(--v-theme-borderLight));
}

// With opacity
.semi-transparent {
  background-color: rgb(var(--v-theme-primary), 0.5);
}
```

### 4. **Using Theme Colors in JavaScript/TypeScript**

```typescript
// ✅ CORRECT - Reference theme colors
const chartColors = ['primary', 'success', 'info', 'warning', 'error'];

// In computed styles
const cardStyle = computed(() => ({
  backgroundColor: 'rgb(var(--v-theme-containerBg))'
}));
```

---

## ❌ INCORRECT Usage Examples

### 1. **Hardcoded Hex Colors**

```vue
<!-- ❌ WRONG - Hardcoded hex -->
<v-btn style="background: #3e78ff">Button</v-btn>
<v-card style="color: #5B6B79">Card</v-card>
```

### 2. **Inline Hex Styles**

```vue
<!-- ❌ WRONG - Inline hex colors -->
<div style="background-color: #ffffff">Content</div>
<span style="color: #dc2626">Error</span>
```

### 3. **Hardcoded SCSS Colors**

```scss
// ❌ WRONG - Hardcoded hex in SCSS
.my-class {
  background-color: #3e78ff;
  color: #ffffff;
}
```

---

## 🎨 Available Theme Colors

### **Primary Colors**
- `primary`, `lightprimary`, `darkprimary`
- `primary50` through `primary900`

### **Semantic Colors**
- `secondary`, `success`, `info`, `warning`, `error`
- Light variants: `lightsecondary`, `lightsuccess`, etc.
- Dark variants: `darksecondary`, `darksuccess`, etc.

### **Neutral Colors**
- `white`, `black`, `surface`, `background`
- `containerBg`, `cardBg`, `hoverBg`, `activeBg`

### **Text Colors**
- `darkText`, `lightText`, `mediumText`, `mutedText`

### **Border Colors**
- `borderLight`, `borderMedium`, `borderDark`
- `inputBorder`, `divider`

### **Grayscale**
- `gray50` through `gray900`

### **Social & Status**
- `facebook`, `twitter`, `linkedin`, etc.
- `online`, `offline`, `away`, `busy`

### **Charts**
- `chart1` through `chart8`

---

## 📖 Usage Patterns

### **Pattern 1: Component Props**

```vue
<template>
  <!-- Buttons -->
  <v-btn color="primary" variant="flat">Primary</v-btn>
  <v-btn color="secondary" variant="tonal">Secondary</v-btn>
  <v-btn color="success" variant="outlined">Success</v-btn>
  
  <!-- Cards -->
  <v-card color="white" variant="outlined">
    <v-card-text color="containerBg">Content</v-card-text>
  </v-card>
  
  <!-- Alerts -->
  <v-alert color="warning" variant="tonal">Warning</v-alert>
  <v-alert color="error" variant="outlined">Error</v-alert>
</template>
```

### **Pattern 2: Utility Classes**

```vue
<template>
  <!-- Background Colors -->
  <div class="bg-primary">Primary background</div>
  <div class="bg-surface">Surface background</div>
  <div class="bg-containerBg">Container background</div>
  
  <!-- Text Colors -->
  <span class="text-primary">Primary text</span>
  <span class="text-darkText">Dark text</span>
  <span class="text-lightText">Light text</span>
  
  <!-- Border Colors -->
  <div class="border-primary">Bordered</div>
</template>
```

### **Pattern 3: Scoped Styles**

```vue
<style scoped lang="scss">
.custom-component {
  // Using theme variables
  background-color: rgb(var(--v-theme-white));
  color: rgb(var(--v-theme-darkText));
  border: 1px solid rgb(var(--v-theme-borderLight));
  
  &:hover {
    background-color: rgb(var(--v-theme-hoverBg));
    border-color: rgb(var(--v-theme-primary));
  }
  
  // With opacity
  .overlay {
    background-color: rgb(var(--v-theme-black), 0.5);
  }
}
</style>
```

### **Pattern 4: Conditional Colors**

```vue
<template>
  <!-- Dynamic color based on status -->
  <v-chip :color="getStatusColor(status)">{{ status }}</v-chip>
</template>

<script setup lang="ts">
const getStatusColor = (status: string) => {
  const colorMap = {
    active: 'success',
    pending: 'warning',
    inactive: 'error',
    draft: 'secondary'
  };
  return colorMap[status] || 'gray500';
};
</script>
```

---

## 🔧 Common Scenarios

### **Scenario 1: Custom Background with Theme Color**

```vue
<!-- ✅ CORRECT -->
<v-sheet color="primary" class="pa-4">
  <span class="text-white">Content</span>
</v-sheet>

<!-- ❌ WRONG -->
<div style="background: #3e78ff" class="pa-4">
  <span style="color: #fff">Content</span>
</div>
```

### **Scenario 2: Hover States**

```vue
<style scoped lang="scss">
// ✅ CORRECT
.hoverable-item {
  background-color: rgb(var(--v-theme-surface));
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgb(var(--v-theme-hoverBg));
  }
}

// ❌ WRONG
.hoverable-item {
  background-color: #ffffff;
  
  &:hover {
    background-color: #f7fafc;
  }
}
</style>
```

### **Scenario 3: Borders**

```vue
<style scoped lang="scss">
// ✅ CORRECT
.bordered-card {
  border: 2px solid rgb(var(--v-theme-borderLight));
  
  &:focus {
    border-color: rgb(var(--v-theme-primary));
  }
}

// ❌ WRONG
.bordered-card {
  border: 2px solid #e8ebee;
  
  &:focus {
    border-color: #3e78ff;
  }
}
</style>
```

### **Scenario 4: Icons**

```vue
<!-- ✅ CORRECT -->
<v-icon color="primary">mdi-account</v-icon>
<v-icon color="success">mdi-check</v-icon>
<v-icon color="error">mdi-alert</v-icon>

<!-- ❌ WRONG -->
<v-icon style="color: #3e78ff">mdi-account</v-icon>
```

---

## 🎯 Best Practices

### 1. **Always Use Theme Colors**
- Never hardcode hex values
- Use `color` prop or CSS variables
- Keep colors centralized in theme file

### 2. **Use Semantic Colors**
- `success` for positive actions
- `error` for destructive actions
- `warning` for caution
- `info` for information
- `primary` for main actions
- `secondary` for supporting actions

### 3. **Maintain Consistency**
- Use the same color for similar elements
- Follow the established color patterns
- Don't create custom colors without adding to theme

### 4. **Consider Accessibility**
- Ensure sufficient contrast ratios
- Use appropriate text colors on backgrounds
- Test color combinations

### 5. **Use Variants**
- `flat` - Solid background
- `tonal` - Soft background
- `outlined` - Border only
- `text` - Text only
- `elevated` - With shadow

---

## 📝 Code Review Checklist

Before committing, check:

- [ ] No hardcoded hex colors (`#ffffff`, `#3e78ff`, etc.)
- [ ] Using Vuetify `color` prop where possible
- [ ] SCSS uses CSS variables (`rgb(var(--v-theme-primary))`)
- [ ] Inline styles avoided or use CSS variables
- [ ] Colors are semantic and meaningful
- [ ] Consistent with existing codebase
- [ ] Theme colors used from `LightTheme.ts`

---

## 🔄 Migration Guide

### **If you find hardcoded colors:**

1. **Identify the color purpose** (primary, success, text, etc.)
2. **Find matching theme color** in `LightTheme.ts`
3. **Replace with theme color** using appropriate method
4. **Test the change** to ensure it looks correct

### **Example Migration:**

```vue
<!-- BEFORE -->
<v-card style="background: #ffffff; border: 1px solid #e8ebee">
  <span style="color: #1D2630">Text</span>
</v-card>

<!-- AFTER -->
<v-card color="white" variant="outlined">
  <span class="text-darkText">Text</span>
</v-card>
```

---

## 🛠️ Tools & Resources

### **Finding Theme Colors**
- Navigate to `/utilities/colors` in the app
- View all available colors visually
- Copy color names for use

### **Theme File Location**
```
src/theme/LightTheme.ts
```

### **Adding New Colors**
1. Add to `LightTheme.ts` colors object
2. Document the color purpose
3. Add to color showcase page
4. Use consistently across project

---

## ✅ Summary

**DO:**
- ✅ Use Vuetify `color` prop
- ✅ Use CSS variables in SCSS
- ✅ Use Vuetify utility classes
- ✅ Keep colors in theme file
- ✅ Use semantic color names

**DON'T:**
- ❌ Hardcode hex values
- ❌ Use inline style colors
- ❌ Create random colors
- ❌ Mix hardcoded and theme colors
- ❌ Ignore color guidelines

---

**By following this guide, we ensure:**
- Consistent visual design
- Easy theme customization
- Better maintainability
- Improved developer experience
- Professional codebase quality

---

**Last Updated:** January 2026  
**Version:** 1.0.0  
**Maintained by:** Indian Mentors Development Team
