# Lenny's Oracle — Brand Guidelines

> *Product wisdom, written in the stars.*

## 🌟 Brand Overview

Lenny's Oracle is a mystical PM wisdom experience that transforms Lenny Rachitsky's product management insights into an interactive, gamified oracle. The brand sits at the intersection of **cosmic elegance** and **practical wisdom** — mystical enough to feel magical, grounded enough to feel useful.

### Brand Personality

| Trait | We Are | We Aren't |
|-------|--------|-----------|
| **Mystical** | Elegant, cosmic, wonder-inspiring | Cheesy, new-age, horoscope-y |
| **Wise** | Insightful, experienced, trustworthy | Preachy, condescending, academic |
| **Approachable** | Warm, inviting, friendly | Stuffy, exclusive, intimidating |
| **Fun** | Delightful, surprising, playful | Juvenile, distracting, gimmicky |
| **Magical** | Transformative, awe-inspiring | Superficial, gimmicky |

---

## 🎨 Logo

### Logo Concept

A **crystal ball containing a constellation** — representing the oracle's ability to reveal hidden patterns and wisdom. The constellation inside symbolizes connected knowledge (like PM skills forming a greater whole).

### Logo Files

| File | Usage |
|------|-------|
| `logo-primary.svg` | Default. Stacked wordmark + icon. Hero sections, about pages. |
| `logo-icon.svg` | Icon only. App icon, favicon (use `favicon.svg` for browsers), profile pics. |
| `logo-horizontal.svg` | Inline lockup. Headers, navigation bars, email signatures. |
| `logo-dark.svg` | Optimized for dark backgrounds (#0f0c29 → #302b63). |
| `logo-light.svg` | Optimized for light backgrounds (#f5f0eb → #ffffff). |
| `favicon.svg` | Browser favicon. Simplified icon at 32×32 with rounded rect background. |

### Logo Usage Rules

**Clear space:** Maintain padding equal to the height of the "L" in "LENNY'S" on all sides.

**Minimum sizes:**
- Primary logo: 200px wide minimum
- Icon only: 32px minimum (48px recommended)
- Horizontal: 240px wide minimum

**Don'ts:**
- ❌ Don't rotate the logo
- ❌ Don't change the constellation pattern
- ❌ Don't use on busy/patterned backgrounds without contrast overlay
- ❌ Don't stretch or distort proportions
- ❌ Don't add drop shadows (the glow filter IS the shadow)
- ❌ Don't use the light version on dark backgrounds (or vice versa)

---

## 🎨 Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Cosmic Deep** | `#0f0c29` | `15, 12, 41` | Primary background |
| **Mystic Purple** | `#302b63` | `48, 43, 99` | Secondary surfaces, cards |
| **Twilight Blue** | `#24243e` | `36, 36, 62` | Card backgrounds, inputs |
| **Oracle Gold** | `#ffd700` | `255, 215, 0` | Stars, highlights, borders |
| **Lenny Orange** | `#ff6b35` | `255, 107, 53` | CTAs, action buttons |

### Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Cream** | `#f5f0eb` | Body text on dark |
| **White** | `#ffffff` | Headings, high emphasis |
| **Warm Gray** | `#a09dad` | Secondary text, metadata |
| **Deep Gray** | `#1a1a2e` | Borders, dividers |

### Accent Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Gold Light** | `#ffec80` | Active stars, bright highlights |
| **Mystic Rose** | `#e8a0bf` | Special achievements |
| **Cosmic Teal** | `#64ffda` | Success, streaks |
| **Starlight Silver** | `#c8c8e8` | Disabled, placeholder |

### Semantic Colors

| State | Hex | Usage |
|-------|-----|-------|
| Success | `#64ffda` | Achievements, correct |
| Warning | `#ffd700` | Streak warnings |
| Error | `#ff6b6b` | Errors, destructive |
| Info | `#a5d8ff` | Tips, information |

### Gradients

```css
/* Main background */
background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);

/* Gold shimmer (borders, accents) */
background: linear-gradient(135deg, #ffd700 0%, #ffec80 50%, #ffd700 100%);

/* Frosted glass cards */
background: linear-gradient(135deg, rgba(48, 43, 99, 0.4) 0%, rgba(36, 36, 62, 0.6) 100%);
backdrop-filter: blur(20px) saturate(180%);

/* Oracle chat bubble */
background: linear-gradient(135deg, #302b63 0%, #24243e 100%);

/* Hero glow (behind crystal ball) */
background: radial-gradient(ellipse at center, rgba(255, 215, 0, 0.15) 0%, transparent 70%);

/* Primary button */
background: linear-gradient(135deg, #ffd700 0%, #ff6b35 100%);
```

### WCAG Contrast Ratios

| Pair | Ratio | Rating |
|------|-------|--------|
| White on Cosmic Deep | 16.8:1 | ✅ AAA |
| Cream on Cosmic Deep | 14.2:1 | ✅ AAA |
| Oracle Gold on Cosmic Deep | 11.7:1 | ✅ AAA |
| Warm Gray on Cosmic Deep | 5.2:1 | ✅ AA |
| Cosmic Deep on Cream | 14.2:1 | ✅ AAA (light mode) |

---

## 📝 Typography

### Font Stack

| Role | Font | Fallback | Usage |
|------|------|----------|-------|
| **Heading** | Cinzel | Times New Roman, Georgia, serif | Titles, page headers, branding |
| **Body** | Inter | -apple-system, Segoe UI, sans-serif | Body text, UI elements, buttons |
| **Accent** | EB Garamond | Georgia, serif | Card quotes, oracle wisdom, italicized text |
| **Mono** | JetBrains Mono | Fira Code, Consolas, monospace | Stats, numbers, code |

### Type Scale (1.25 ratio)

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Display | 3.815rem (61px) | 400 | 1.2 | Hero display text |
| Hero | 3.052rem (49px) | 400 | 1.2 | Hero titles |
| H1 | 2.441rem (39px) | 500 | 1.2 | Page titles |
| H2 | 1.953rem (31px) | 500 | 1.375 | Section headers |
| H3 | 1.563rem (25px) | 600 | 1.375 | Subsection headers |
| H4 | 1.25rem (20px) | 600 | 1.5 | Card titles |
| Body LG | 1.125rem (18px) | 400 | 1.625 | Lead paragraphs |
| Body | 1rem (16px) | 400 | 1.5 | Default text |
| Body SM | 0.8rem (13px) | 400 | 1.5 | Captions |
| Label | 0.64rem (10px) | 600 | 1 | Badges, tags |

### Letter Spacing

| Style | Value | Usage |
|-------|-------|-------|
| Mystical | 0.3em | "LENNY'S ORACLE" branding |
| Wider | 0.1em | Labels, buttons |
| Wide | 0.05em | Headings |
| Normal | 0 | Body text |
| Tight | -0.025em | Large numbers |

### Special Typography Classes

```css
/* Oracle wisdom text (card quotes, insights) */
.oracle-wisdom {
  font-family: 'EB Garamond', serif;
  font-size: 1.25rem;
  font-weight: 500;
  font-style: italic;
  line-height: 1.625;
  letter-spacing: 0.05em;
}

/* Stat numbers (streak count, level, XP) */
.stat-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.953rem;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.025em;
}

/* Button text */
.button-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

---

## 🃏 UI Components

### Tarot Cards

```css
.oracle-card {
  aspect-ratio: 2 / 3;          /* Standard tarot proportion */
  border-radius: 8px;
  border: 2px solid #ffd700;
  background: linear-gradient(135deg, rgba(48, 43, 99, 0.4), rgba(36, 36, 62, 0.6));
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 
    0 0 20px rgba(255, 215, 0, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.oracle-card:hover {
  border-color: #ffec80;
  box-shadow: 
    0 0 30px rgba(255, 215, 0, 0.25),
    0 12px 40px rgba(0, 0, 0, 0.4);
  transform: translateY(-4px);
  transition: all 0.3s ease;
}
```

### Buttons

```css
/* Primary — Gold gradient */
.btn-primary {
  background: linear-gradient(135deg, #ffd700 0%, #ff6b35 100%);
  color: #0f0c29;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  transform: translateY(-2px);
}

/* Secondary — Ghost with gold border */
.btn-secondary {
  background: transparent;
  color: #ffd700;
  border: 1.5px solid #ffd700;
  border-radius: 8px;
  padding: 12px 24px;
}

.btn-secondary:hover {
  background: rgba(255, 215, 0, 0.1);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
}

/* Disabled */
.btn-disabled {
  background: #302b63;
  color: #a09dad;
  border: 1px solid #1a1a2e;
  cursor: not-allowed;
  opacity: 0.6;
}
```

### Chat Bubbles

```css
/* User message */
.chat-user {
  background: #f5f0eb;
  color: #0f0c29;
  border-radius: 16px 16px 4px 16px;
  padding: 12px 16px;
  max-width: 75%;
  align-self: flex-end;
}

/* Oracle message */
.chat-oracle {
  background: linear-gradient(135deg, #302b63, #24243e);
  color: #ffffff;
  border-radius: 16px 16px 16px 4px;
  padding: 12px 16px;
  max-width: 80%;
  align-self: flex-start;
  border: 1px solid rgba(255, 215, 0, 0.15);
}
```

### Progress Bars

```css
.progress-bar {
  background: rgba(48, 43, 99, 0.5);
  border-radius: 999px;
  height: 8px;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(90deg, #ffd700, #ffec80, #ffd700);
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s ease;
}

/* Level up pulse animation */
@keyframes levelUpPulse {
  0%, 100% { box-shadow: 0 0 0 rgba(255, 215, 0, 0); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
}
```

---

## ✨ Visual Effects

### Particle System

```css
/* Twinkling star */
@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

.star-particle {
  width: 3px;
  height: 3px;
  background: #ffd700;
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
  box-shadow: 0 0 6px #ffd700;
}

/* Card reveal burst */
@keyframes cardReveal {
  0% { transform: scale(0.8) rotateY(180deg); opacity: 0; }
  50% { transform: scale(1.05) rotateY(90deg); opacity: 0.5; }
  100% { transform: scale(1) rotateY(0deg); opacity: 1; }
}

/* Constellation line draw */
@keyframes drawLine {
  from { stroke-dashoffset: 100; }
  to { stroke-dashoffset: 0; }
}
```

### Glassmorphism

```css
.glass-surface {
  background: rgba(36, 36, 62, 0.4);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-radius: 12px;
}
```

---

## 🗣️ Voice & Tone

### Writing Principles

1. **Mystical, not cheesy** — Invoke wonder without being corny
2. **Active voice** — The Oracle reveals, guides, illuminates
3. **Warm authority** — Confident but never condescending
4. **Concise magic** — Every word earns its place

### Voice Examples

| Context | ✅ Do | ❌ Don't |
|---------|-------|---------|
| Daily card | "The Oracle reveals your path" | "Click here to see results" |
| Card draw | "Draw your daily wisdom" | "Access your cards" |
| Achievement | "A new constellation forms in your sky" | "Badge unlocked" |
| Streak | "Your oracle bond grows stronger" | "You have a 7-day streak" |
| Chat | "The stars suggest..." | "Based on data analysis..." |
| Error | "The cosmos are momentarily clouded" | "Error: something went wrong" |
| Loading | "Consulting the stars..." | "Loading..." |
| Empty state | "Your journey begins with a single question" | "No data to display" |
| Level up | "You have ascended to a new plane of wisdom" | "You reached level 5" |
| Welcome | "The Oracle has been expecting you" | "Welcome to the app" |

### Taglines

- **Primary:** "Product wisdom, written in the stars"
- **Secondary:** "Where PM knowledge meets cosmic insight"
- **Action:** "Ask the Oracle"
- **Card draw:** "What wisdom awaits you today?"

---

## 🖼️ Icons

### Skill Category Icons

All icons use the Oracle Gold gradient (`#ffd700` → `#ffec80`) and follow a consistent 48×48 viewBox.

| Icon | File | Concept |
|------|------|---------|
| Growth | `skill-growth.svg` | Upward arrow with chart bars and sparkle |
| Strategy | `skill-strategy.svg` | Chess knight piece |
| Design | `skill-design.svg` | Pen nib with sparkles |
| Leadership | `skill-leadership.svg` | Crown with radiance |
| Data | `skill-data.svg` | Eye with chart iris |
| Culture | `skill-culture.svg` | Connected people with heart |

### Icon Design Rules

- Stroke-based, not filled (for elegance)
- Gold gradient primary color
- Subtle sparkle accents
- 2px default stroke width
- Consistent 48×48 viewBox
- Works at 24px minimum

---

## 📐 Patterns

### Card Back (`card-back.svg`)
Full tarot card back design at 300×450 (2:3 ratio). Features:
- Cosmic gradient background
- Star field pattern
- Double gold border with corner ornaments
- Sacred geometry circles
- Central crystal ball with constellation
- Radiating lines
- "LENNY'S" / "ORACLE" text at top/bottom

### Constellation Pattern (`constellation-pattern.svg`)
Tileable 400×400 pattern for backgrounds. Features:
- 3 constellation clusters per tile
- Connected star nodes with lines
- Scattered dust particles
- Seamlessly repeatable

---

## 📱 Responsive Guidelines

### Breakpoints

| Name | Width | Adjustments |
|------|-------|-------------|
| Desktop | ≥1024px | Full layout, all effects |
| Tablet | 768-1023px | Reduced particles, stacked cards |
| Mobile | <768px | Simplified effects, larger touch targets |

### Touch Targets

- Minimum: 44×44px (iOS Human Interface Guidelines)
- Recommended: 48×48px
- Card tap areas: Full card surface

### Performance

- Reduce particle count on mobile (max 30 vs 100 on desktop)
- Disable backdrop-filter on low-end devices
- Use `will-change` sparingly
- Lazy-load constellation patterns
- SVGs over PNGs (always)

---

## 📁 Asset Inventory

```
branding/
├── README.md                          ← You are here
├── logo/
│   ├── logo-primary.svg              ← Stacked wordmark + crystal ball
│   ├── logo-icon.svg                 ← Crystal ball icon only
│   ├── logo-horizontal.svg           ← Inline lockup for headers
│   ├── logo-dark.svg                 ← For dark backgrounds
│   ├── logo-light.svg                ← For light backgrounds
│   └── favicon.svg                   ← Browser favicon (32×32)
├── colors/
│   └── palette.json                  ← Complete color system (hex, RGB, HSL)
├── typography/
│   └── type-scale.css                ← Full type system with Google Fonts
├── icons/
│   ├── skill-growth.svg              ← 📈 Growth category
│   ├── skill-strategy.svg            ← ♞ Strategy category
│   ├── skill-design.svg              ← ✒️ Design category
│   ├── skill-leadership.svg          ← 👑 Leadership category
│   ├── skill-data.svg                ← 👁️ Data/Analytics category
│   └── skill-culture.svg             ← 👥 Culture category
├── patterns/
│   ├── card-back.svg                 ← Full tarot card back design
│   └── constellation-pattern.svg     ← Tileable background pattern
└── mockups/
    └── (generate with canvas/browser)
```

---

## 🔗 Implementation Notes

### Google Fonts Import

```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### CSS Variables Quick Start

```css
:root {
  --color-bg: #0f0c29;
  --color-surface: #24243e;
  --color-surface-elevated: #302b63;
  --color-gold: #ffd700;
  --color-gold-light: #ffec80;
  --color-orange: #ff6b35;
  --color-cream: #f5f0eb;
  --color-text: #ffffff;
  --color-text-secondary: #f5f0eb;
  --color-text-muted: #a09dad;
  --color-border: #1a1a2e;
  
  --font-heading: 'Cinzel', serif;
  --font-body: 'Inter', sans-serif;
  --font-accent: 'EB Garamond', serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 999px;
}
```

---

*Brand guidelines v1.0 — Lenny's Oracle*
*"The stars are aligned. Build something beautiful."* ✨