# ONYX PLUS GROUP: design record

## Phase 0: Brief

- **Subject.** ONYX PLUS GROUP, an Ivorian diversified group with three divisions: Agro-Industry
  (cashew processing, flagship, plant project in Zuénoula), Energy & Infrastructure (MV/LV
  equipment, transformers, switchgear, cables), Travel & Tourism (ticketing, hotels, business
  travel, trade-fair trips).
- **Audience.** Investors, industrial partners, suppliers and manufacturers, international
  cashew buyers, utilities and institutions, business travellers.
- **Job.** Read as a serious, structured, international group within 3 seconds, then route each
  audience to its division and to a partnership conversation.
- **Language.** French by default (`/`), complete English (`/en/`).
- **Assets.** Supplied logo and nine photographs (team in a kernel store, sorting line, raw nut
  warehouse, SIAT 2026 forum, trade fair). Free Unsplash photos for the cashew apple, tree and
  kernels. Everything else is drawn in SVG for this site (cashew, grade scale, single-line
  diagram, routes).
- **Assumptions (to confirm with the client).** Domain `onyxplusgroup.com`; email
  `contact@onyxplusgroup.com`; phone and address unknown; Zuénoula plant capacity and timeline
  not published; the plant is presented as a project in development.

## Phase 1: Concept

| | Idea | Anchor | Signature | O / F / Fe / P |
|---|---|---|---|---|
| A. Formal: the board | Each trade speaks a code (W240, HTA, ABJ); the site is a split-flap board | three real code systems | flaps flip into each division's codes | 4 / 4 / 4 / 2 |
| B. Name: strata | Onyx is banded stone; each division is a layer in a polished cross-section | the name | bands part to reveal divisions | 4 / 3 / 3 / 3 |
| C. Process: the plus | ONYX+ is what each step adds: one cashew goes from the tree to the export carton, and every step is a "+" | the flagship cashew value chain and the "+" in the logo | one drawn cashew transforms as you scroll: apple, raw nut, shell opens, skin peels, grades, carton | 5 / 5 / 4 / 1 |

**Pick C**, with A's flap codes as the labelling system. It is the brief's own promise
("Creating value") made visible, it is about the flagship business, and the "+" comes from the
logo. Steal from A: the trade codes on flap labels, which give each division its identity
everywhere (hero board, division heroes, 404).

```
Idea:        One cashew, from tree to export carton: every step adds value, and that is the + in ONYX+.
Metaphor:    a value chain read as an addition, labelled like a trading board.
Signature:   the home "chain": a drawn cashew pinned beside the copy changes form at each step
             (apple, raw nut, shelling, peeling, grading W180 to W450, packing), scrubbed by scroll.
Emotion:     solid and assured, then curious: "this group knows its product down to the kernel".
Motion verb: flip and settle (a flap falling into place; things turn on a horizontal axis and lock).
Screenshot:  the ivory kernel on onyx, its W240 flap label just settled, "+ calibrage" beside it.
```

## Phase 2: System

**Palette** (from the logo's navy and blue, and from the product itself)

| Role | Hex | Source |
|---|---|---|
| ground | `#EEF0F2` | cool paper, the white of the supplied plant interiors |
| ink (onyx) | `#0A1020` | the logo's deepest navy, almost black |
| muted | `#4A5366` | 7.3:1 on ground |
| line | `rgb(10 16 32 / 0.14)` | hairlines |
| accent (ONYX blue) | `#2759D6` | the logo's bright blue: focus, links, the "+" |
| curtain | `#0A1020` | |
| field: agro "amande" | `#E8D3A6` | cashew kernel ivory |
| field: energy "tension" | `#F2B134` | safety amber on MV equipment |
| field: travel "lagune" | `#3AA79E` | the Ébrié lagoon |

The chain section runs on onyx, so the ivory kernel glows; the rest of the site is paper.
Each division page takes its field color as a hero ground, with onyx ink.

**Type.** Archivo (variable width 62 to 125, weight 100 to 900) for everything: expanded and
bold for display (it echoes the wide "GROUP" of the logo), normal width for text. Martian Mono
400 for codes, flap labels and figures. Display tracking -0.03 to -0.045em, leading 0.9.

**Grid.** 12 columns, fluid gutter. Three hanging lines: col 1 (titles), col 5 (text), col 9
(meta). Rhythm moods: tight (8u), normal (16u), airy (28u), full viewport.

**Shape.** Square everywhere. Only flap cells are rounded (3px), because they are objects.

**Motion.** Engine eases (expo). Flip: rotateX on a split cell, 0.22 s per half, staggered 40 ms
per character. Reveals: line masks. Transition: a flap closes (two panels meet on a hairline
from top and bottom), then opens on the new page.

**Hover treatments (one per role).** CTAs: an onyx fill rises from the bottom edge like a flap
dropping, label rolls up. Nav: letter roll. Division and project links: the flap code flips to
its next value and the arrow travels. Images: scale inside a clipped frame. Utility links:
underline.

**Idle state.** The flap labels on screen keep cycling through their trade's codes every few
seconds (paused off screen, off under reduced motion, with a pause button on the hero board).
The cashew sways slightly with the pointer.

**Composition plan (home)**

```
1 CHAIN (sticky stage, full viewport x 7)
  [h1 Bâtir des opportunités. Créer de la valeur.]      [ cashew stage  ]
  [lead + 2 CTAs]                                       [ (sticky)      ]
  [board: 01 AGRO W240 | 02 ÉNERGIE HTA | 03 VOYAGES ABJ]
  steps 1..6 scroll on the left, the cashew changes on the right
2 STATEMENT  group intro set large over 9 cols, SIAT photo hung at col 10
3 DIVISIONS  three field-colored asymmetric pairs, alternating sides
4 PROJECT    full-bleed sorting-line photo, Zuénoula facts on an onyx scrim
5 FIELD      gallery wall of team photos with captions, deliberate empty cells
6 PARTNERS   index list: investors, buyers, manufacturers, travellers
7 FOOTER     giant ONYX+ wordmark, contact, nav, legal
```

**Genericness test.** A generic model lands on: navy corporate hero over a stock skyline, three
equal division cards, "about us" with icons. Changed: the hero is the product (a drawn cashew,
not a skyline); divisions are field-colored pairs with their own figure each (grade scale,
single-line diagram, route board), never three cards; figures come from real trade codes.

**Explainer figure.** The cashew chain is the site's explainer. The energy page has a
single-line diagram drawn in SVG; the agro page a W180 to W450 grade scale drawn to true
proportion (kernel size follows mass per kernel, 453.6 g divided by the grade number).

## Revisions after client feedback

- **The cashew is 3D, not flat art.** The client found the SVG cashew cartoonish and pointed to
  photoreal product pages. The chain now renders a modelled cashew in three.js
  (`src/motion/cashew3d.ts`): swept kernel and shell geometry with capsule ends and a seam,
  physical materials (waxy ivory kernel, brown testa that peels off through a noise threshold,
  rough shell with a dark honeycomb interior, glossy cashew apple with vertex-colour blush),
  studio environment light and a key light tinted per step. The SVG stays as the designed
  still for reduced motion and no-WebGL.
- **Story around the object.** After the hero, the object sits in the centre of a full-width
  stage; chapter copy alternates left and right; small mono annotations with leader lines
  point at the part being discussed (apple, shell halves, testa, grade, bag).
- **Packing in vacuum bags, not cartons**, matching the client's own photos (clear vacuum
  bricks of kernels on pallets). The bag fills kernel by kernel, pulls tight, and a pallet of
  finished bags rises behind it at the close.
- **No branch or leaves.** Tried, removed at the client's request (read as unreal).
- **Performance.** On phones the GL background shader is replaced by a static gradient, the
  3D renders at 1.25x DPR with lighter geometry, and the idle sway renders every other frame.
- **Still pages.** Inner pages keep motion in their hovers, flap codes and drawn figures; the
  Group page has no idle motion on its first screen by decision (a quiet, institutional page).
