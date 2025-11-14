# Green Wallet Habit Theme Export

## Theme Purpose & Mood
- **Essence:** A calm but energized system for reinforcing conscious financial habits, sustainability, and long-term growth.
- **Personality keywords:** grounded, luminous, trustworthy, botanical, data-aware, optimistic, nurturing.
- **Emotional targets:** inspire daily discipline without anxiety, communicate eco-friendly wealth, keep interactions warm and human.

## Color System
| Role | Hex | Usage & Notes |
| --- | --- | --- |
| **Primary Canopy** | `#1D5C4D` | Signature evergreen tone; anchors navigation, hero blocks, and dominant controls across web, mobile, and desktop apps. |
| **Primary Light** | `#3F8B72` | Secondary fills, gradients, hover states, supporting backgrounds for cards or HUDs. |
| **Growth Accent** | `#8FE1A2` | Highlights upward trends, success states, progress bars, CTA outlines. Works for shader tints in games. |
| **Sunlit Accent** | `#F2C94C` | Warm spark for notifications, achievement medals, key icons. Use sparingly (≤10% area). |
| **Charcoal Soil** | `#1B1F23` | Text on light surfaces, cinematic overlays, nighttime dashboard backgrounds. |
| **Mist White** | `#F6FBF8` | Default canvas, UI chrome, diegetic HUD panels, typography backgrounds. |
| **Muted Clay** | `#C3B8A0` | Secondary text, dividers, muted buttons, props in 3D scenes. |

### Gradients & Effects
- **Morning Growth:** `#1D5C4D → #3F8B72 → #8FE1A2` (left-to-right or radial); use for hero sections, splash screens, level backgrounds.
- **Lumen Glow:** apply soft light overlay `rgba(242, 201, 76, 0.25)` for callouts and particle effects.
- **Shadow philosophy:** soft, long shadows to convey natural light (blur 24–40px, opacity 15%).

## Typography & Voice
- **Headline family:** "Space Grotesk" or "Sora"; geometric warmth, uppercasing optional for large hero statements.
- **Body family:** "Inter" or "IBM Plex Sans"; accessible, modern, works in code editors, HUDs, and captions.
- **Monospace:** "JetBrains Mono" for data readouts, CLI tools, or in-game terminals.
- **Tone of copy:** supportive coach, first-person plural, positive reinforcement ("Let’s revisit your goals" vs. "You failed").

## Iconography & Motifs
- Soft-rounded rectangles, leaf-inspired chevrons, seeds/sprouts for progress.
- Use thin-line icons with occasional filled nodes to show milestones.
- Graph motifs: curved branches, stacking leaves representing budgets.

## Interaction & Motion Principles
- Motion should feel organic: ease-in-out, 300–600ms depending on platform.
- Micro-interactions highlight progress (e.g., pulsing leaf when savings increase).
- Sound palette (if applicable): soft wood clicks, subtle wind chimes, low-frequency confirmation chimes.

## Layout Guidance (Web, Apps, Games)
- **Web/App dashboards:** layered cards floating above Mist White with Primary Canopy headers. Use Growth Accent for progress bars and data pulses.
- **Mobile:** maintain 8px baseline grid; accent colors reserved for CTA buttons and streak indicators.
- **Game HUDs:** minimal frames, translucent Mist White panels, Growth Accent outlines for actionable elements.
- **Environmental storytelling:** combine botanical textures with modern finance iconography (coins with leaf engravings, digital vines around data panels).

## Components & Patterns
- **Call-to-Action Buttons:** Primary Canopy fill, Mist White text, 12px radius. Hover/press lifts with Growth Accent border.
- **Cards & Panels:** Mist White fill, Charcoal Soil text, optional top strip in Primary Light.
- **Achievement Badges:** circular or pentagonal shapes, Sunlit Accent core, Growth Accent rings.
- **Notifications:** slide-in leaves, color-coded states (success = Growth Accent, warning = Sunlit Accent, neutral = Muted Clay).

## Cross-Media Adaptation Tips
1. **Consistent materials:** translate colors into shader/material libraries (e.g., Unity URP, Unreal) by matching HEX to linear color.
2. **Print packaging or merch:** favor recycled textures; use Primary Canopy as dominant ink, Growth Accent for foil stamping.
3. **Voice UI / chatbots:** pair tonal guidelines with friendly, supportive responses.
4. **3D assets:** matte greens with subtle specular highlights to avoid plastic feel.
5. **Accessibility:** maintain 4.5:1 contrast for text; provide dyslexia-friendly font option (e.g., OpenDyslexic) without breaking hierarchy.

## Sample Scene Descriptions
- **Onboarding:** animated seed sprouting into a wallet icon, gradient background (Morning Growth), supportive copy.
- **Progress Celebration:** confetti of micro-leaves drifting upward, Sunlit Accent sparkles.
- **Deep Dive Analytics:** dark Charcoal Soil canvas with neon Growth Accent graphs, ambient glow.

## Implementation Checklist
- [ ] Import typography families (Space Grotesk, Inter) across platforms.
- [ ] Define color tokens in design system (web variables, mobile asset catalog, game engine materials).
- [ ] Document component states (idle, hover, pressed, disabled) using colors above.
- [ ] Prepare icon set with botanical geometry.
- [ ] Create motion presets (ease timings, keyframe guidelines).

Use this document as the canonical reference when exporting the Green Wallet Habit Theme to new products, ensuring every experience feels cohesive, eco-minded, and habit-building.
