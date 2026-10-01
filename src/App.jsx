import { useEffect, useReducer, useRef } from "react";
import { navigationIds, navigationItems } from "./data/navigation.js";
import {
  NAV_EVENTS,
  createNavigationState,
  isDesktopViewport,
  navigationReducer,
  nextFocusableIndex
} from "./lib/navigationState.js";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

function Navigation() {
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const previousOpenRef = useRef(false);
  const [state, dispatch] = useReducer(
    navigationReducer,
    null,
    () => createNavigationState(window.location.hash, navigationIds)
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && state.isOpen) {
        event.preventDefault();
        dispatch({ type: NAV_EVENTS.ESCAPE });
        return;
      }

      if (event.key !== "Tab" || !state.isOpen || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (focusable.length === 0) return;

      const currentIndex = focusable.indexOf(document.activeElement);
      const direction = event.shiftKey ? "backward" : "forward";

      if (
        (direction === "forward" && currentIndex === focusable.length - 1) ||
        (direction === "backward" && currentIndex <= 0)
      ) {
        event.preventDefault();
        const nextIndex = nextFocusableIndex(currentIndex, direction, focusable.length);
        focusable[nextIndex]?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state.isOpen]);

  useEffect(() => {
    if (state.isOpen) {
      document.body.dataset.navLocked = "true";
      requestAnimationFrame(() => {
        panelRef.current?.querySelector("button")?.focus();
      });
    } else {
      delete document.body.dataset.navLocked;
      if (previousOpenRef.current) {
        triggerRef.current?.focus();
      }
    }

    previousOpenRef.current = state.isOpen;

    return () => {
      delete document.body.dataset.navLocked;
    };
  }, [state.isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (isDesktopViewport(window.innerWidth)) {
        dispatch({ type: NAV_EVENTS.VIEWPORT_DESKTOP });
      }
    };

    const handleHashChange = () => {
      const section = window.location.hash.replace(/^#/, "");
      if (navigationIds.includes(section)) {
        dispatch({ type: NAV_EVENTS.NAVIGATE, section });
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  function navigate(section) {
    dispatch({ type: NAV_EVENTS.NAVIGATE, section });
  }

  return (
    <header className="site-header">
      <div className="header-inner layout">
        <a className="brand" href="#overview" onClick={() => navigate("overview")}>
          <span className="brand-mark" aria-hidden="true">H</span>
          <span className="brand-copy">
            <strong>HINGE</strong>
            <small>Navigation state lab</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={state.activeSection === item.id ? "location" : undefined}
              onClick={() => navigate(item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          ref={triggerRef}
          className="menu-trigger"
          type="button"
          aria-expanded={state.isOpen}
          aria-controls="mobile-navigation"
          aria-label={state.isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => dispatch({ type: NAV_EVENTS.TOGGLE })}
        >
          <MenuIcon />
          <span>Menu</span>
        </button>
      </div>

      <div className="mobile-shell" data-open={state.isOpen ? "true" : "false"}>
        <button
          className="nav-backdrop"
          type="button"
          tabIndex={state.isOpen ? 0 : -1}
          aria-label="Close navigation menu"
          onClick={() => dispatch({ type: NAV_EVENTS.CLOSE })}
        />

        <nav
          ref={panelRef}
          id="mobile-navigation"
          className="mobile-panel"
          aria-label="Mobile navigation"
          aria-hidden={!state.isOpen}
        >
          <div className="mobile-panel-head">
            <span>Navigate</span>
            <button
              className="close-button"
              type="button"
              aria-label="Close navigation menu"
              onClick={() => dispatch({ type: NAV_EVENTS.CLOSE })}
            >
              <CloseIcon />
            </button>
          </div>

          <div className="mobile-links">
            {navigationItems.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                tabIndex={state.isOpen ? 0 : -1}
                aria-current={state.activeSection === item.id ? "location" : undefined}
                onClick={() => navigate(item.id)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.label}</strong>
                <ArrowIcon />
              </a>
            ))}
          </div>

          <p className="mobile-note">
            Focus stays inside this panel while open. Escape, backdrop click, link selection,
            or desktop resize closes it.
          </p>
        </nav>
      </div>
    </header>
  );
}

const principles = [
  {
    number: "01",
    title: "Semantic controls",
    copy: "The menu trigger and close affordances are real buttons with explicit expanded and controlled-state semantics."
  },
  {
    number: "02",
    title: "Deterministic state",
    copy: "Open, close, escape, navigation, and viewport transitions pass through one small reducer instead of scattered booleans."
  },
  {
    number: "03",
    title: "Keyboard containment",
    copy: "Focus enters the panel, wraps through interactive elements, and returns to the trigger when the menu closes."
  }
];

export default function App() {
  return (
    <div className="app-shell">
      <Navigation />

      <main id="main-content">
        <section id="overview" className="hero layout section-anchor">
          <p className="eyebrow">React · responsive UI · accessibility</p>
          <h1>A mobile menu is a state machine with a visual layer.</h1>
          <p className="hero-copy">
            HINGE rebuilds a basic hamburger-navigation exercise around predictable state,
            semantic controls, keyboard behavior, viewport transitions, and honest same-page links.
          </p>

          <div className="hero-actions">
            <a className="primary-action" href="#rules">
              Inspect the rules
              <ArrowIcon />
            </a>
            <span>Resize below 900px to exercise the mobile state.</span>
          </div>

          <div className="state-strip" aria-label="Navigation behavior summary">
            <div>
              <span>Desktop</span>
              <strong>Inline nav</strong>
            </div>
            <div>
              <span>Mobile</span>
              <strong>Modal drawer</strong>
            </div>
            <div>
              <span>Keyboard</span>
              <strong>Trapped + Escape</strong>
            </div>
            <div>
              <span>Links</span>
              <strong>Real anchors</strong>
            </div>
          </div>
        </section>

        <section id="rules" className="rules-section section-anchor">
          <div className="layout split-heading">
            <div>
              <p className="eyebrow">Interaction policy</p>
              <h2>Rules that are visible in code and observable in the UI.</h2>
            </div>
            <p>
              The original implementation coupled one boolean to CSS movement. HINGE separates
              behavioral rules from rendering so edge cases can be tested without a browser.
            </p>
          </div>

          <div className="layout principles">
            {principles.map((principle) => (
              <article key={principle.number}>
                <span>{principle.number}</span>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="access" className="access-section layout section-anchor">
          <div className="access-card">
            <p className="eyebrow">Accessibility contract</p>
            <h2>Opening the drawer changes more than its position.</h2>
            <div className="contract-grid">
              <div>
                <strong>Focus in</strong>
                <p>The close button receives focus after the drawer opens.</p>
              </div>
              <div>
                <strong>Focus loop</strong>
                <p>Tab and Shift+Tab wrap through drawer controls instead of escaping behind it.</p>
              </div>
              <div>
                <strong>Focus out</strong>
                <p>Closing returns focus to the original menu trigger.</p>
              </div>
              <div>
                <strong>Background</strong>
                <p>Page scrolling is locked while the mobile drawer is active.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="qa" className="qa-section layout section-anchor">
          <div>
            <p className="eyebrow">Quality gate</p>
            <h2>The small parts are the product.</h2>
          </div>
          <div className="qa-list">
            <p><span>State</span>Reducer-driven open, close, Escape, navigate, and desktop-sync events.</p>
            <p><span>Input</span>Pointer, keyboard, backdrop, hash navigation, and viewport resize.</p>
            <p><span>Motion</span>Transitions respect the user’s reduced-motion preference.</p>
            <p><span>Scope</span>No fake login, fake routes, analytics, auth, or backend behavior.</p>
          </div>
        </section>
      </main>

      <footer className="site-footer layout">
        <strong>HINGE</strong>
        <span>Accessible navigation state lab · static frontend demo</span>
      </footer>
    </div>
  );
}
