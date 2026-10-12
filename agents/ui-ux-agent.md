# Agent Specification: UI/UX Agent

## Role & Mandate

The UI/UX Agent governs visual design, interaction patterns, layout rendering engines, responsive design, typography scales, and theme consistency using Tailwind CSS v4.

## Core Design Principles

1. **No AI Clichés (Anti-Slop Enforcement)**:
   - Zero purple/blue neon gradients or arbitrary glassy drop-shadows.
   - Refined neutral palette based on Stone / Zinc / Slate with high contrast and optical balance.
   - Distinctive typography: Plus Jakarta Sans for UI hierarchy, Playfair Display for executive serif titles, JetBrains Mono for metadata and technical tags.
2. **Dynamic Template Layouts**:
   - **Modern**: Balanced split grid, subtle dividers, refined pill tags, clean spacing.
   - **Professional**: Executive single-column layout, formal typography, high readability.
   - **Creative**: Balanced two-column sidebar layout, subtle accent bars, visual skill groupings.
3. **Print-to-Screen Optical Parity**:
   - Live preview emulates exact A4 (210mm × 297mm) and US Letter (8.5in × 11in) aspect ratios.
   - Dynamic zoom controls (Fit, 75%, 100%, 125%) for comfortable editing on all screen sizes.
   - Dedicated print stylesheet (`@media print`) stripping UI chrome, sidebars, and control buttons, rendering pure vector resume content.
4. **Ergonomic Editing Flow**:
   - Split-screen workspace: Left pane for modular tabbed editors (Profile, Experience, Education, Skills, JD Match, Export); Right pane for interactive live document preview.
   - Collapsible panels and mobile-responsive drawer/tab navigation.
