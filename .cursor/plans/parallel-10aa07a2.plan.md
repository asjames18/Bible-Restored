<!-- 10aa07a2-c93c-4ea9-82b0-f48bbb9e2def 2ac8b007-5ebe-4ea2-ac49-77a9727980e8 -->
# Parallel View Roadmap (.md outline)

We’ll create `docs/Parallel_View_Roadmap.md` summarizing everything we can build next. It will be skimmable, grouped by feature areas, with links to key files (e.g., `frontend/src/components/ParallelView.tsx`).

## Sections to Include

### 1) Multi-Translation Support

- Add dynamic translation picker (compare 2–4 versions)
- Persist selected translations per user
- Allow column re-ordering and show/hide
- Planned files: `ParallelView.tsx`, `ParallelViewWrapper.tsx`, `store/bibleStore.ts`, `components/TranslationPicker.tsx`

### 2) Diff & Alignment

- Verse-level diff highlighting (changed words only)
- Word-level alignment view (toggle)
- Inline tooltips explaining differences
- Planned files: `lib/textDiff.ts`, `components/Verse.tsx`, `components/ParallelView.tsx`

### 3) Navigation & Sync

- Shared scrolling (keep verses aligned)
- Click on verse to focus both columns
- Keyboard: [, ] chapter; ; / ' verse navigation
- Next/Prev book/chapter controls in header
- Planned files: `ParallelView.tsx`, `components/TopBar.tsx`, `hooks/useSyncScroll.ts`

### 4) Layout & UX

- Mobile: stacked cards with quick switcher
- Desktop: resizable columns, remember width
- Compact vs expanded density
- Sticky headers per translation
- Planned files: `ParallelView.tsx`, `index.css`

### 5) Search & Cross-Ref

- Search inside parallel view (filter verses that match)
- Cross-references pane (Treasury-like links)
- Quick jump to verse
- Planned files: `routes/Search.tsx`, `components/ParallelView.tsx`, `lib/crossRefs.ts`

### 6) Study Aids

- Inline Strong’s/lexicon hover (already partially supported)
- Toggle translator notes `{}` per column
- Footnotes pane (per translation)
- Planned files: `lib/nameHighlighter.ts`, `components/Verse.tsx`, `components/SettingsPanel.tsx`

### 7) Sharing & Export

- Copy selected verses (both columns) with refs
- Share image (render selected passage)
- Export to Markdown/HTML/PDF
- Planned files: `lib/share.ts`, `components/ShareDialog.tsx`

### 8) Personalization

- Save favorite parallel sets
- Themes, font, spacing synced with reading view
- Per-translation toggles (red letters, name highlights)
- Planned files: `store/settingsStore.ts`, `components/Settings.tsx`

### 9) Performance & Offline

- Lazy-load chapters; stream JSON
- Cache per-translation book JSON (`/public/translations/*.json`)
- Preload next chapter in background
- Planned files: `lib/data.ts`, Service Worker, `vite.config.ts`

### 10) Accessibility

- Full keyboard navigation (skip links)
- High-contrast mode per column
- Screen reader labels for verse blocks
- Planned files: `index.css`, ARIA in `ParallelView.tsx`

### 11) Quality & Observability

- E2E tests (cypress) for sync & diff
- Unit tests for diff/align
- Metrics: load time, interaction latency
- Planned files: tests/**, `lib/textDiff.ts`

### 12) Nice-to-Haves

- 3–4 column compare presets (e.g., KJV, Restored, ESV, LXX)
- Side-by-side Hebrew/Greek with transliteration
- Interlinear (striped rows: word | lemma | gloss)

## Deliverable

- Create `docs/Parallel_View_Roadmap.md` capturing the above with short descriptions, checkboxes, and impacted files. No code changes yet.

### To-dos

- [ ] Create docs/Parallel_View_Roadmap.md with feature sections and impacted files
- [ ] Specify word/verse diff approach and API for diff utils
- [ ] Define synced scrolling strategy and hooks API
- [ ] Specify stacked mobile UI and column switcher
- [ ] Outline copy/share/export flows and formats