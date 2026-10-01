export const DESKTOP_BREAKPOINT = 900;

export const NAV_EVENTS = Object.freeze({
  TOGGLE: "TOGGLE",
  OPEN: "OPEN",
  CLOSE: "CLOSE",
  ESCAPE: "ESCAPE",
  NAVIGATE: "NAVIGATE",
  VIEWPORT_DESKTOP: "VIEWPORT_DESKTOP"
});

export function normalizeSection(hash, allowedSections, fallback = "") {
  const sections = Array.isArray(allowedSections) ? allowedSections : [];
  if (sections.length === 0) return "";
  const candidate = String(hash || "").replace(/^#/, "");
  return sections.includes(candidate)
    ? candidate
    : (sections.includes(fallback) ? fallback : sections[0]);
}

export function createNavigationState(hash, allowedSections) {
  return {
    isOpen: false,
    activeSection: normalizeSection(hash, allowedSections)
  };
}

export function navigationReducer(state, event) {
  const current = state ?? { isOpen: false, activeSection: "" };
  const nextEvent = event ?? {};

  switch (nextEvent.type) {
    case NAV_EVENTS.TOGGLE:
      return { ...current, isOpen: !current.isOpen };
    case NAV_EVENTS.OPEN:
      return current.isOpen ? current : { ...current, isOpen: true };
    case NAV_EVENTS.CLOSE:
    case NAV_EVENTS.ESCAPE:
    case NAV_EVENTS.VIEWPORT_DESKTOP:
      return current.isOpen ? { ...current, isOpen: false } : current;
    case NAV_EVENTS.NAVIGATE:
      return {
        ...current,
        isOpen: false,
        activeSection: nextEvent.section || current.activeSection
      };
    default:
      return current;
  }
}

export function isDesktopViewport(width, breakpoint = DESKTOP_BREAKPOINT) {
  const numericWidth = Number(width);
  if (!Number.isFinite(numericWidth)) return false;
  return numericWidth >= breakpoint;
}

export function nextFocusableIndex(currentIndex, direction, total) {
  const safeTotal = Math.max(0, Number(total) || 0);
  if (safeTotal === 0) return -1;

  const current = Number.isFinite(Number(currentIndex))
    ? Math.trunc(Number(currentIndex))
    : 0;

  if (direction === "backward") {
    return current <= 0 ? safeTotal - 1 : current - 1;
  }

  return current >= safeTotal - 1 ? 0 : current + 1;
}
