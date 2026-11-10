---
name: Campus Barter & Exchange
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#5b403d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#8f706c'
  outline-variant: '#e3beb9'
  surface-tint: '#b81f1e'
  primary: '#8d000a'
  on-primary: '#ffffff'
  primary-container: '#b31b1b'
  on-primary-container: '#ffc6bf'
  inverse-primary: '#ffb4ab'
  secondary: '#325bb0'
  on-secondary: '#ffffff'
  secondary-container: '#7fa3fe'
  on-secondary-container: '#003687'
  tertiary: '#8d000b'
  on-tertiary: '#ffffff'
  tertiary-container: '#ba0012'
  on-tertiary-container: '#ffc6bf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000b'
  secondary-fixed: '#dae2ff'
  secondary-fixed-dim: '#b1c5ff'
  on-secondary-fixed: '#001946'
  on-secondary-fixed-variant: '#114297'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ab'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000b'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  crimson-deep: '#991b1b'
  crimson-accent: '#dc2626'
  institution-blue: '#003a8f'
  surface-slate-subtle: '#f8fafc'
  surface-slate-muted: '#f1f5f9'
  verified-teal: '#0d9488'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system defines a collegiate, vibrant, and highly trusted student-to-student peer bartering ecosystem. Balancing the institutional dignity of academic tradition with the youthful spontaneity of campus life, the interface emphasizes mutual aid, sustainability, and trust. 

The aesthetic is **Modern Collegiate Minimal with Tactile Clarity**. It departs from rigid academic bureaucracy in favor of an airy, approachable, card-centric exchange platform. By pairing structured slate neutrals with energetic crimson accents, the design system cultivates an environment where trades feel effortless, community-driven, and verified. 

Key attributes:
- **Trust-first & Secure:** Prominent student verification and institution-backed security paradigms.
- **Friendly & Pragmatic:** Clear, high-legibility typographic hierarchies and accessible item categorization.
- **Clean Depth:** Soft layering, smooth rounded corner structures, and gentle ambient shadows over stark outlines.

## Colors

The palette grounds the interface in university heritage while offering crisp contrast for peer exchange mechanics.

- **Primary (`#b31b1b`)**: The signature crimson red. Used for high-intent conversion actions, key CTAs, and distinctive active states.
- **Secondary (`#003a8f`)**: A deep institutional blue derived from classic university heraldry. Reserved for verified student credentials, academic badges, campus notices, and trust indicators.
- **Tertiary (`#dc2626`)**: A vibrant crimson accent deployed for notification badges, urgency chips (e.g., "Expiring Trade Offer"), and micro-interactions.
- **Neutral (`#64748b`)**: A modern slate gray range. Supports high-clarity copy, borders, and functional iconography without the harshness of pure black.
- **Backgrounds**: Pure white surfaces (`#ffffff`) layered cleanly over slate tints (`#f8fafc` and `#f1f5f9`) establish rhythmic separation between listing feeds and viewport canvases.

## Typography

The typography couples the modern geometric friendliness of **Plus Jakarta Sans** with the utilitarian precision of **Inter**.

- **Plus Jakarta Sans** is employed across display headlines, section titling, item card names, and badge labels. Its slightly rounded terminals infuse the interface with collegiate optimism and approachable warmth.
- **Inter** handles item descriptions, messaging flows, trade terms, and system dialogs, delivering clean legibility under dense listing specifications.
- **Mobile Downscaling**: High-impact titles scale down intentionally on mobile viewports to prevent awkward line breaks in narrow listing grids.

## Layout & Spacing

The design system implements a **fluid-responsive column grid** structured around an 8px spatial rhythm:

- **Desktop (≥ 1024px)**: 12-column grid with a `margin-desktop` of `2.5rem` and `gutter-desktop` of `1.5rem`. Max content container width caps at `1280px` for browsing consistency.
- **Tablet (768px – 1023px)**: 8-column layout utilizing `1.5rem` margins and `1rem` gutters, allowing 2-to-3 item card arrangements.
- **Mobile (< 768px)**: 4-column layout with `1rem` margins and gutters. Trade feeds render in a 2-column masonry or responsive grid layout with persistent bottom navigation.
- **Component Spacing**: Internal card padding strictly follows `space-md` for compact cards and `space-lg` for modal or trade dialogue sheets.

## Elevation & Depth

Visual hierarchy is communicated through **tonal surface layering combined with ambient, tinted drop shadows**. Harsh dark borders are omitted in favor of soft ambient contrast.

- **Base Canvas (Level 0)**: `#f8fafc` serves as the primary backdrop for page feeds and application views.
- **Surface Elevation 1 (Card & Content Blocks)**: Pure `#ffffff` resting on `#f8fafc`, styled with a subtle ambient shadow: `0 1px 3px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.03)` and a hairline border of `#e2e8f0` (1px).
- **Surface Elevation 2 (Hover States, Floating Panels, Popovers)**: Elevated cards during trade drag-and-drop or hover: `0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -2px rgba(15, 23, 42, 0.03)`.
- **Surface Elevation 3 (Modals, Barter Proposal Sheets, Bottom Navigation)**: Floating system sheets over a blurred backdrop (`backdrop-blur-md` with `rgba(15, 23, 42, 0.4)` tint), framed by `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.04)`.

## Shapes

The design system standardizes on generous curvature to promote a welcoming, community-centric environment:

- **Base Radius (0.5rem / 8px)**: Form fields, buttons, interactive badges, and segmented toggles.
- **Large Radius (`rounded-xl` / 1rem / 16px)**: Standard product cards, filter drawers, and interactive preview tiles.
- **Extra Large Radius (`rounded-2xl` / 1.5rem / 24px)**: Hero trade callouts, featured exchange containers, onboarding carousels, and bottom sheets.
- **Pill Radius (9999px)**: Category tags, status pills, trade status counters, and the student verification badge.

## Components

### Buttons
- **Primary Action (Crimson)**: Background `#b31b1b`, text `#ffffff`, typography `label-lg`, height 44px (48px mobile touch targets), roundedness 8px. Hover shifts to `#991b1b` with a slight elevation rise.
- **Secondary / Trade Button (Blue Tone)**: Background `#003a8f`, text `#ffffff`, for official school actions, campus location confirmations, and direct swap confirmations.
- **Ghost / Neutral**: Slate subtle background `#f1f5f9` on hover, text `#334155`.

### Chips & Badges
- **Verified Student Badge**: Pill container, background `rgba(0, 58, 143, 0.08)`, border `1px solid rgba(0, 58, 143, 0.2)`, text `#003a8f`, typography `label-sm`. Accompanied by an embedded checkmark shield icon.
- **Condition / Category Chips**: Soft background `#f1f5f9`, text `#475569`, active state fills with `#b31b1b` with pure white text.

### Cards (Item & Swap Cards)
- Background `#ffffff`, border 1px solid `#e2e8f0`, border radius `rounded-xl` (16px), overflow hidden.
- Image aspect ratio locked at 4:3 with inset category chip on top-left and wishlist icon button on top-right. Bottom section contains title (`headline-sm`), requester's faculty/campus label, and swap preference indicator.

### Input Fields & Controls
- Form inputs feature 1px solid `#cbd5e1`, background `#ffffff`, radius 8px, padding `0.75rem 1rem`. Focus state features a 2px crimson ring (`#b31b1b`) with a faint glow offset.
- Checkboxes and Radios use active primary crimson fill `#b31b1b` with white indicators.

### Community-Specific Components
- **Swap Exchange Proposal Card**: Dual-sided horizontal card showing "Offering" vs. "Seeking" with an animated interlocking exchange node between both items.
- **Campus Dropzone Indicator**: Micro-card detailing meeting spots (e.g., "Beytepe Library Gate", "Sıhhiye Cafeteria") tagged with walking distances and safe-exchange markers.