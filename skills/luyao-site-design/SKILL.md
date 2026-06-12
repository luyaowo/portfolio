---
name: luyao-site-design
description: Use this skill when updating the visual design, typography, layout, navigation, list pages, article pages, or TOC behavior of the Luyao Portfolio site. This skill converts the repo's DESIGN.md into an execution workflow for making scoped, consistent frontend changes.
---

# Luyao Site Design

This skill is the implementation layer for the local site design system.

## Canonical Source

Always read these files first:

1. `/Users/fanluyao/portfolio/DESIGN.md`
2. `/Users/fanluyao/portfolio/skills/luyao-site-design/references/page-recipes.md`

`DESIGN.md` is the source of truth. This skill turns that document into an editing workflow.

## When To Use

Use this skill for any of the following:

- article typography changes
- navigation style changes
- homepage or list page visual cleanup
- TOC / heading navigation work
- surface, border, or shadow cleanup
- color and type hierarchy cleanup
- page width and spacing rhythm changes
- design consistency passes across multiple pages

Do not use this skill for backend logic, content writing, or data modeling unless the change directly affects visual presentation.

## Design Direction

Apply this hybrid without drifting:

- article reading feel: Quaily
- overall interface restraint and surface order: Notion
- TOC and document structure: Mintlify

Do not introduce additional design references unless the user explicitly changes the direction.

## Non-Negotiable Rules

1. Body text stays sans-serif.
2. Headings may use serif selectively.
3. Main text color must remain low-contrast ink, not deep blue-black.
4. Navigation must visually merge with the page background in its resting state.
5. Default surfaces do not carry obvious shadows.
6. List pages should feel like indexes, not marketing grids.
7. Article pages should optimize sustained reading, not visual novelty.

## Workflow

### 1. Inspect Before Editing

Identify which page type is being changed:

- global shell
- homepage
- list page
- article page
- TOC / side navigation

Then locate the owning file before proposing or applying style changes.

### 2. Map the Request to the Design System

Convert the request into one of these design concerns:

- typography
- color hierarchy
- spacing rhythm
- page width
- navigation state
- TOC clarity
- list density
- component restraint

Do not make unrelated aesthetic changes.

### 3. Change the Smallest Correct Layer

Prefer this order:

1. design token or shared layout rule
2. page-level layout rule
3. component-level override
4. content markup adjustment

Avoid patching multiple layers when one layer is sufficient.

### 4. Validate Against Page Recipes

After editing, check the relevant recipe in `references/page-recipes.md` and verify the page still matches the intended pattern.

### 5. Verify in Browser

For substantial visual changes:

- run the local site if needed
- open the affected page
- verify spacing, width, type hierarchy, and navigation behavior

### 6. Build Check

Run a production build after meaningful frontend edits.

## Editing Heuristics

### Typography

- Fix font role mistakes first
- Then adjust weight contrast
- Then adjust color contrast
- Only after that, tune size and spacing

### Color

- Prefer opacity and neutral-tone adjustments over introducing new hues
- Lower contrast before changing palette

### Lists

- Shrink image dominance before shrinking text
- Make title hierarchy clearer before adding decoration

### Articles

- Improve reading width and line rhythm before styling special blocks
- TOC should support reading, not compete with it

### Navigation

- Solve with background, border, blur, and reveal behavior
- Do not solve with permanent shadow

## Anti-Drift Checks

Stop and correct if a change causes any of these:

- serif paragraphs
- dark blue visual cast
- oversized cards
- strong shadow in default state
- article page looking like a product landing page
- list page looking like a portfolio tile wall
- TOC becoming a visually dominant sidebar

## Output Format For Design Work

When reporting completed work:

1. state which page type was adjusted
2. state which design concern was addressed
3. name the file changed
4. mention whether build verification passed

Keep the explanation short and concrete.
