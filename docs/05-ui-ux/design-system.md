# Design System

## Color Palette

**Theme:** Education & F&B SaaS — Material Design 3 (MD3)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#E05318` | Sunlit terracotta — CTAs, active states, badges |
| `--color-success` | `#16A34A` | Fresh herb green — Attend status, success states |
| `--color-surface` | `#F8FAFC` | Clean warm neutral — Page background |
| `--color-emergency` | `#DC2626` | Emergency badges, critical alerts |
| `--color-pending` | `#D97706` | Pending status chips |
| `--color-locked` | `#6B7280` | Locked / read-only state indicators |

## Typography

**Primary font:** System-ui / Inter (MD3 compatible)

| Scale | Usage |
|-------|-------|
| Headline Large | Screen titles |
| Headline Small | Section headers, card titles |
| Body Large | Primary content text |
| Body Medium | Secondary content, labels |
| Label Large | Buttons, chips |
| Label Small | Badges, meta-text |

## Border Radius

All cards: **12px** rounded corners (MD3 standard)

## Elevation / Shadow

Cards: `box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)`

## Key Components

| Component | Usage |
|-----------|-------|
| Metric Card | Summary stats at top of demand screen (Base Registered, Confirmed, Absent, Extra) |
| Class Accordion | Expandable class card with student roster |
| Student Row | Per-student attendance toggle with allergen badges |
| Cutoff Badge | Live countdown: `08:30 AM Cutoff • 42 min remaining` |
| Status Chip | `Open for changes` (green) / `Locked` (gray) / `Emergency` (red) |
| Inline Stepper | `[-]` / `[+]` buffer % controls in quantity table |
| Bottom Sheet | Slide-up modal for new change request form |
| Audit Timeline | Vertical chronological log with connected nodes |
| FAB | Floating Action Button for primary action shortcuts |

## Responsive Breakpoints

| Mode | Width | Notes |
|------|-------|-------|
| Desktop / Tablet Dashboard | > 768px | Default view |
| Mobile Frame | 390px | Toggled via viewport switcher |
