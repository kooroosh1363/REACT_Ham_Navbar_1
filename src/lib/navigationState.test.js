import { describe, expect, it } from "vitest";
import {
  NAV_EVENTS,
  createNavigationState,
  isDesktopViewport,
  navigationReducer,
  nextFocusableIndex,
  normalizeSection
} from "./navigationState.js";

const sections = ["overview", "rules", "access", "qa"];

describe("navigation state policy", () => {
  it("normalizes a known hash", () => {
    expect(normalizeSection("#access", sections)).toBe("access");
  });

  it("recovers an unknown hash to the first section", () => {
    expect(normalizeSection("#missing", sections)).toBe("overview");
  });

  it("returns an empty section for an empty navigation model", () => {
    expect(normalizeSection("#overview", [])).toBe("");
  });

  it("starts closed with normalized location state", () => {
    expect(createNavigationState("#rules", sections)).toEqual({
      isOpen: false,
      activeSection: "rules"
    });
  });

  it("toggles the mobile menu", () => {
    const state = { isOpen: false, activeSection: "overview" };
    expect(navigationReducer(state, { type: NAV_EVENTS.TOGGLE }).isOpen).toBe(true);
  });

  it("opens explicitly", () => {
    const state = { isOpen: false, activeSection: "overview" };
    expect(navigationReducer(state, { type: NAV_EVENTS.OPEN }).isOpen).toBe(true);
  });

  it("closes on escape", () => {
    const state = { isOpen: true, activeSection: "overview" };
    expect(navigationReducer(state, { type: NAV_EVENTS.ESCAPE }).isOpen).toBe(false);
  });

  it("closes when switching to desktop", () => {
    const state = { isOpen: true, activeSection: "overview" };
    expect(navigationReducer(state, { type: NAV_EVENTS.VIEWPORT_DESKTOP }).isOpen).toBe(false);
  });

  it("closes and updates the active section on navigation", () => {
    const state = { isOpen: true, activeSection: "overview" };
    expect(navigationReducer(state, {
      type: NAV_EVENTS.NAVIGATE,
      section: "qa"
    })).toEqual({
      isOpen: false,
      activeSection: "qa"
    });
  });

  it("detects desktop viewport boundaries", () => {
    expect(isDesktopViewport(899)).toBe(false);
    expect(isDesktopViewport(900)).toBe(true);
  });

  it("does not classify invalid viewport values as desktop", () => {
    expect(isDesktopViewport("bad")).toBe(false);
  });

  it("wraps focus forward", () => {
    expect(nextFocusableIndex(3, "forward", 4)).toBe(0);
  });

  it("wraps focus backward", () => {
    expect(nextFocusableIndex(0, "backward", 4)).toBe(3);
  });

  it("returns -1 when no focusable items exist", () => {
    expect(nextFocusableIndex(0, "forward", 0)).toBe(-1);
  });
});
