---
name: bestbuy Marketplace
colors:
  surface: '#f7fafa'
  surface-dim: '#d7dbdb'
  surface-bright: '#f7fafa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f4'
  surface-container: '#ebeeee'
  surface-container-high: '#e6e9e9'
  surface-container-highest: '#e0e3e3'
  on-surface: '#181c1d'
  on-surface-variant: '#44474c'
  inverse-surface: '#2d3131'
  inverse-on-surface: '#eef1f1'
  outline: '#75777c'
  outline-variant: '#c5c6cc'
  surface-tint: '#535f70'
  primary: '#0e1a28'
  on-primary: '#ffffff'
  primary-container: '#232f3e'
  on-primary-container: '#8a97a9'
  inverse-primary: '#bbc7db'
  secondary: '#8a5100'
  on-secondary: '#ffffff'
  secondary-container: '#fe9800'
  on-secondary-container: '#643900'
  tertiary: '#141a22'
  on-tertiary: '#ffffff'
  tertiary-container: '#292f38'
  on-tertiary-container: '#9196a1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e3f7'
  primary-fixed-dim: '#bbc7db'
  on-primary-fixed: '#101c2b'
  on-primary-fixed-variant: '#3c4858'
  secondary-fixed: '#ffdcbd'
  secondary-fixed-dim: '#ffb86f'
  on-secondary-fixed: '#2c1600'
  on-secondary-fixed-variant: '#693c00'
  tertiary-fixed: '#dde3ee'
  tertiary-fixed-dim: '#c1c7d2'
  on-tertiary-fixed: '#161c24'
  on-tertiary-fixed-variant: '#414750'
  background: '#f7fafa'
  on-background: '#181c1d'
  surface-variant: '#e0e3e3'
typography:
  headline-xl:
    fontFamily: Work Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  headline-lg:
    fontFamily: Work Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Work Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Work Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Work Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
  max-width: 1500px
---

## Brand & Style

This design system centers on utility, reliability, and immense scale. The brand personality is customer-obsessed: efficient, transparent, and functional. It prioritizes clarity of information and ease of navigation over decorative flourishes, ensuring that users can find and purchase products with minimal friction.

The design style is **Corporate / Modern**. It leverages a systematic approach to hierarchy, using structured grids and a restrained color palette to manage high information density. The aesthetic is clean and professional, focusing on clear affordances and a robust architecture that feels stable and trustworthy.

## Colors

The palette is anchored by a deep navy and a high-energy orange. The primary navy (`#232F3E`) provides a professional, "executive" foundation for headers and navigation, while the tertiary dark navy (`#131921`) adds depth for the most prominent brand surfaces. 

The secondary orange (`#FF9900`) is the high-contrast action color, reserved for calls to action, highlights, and critical brand moments. Neutral grays (`#EAEDED`) are used for background surfaces and section dividers to create a soft separation between high-density content blocks, ensuring the pure white (`#FFFFFF`) cards and product details remain the focal point.

## Typography

This design system replaces the generic Arial with **Work Sans** for headlines to provide a more modern, structured professional feel, and **Inter** for body text to maximize legibility across high-density data. 

Headlines are bold and authoritative, using tighter line heights to maintain visual cohesion in large-scale layouts. Body text utilizes a generous line height (1.5x) to ensure readability during long shopping or browsing sessions. Labels use slightly tighter tracking and increased weights to distinguish themselves from body copy within functional components like buttons and tags.

## Layout & Spacing

The layout utilizes a **Fixed Grid** approach for desktop views to ensure a consistent content scan-path on ultra-wide monitors, while transitioning to a fluid model for mobile and tablet. 

- **Desktop (1024px+):** 12-column grid with 16px gutters and a maximum content width of 1500px. 
- **Tablet (768px - 1023px):** 8-column fluid grid with 16px gutters and 24px side margins.
- **Mobile (<768px):** 4-column fluid grid with 12px gutters and 16px side margins.

Spacing follows a 4px base unit. Vertical rhythm is maintained by using `lg` (24px) or `xl` (32px) spacing between distinct content modules, and `xs` (8px) or `sm` (12px) for internal component spacing.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and subtle **Ambient Shadows**. The background surface uses the neutral gray (`#EAEDED`), allowing white content cards to "pop" without high-intensity shadows.

- **Level 0 (Background):** Neutral Gray surface.
- **Level 1 (Cards/Containers):** Pure White surface with a 1px border in `#D5D9D9` or a very soft, 4px blur shadow.
- **Level 2 (Interactive/Floating):** Use a more pronounced shadow (8px-12px blur, 10% opacity navy tint) for dropdowns, modals, and hover states on product cards.
- **Level 3 (Overlays):** Modal dialogs with a 30% opacity navy backdrop to focus user attention.

## Shapes

The design system uses a **Soft** shape language. This provides a balance between the precision of hard edges and the approachability of rounded corners. 

Standard components like input fields and buttons utilize a 0.25rem (4px) radius. Larger containers, such as product cards or promotional banners, may use a 0.5rem (8px) radius to feel more inviting. This subtle rounding helps soften the high-density grid without sacrificing the professional "utility" feel of the interface.

## Components

### Buttons
The primary action button uses the signature orange (`#FF9900`) with black or deep navy text for maximum contrast. Secondary buttons should use a light gradient or a subtle gray border with white backgrounds. Buttons feature a 4px border radius.

### Input Fields
Inputs use a white background with a 1px border. On focus, the border shifts to the primary navy or orange to provide a clear interactive state. Labels should be placed directly above the field using `label-md`.

### Cards
Product cards are the core of the experience. They use a white background, a 1px neutral border, and a subtle shadow on hover. Content inside cards follows a strict vertical hierarchy: Image > Title (Body-MD) > Rating > Price (Headline-SM).

### Chips & Badges
Use chips for categories or filters. These should have a light gray fill and 16px (fully rounded) height. Badges for status (e.g., "Best Seller") should use the primary navy background with white text to stand out against white card surfaces.

### Checkboxes & Radios
These should be standard and highly recognizable, utilizing the primary navy for the "checked" state to reinforce the brand identity.