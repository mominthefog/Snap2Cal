# Snap2Cal - Branding Guidelines

## Brand Identity

### Brand Name
**Snap2Cal** (styled as one word with capital S and C)

- Pronunciation: "Snap to Cal"
- Never: "Snap 2 Cal", "snap2cal", "Snap2cal"

### Tagline
**Primary:** *One Snap. Zero Mental Load.*

**Secondary:** *Transform Images into Calendar Events*

### Brand Promise
Eliminate the friction of manual calendar entry by instantly converting visual event information into calendar events.

---

## Color Palette

### Primary Brand Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Charcoal** | `#3B402B` | 59, 64, 43 | Primary text, logo, headings, user profile borders |
| **Muted Ocean** | `#A1BED1` | 161, 190, 209 | Primary accent, buttons, borders, links, gradients |
| **Warm Coral** | `#D4A088` | 212, 160, 136 | CTA buttons (Sign in), file selected state, accent borders |
| **Dark Text** | `#333333` | 51, 51, 51 | Headings, titles |
| **White** | `#FFFFFF` | 255, 255, 255 | Backgrounds, cards, button text |

### Secondary/UI Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Muted Gray** | `#7C8B9A` | Tagline text, subtle labels |
| **Body Text** | `#555555` | Paragraph text, descriptions |
| **Light Gray** | `#666666` | Captions, secondary text |
| **Warm Beige** | `#EDE1D4` | File selected background, signed-in info background |
| **Purple Accent** | `#764BA2` | Button gradient endpoint |

### Border & Background Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Light Border** | `#D0DFE6` | Upload zone border, input borders |
| **Hover Border** | `#B8CED9` | Upload zone hover state |
| **Light Background** | `#EEF3F6` | Hover backgrounds, dragover state |
| **Info Background** | `#F0F4FF` to `#E8F0FE` | AI narrative gradient, email capture section |
| **How It Works BG** | `#F8F9FF` | How it works section |

### State Colors

| State | Background | Text/Border | Usage |
|-------|------------|-------------|-------|
| **Success** | `#D1FAE5` | `#047857` / `#10B981` | Added events, success messages |
| **Error** | `#FEF2F2` | `#991B1B` / `#FECACA` | Error states, warnings |
| **Session Expired** | `#FEF3ED` | `#D4A088` | Reconnect prompt |

### Button Colors

| Button Type | Background | Hover | Text |
|-------------|------------|-------|------|
| **Primary CTA** | `#D4A088` | `#C48E78` | White |
| **Secondary** | `linear-gradient(135deg, #A1BED1 0%, #764BA2 100%)` | - | White |
| **Event Add** | `#A1BED1` | `#5568D3` | White |
| **Edit Link** | `#E0E7FF` | `#C7D2FE` | `#4F46E5` |
| **Cancel** | `#F3F4F6` | `#E5E7EB` | `#374151` |
| **Submit** | `#A1BED1` | `#8FAFC4` | White |

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             Oxygen, Ubuntu, Cantarell, sans-serif;
```

The brand uses system fonts for optimal performance and native feel across platforms.

### Type Scale

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| H1 (Page Title) | 2.5em | Bold | `#333333` |
| H2 (Section) | 1.5em | Bold | `#333333` |
| Headline | 1.4em | 500 | `#333333` |
| Tagline | 1.1em | 400 | `#7C8B9A` |
| Body | 1em | 400 | `#555555` |
| Small/Caption | 0.9em | 400 | `#666666` |

---

## Logo Assets

### Logo Files Location
`/Snap2CalLogos/`

### Available Formats

| File | Size | Use Case |
|------|------|----------|
| `Snap2Cal_Logo_500px.png` | 500px | Web header, marketing |
| `Snap2Cal_Logo_120px.png` | 120px | Small displays |
| `Snap2CalIcon.png` | Icon only | App icons, small spaces |

### Favicon Options

Located in `/Snap2CalLogos/Favicons/`

**Style 1 (Primary):** Calendar with checkmark
- `Snap2Cal_favicon01_charcoal.svg/.png` (Default - used in production)
- `Snap2Cal_favicon01_black.svg/.png`
- `Snap2Cal_favicon01_coral.svg/.png`
- `Snap2Cal_favicon01_ocean.svg/.png`

**Style 2 (Alternative):** Calendar with camera
- `Snap2Cal_favicon02_charcoal.svg/.png`
- `Snap2Cal_favicon02_black.svg/.png`
- `Snap2Cal_favicon02_coral.svg/.png`
- `Snap2Cal_favicon02_ocean.svg/.png`

### Logo Clear Space
Maintain minimum clear space equal to the height of the "2" character around the logo.

---

## UI Components

### Buttons

**Primary CTA (Coral - Sign In)**
```css
background: #d4a088;
color: white;
border-radius: 10px;
padding: 15px 30px;
font-weight: 600;
box-shadow: 0 4px 12px rgba(212, 160, 136, 0.4);
```
Hover: `background: #c48e78`

**Secondary CTA (Gradient - Process Image)**
```css
background: linear-gradient(135deg, #a1bed1 0%, #764ba2 100%);
color: white;
border-radius: 10px;
padding: 15px 30px;
font-weight: 600;
box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
```

**Event Add Button**
```css
background: #a1bed1;
color: white;
padding: 10px 16px;
border-radius: 6px;
font-weight: 600;
```
Hover: `background: #5568d3`

**Success State (Added)**
```css
background: #d1fae5;
color: #047857;
```

### Cards

**Main Container**
```css
background: white;
border-radius: 20px;
padding: 40px;
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
```

**Event Cards**
```css
background: white;
padding: 20px;
border-radius: 8px;
border-left: 4px solid #a1bed1;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
```

**Event Card (Added State)**
```css
border-left-color: #10b981;
background-color: rgba(209, 250, 229, 0.3);
```

### Upload Zone

**Default State**
```css
border: 2px dashed #d0dfe6;
border-radius: 12px;
padding: 48px 32px;
background-color: rgba(238, 242, 255, 0.5);
```

**Hover State**
```css
border-color: #b8ced9;
background-color: #eef3f6;
```

**Drag Over State**
```css
background-color: #eef3f6;
border-color: #a1bed1;
transform: scale(0.98);
```

**File Selected State**
```css
background-color: #ede1d4;
border-color: #d4a088;
```

### AI Narrative Box
```css
background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%);
border-radius: 12px;
padding: 16px 20px;
border-left: 4px solid #a1bed1;
```

### Signed-In Info Bar
```css
background-color: #ede1d4;
padding: 10px;
border-radius: 8px;
color: #3B402B;
```

### Why Sign In Box
```css
background-color: #ede1d4;
border-radius: 12px;
padding: 20px;
border-left: 4px solid #d4a088;
color: #3B402B;
```

### Error State
```css
background: #fef2f2;
border: 1px solid #fecaca;
border-radius: 8px;
color: #991b1b; /* heading */
color: #555; /* body text */
```

---

## Iconography

### Icon Style
- Stroke-based SVG icons
- 2px stroke width
- Round line caps and joins
- Match current text color (typically `#3B402B` or `#A1BED1`)

### Common Icons Used

| Purpose | Icon Description |
|---------|------------------|
| Upload | Arrow pointing up with horizontal line |
| Calendar | Rectangle with date markers |
| Clock | Circle with clock hands |
| Location | Map pin with circle |
| Document | Page with folded corner |
| Checkmark | Circle with checkmark (success) |
| Edit | External link with arrow |

---

## Tone of Voice

### Personality Traits
- **Friendly** - Warm, approachable language
- **Helpful** - Clear instructions, anticipate questions
- **Efficient** - Concise, respects user's time
- **Reassuring** - Addresses privacy/security concerns proactively

### Writing Style

**Do:**
- Use active voice
- Keep sentences short
- Address the user directly ("you", "your")
- Explain benefits, not just features
- Use emoji sparingly for warmth (in lists/instructions)

**Don't:**
- Use technical jargon unnecessarily
- Create walls of text
- Sound robotic or corporate
- Over-promise capabilities

### Example Copy

**Good:** "Your images are processed and immediately discarded. We never store them."

**Avoid:** "Image data is transmitted to our AI processing service and subsequently purged from temporary memory."

---

## Application States

### Empty State (Pre-login)
- Show "How it works" section (background: `#F8F9FF`)
- Display "Why sign in with Google?" box (background: `#EDE1D4`, border: `#D4A088`)
- Prominent coral sign-in button

### Authenticated State
- Show user profile (photo, name, email) in beige bar (`#EDE1D4`)
- User photo has charcoal border (`#3B402B`)
- Display upload zone
- Hide explanatory content

### Processing State
- Spinner animation
- "Processing..." button text
- Disabled button state (70% opacity)

### Success State
- Green checkmark icon
- "Added" button text
- Muted green background (`#D1FAE5`) on event card
- Green left border (`#10B981`)
- Edit link appears (purple/indigo: `#4F46E5`)

### Error State
- Light red background (`#FEF2F2`)
- Red border (`#FECACA`)
- Dark red heading (`#991B1B`)
- Clear, actionable error message

### Session Expired State
- Peachy background (`#FEF3ED`)
- Coral left border (`#D4A088`)
- "Reconnect with Google" button

---

## Responsive Breakpoints

| Breakpoint | Width | Adjustments |
|------------|-------|-------------|
| Desktop | > 768px | Full layout |
| Tablet | 480-768px | Reduced padding, smaller fonts |
| Mobile | < 480px | Stacked layouts, compact components |

---

## Gradient Specifications

| Name | CSS | Usage |
|------|-----|-------|
| **Page Background** | `linear-gradient(to bottom, #FFFFFF 0%, #a1bed1 100%)` | Body background |
| **Button Gradient** | `linear-gradient(135deg, #a1bed1 0%, #764ba2 100%)` | Process Image button |
| **AI/Info Box** | `linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)` | AI narrative, email capture |

---

## Brand Assets Contact

For logo files, brand assets, or questions about brand usage:

**Email:** hello@snap2cal.ai

**Company:** AmandaMade Digital Studio

---

*Last Updated: January 2026*
