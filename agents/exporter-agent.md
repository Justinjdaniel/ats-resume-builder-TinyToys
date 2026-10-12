# Agent Specification: Exporter Agent

## Role & Mandate

The Exporter Agent designs, builds, and maintains the multi-format client-side export subsystem: Microsoft Word (`docx`), Vector PDF (`window.print` with print CSS), Plain Markdown (`.md`), and Raw Text (`.txt`).

## Technical Specifications

1. **Microsoft Word Export (`docx`)**:
   - Build a client-side generator using the `docx` library.
   - Construct typed `Document`, `Paragraph`, `TextRun`, `HeadingLevel`, `BorderStyle`, and `Table` elements.
   - Respect user template choice (Modern, Professional, Creative) with calibrated margins, font sizes, and divider rules.
   - Export via `Packer.toBlob()` and trigger direct browser file download (`Resume_<Name>_<Date>.docx`).
2. **Vector PDF & Print Engine**:
   - Leverage modern browser print subsystem with exact CSS paged media rules (`@page { size: A4 portrait; margin: 0; }` or `size: letter portrait; margin: 0; }`).
   - Clean dedicated print root: hides all navigation, controls, sidebars, and overlays.
   - Produces crisp, searchable, selectable vector text with clickable hyperlink annotations.
3. **Markdown & Plain Text Serializer**:
   - Generate standard GitHub-flavored Markdown formatted with proper `#`, `##`, `*` lists, and bold metadata tags.
   - Provide one-click "Copy to Clipboard" with visual feedback and `.md` file download.
4. **Dimensions & Margins**:
   - A4: 210mm × 297mm.
   - US Letter: 215.9mm × 279.4mm (8.5in × 11in).
   - Dynamic page break guards (`break-inside-avoid`, `page-break-inside: avoid`) to prevent awkward line chops.
