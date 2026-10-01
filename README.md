# HINGE — Accessible Navigation State Lab

HINGE modernizes a 2023 React hamburger-navbar exercise into a focused responsive-navigation engineering demo.

The original repository had a visually working mobile menu, but the implementation was driven by one boolean and CSS movement. It also included clickable SVG icons instead of buttons, no ARIA state, no Escape handling, no focus management, no scroll locking, mostly fake routes, an unused router setup, Create React App boilerplate, and a 3 MB background image for a navigation demo.

## Engineering focus

HINGE treats responsive navigation as a small state machine with an accessibility contract:

- semantic menu and close buttons
- explicit `aria-expanded` / `aria-controls`
- mobile drawer focus entry and focus return
- Tab / Shift+Tab focus containment
- Escape-to-close
- backdrop-to-close
- close-on-navigation
- close-on-desktop-resize
- background scroll locking
- real same-page anchors instead of fake routes
- reducer-driven state transitions
- testable viewport and focus-wrap policies

## Architecture

```text
src/data/navigation.js
        │
        ▼
src/lib/navigationState.js
        ├─ hash normalization
        ├─ initial state
        ├─ reducer events
        ├─ desktop breakpoint policy
        └─ focus wrap calculation
        │
        ▼
src/App.jsx
        ├─ semantic navigation markup
        ├─ focus lifecycle
        ├─ Escape / Tab keyboard handling
        ├─ viewport synchronization
        └─ hash navigation
        │
        ▼
Responsive static frontend
```

## State model

The reducer accepts these events:

- `TOGGLE`
- `OPEN`
- `CLOSE`
- `ESCAPE`
- `NAVIGATE`
- `VIEWPORT_DESKTOP`

This keeps behavior explicit and removes scattered menu-state mutations.

## Accessibility contract

When the mobile menu opens:

1. background scrolling is locked
2. focus moves into the drawer
3. Tab and Shift+Tab remain inside the drawer

When it closes:

1. the drawer leaves the interaction path
2. scroll locking is removed
3. focus returns to the menu trigger

The menu also closes on Escape, backdrop activation, navigation, and switching to desktop width.

## What changed

### Tooling

- Create React App → Vite
- React 18 → React 19
- removed React Router because the demo has no multi-page routing requirement
- removed React Icons by using tiny inline SVGs
- removed CRA testing boilerplate and Web Vitals

### UX / content

- replaced fake HOME / ABOUT / PRODUCT / CONTACT / BLOG / LOG IN routes
- added real same-page sections
- added visible active-location state
- added honest scope text
- added responsive layout and reduced-motion handling

### Performance cleanup

The original `src/image/back.png` was approximately 3.08 MB and only served as a decorative full-screen background. It was removed together with unused CRA public assets and the old CRA lockfile.

HINGE now uses CSS-only presentation and has no image payload.

## Local development

Requirements:

- Node.js 22+
- npm

```bash
npm install --legacy-peer-deps --no-audit --no-fund
npm run dev
```

The install flag avoids the npm 10 Arborist resolver crash currently observable on GitHub-hosted Node 22 runners. It is a package-manager workaround, not an application runtime requirement.

## Tests

```bash
npm test
```

The Vitest suite covers:

- valid hash normalization
- invalid hash recovery
- empty navigation models
- initial state creation
- toggle behavior
- explicit open behavior
- Escape close
- desktop viewport close
- navigate-and-close behavior
- breakpoint boundary detection
- invalid viewport input
- forward focus wrapping
- backward focus wrapping
- zero-focusable-element handling

## Quality gate

```bash
npm run check
```

Runs syntax checks, all tests, and a Vite production build.

## CI

`.github/workflows/quality.yml` runs the quality gate on pull requests and pushes to `main`.

## Deployment

HINGE is a static frontend and includes a manual GitHub Pages workflow.

1. Open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Open **Actions → Deploy Pages**.
4. Run the workflow.

## Security review

No API keys, tokens, passwords, credentials, backend endpoints, user HTML injection, auth assumptions, payment behavior, or sensitive browser storage are required.

## Scope and limitations

HINGE intentionally does not implement:

- authentication
- multi-page routing
- server-side navigation state
- analytics
- remote content
- user accounts

The goal is trustworthy responsive navigation behavior, not feature volume.

## License

MIT. See [LICENSE](./LICENSE).
