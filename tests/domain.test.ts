import { describe, expect, it } from "vitest";
import {
  canAccessModule,
  canTransitionBookingStatus,
  canTransitionEventStatus,
  hasWindowConflict
} from "../packages/domain/src/index";

describe("rbac", () => {
  it("allows admin access to admin module", () => {
    expect(canAccessModule("admin", "admin_access")).toBe(true);
  });

  it("blocks management access to admin module", () => {
    expect(canAccessModule("management", "admin_access")).toBe(false);
  });

  it("allows technical support to events", () => {
    expect(canAccessModule("technical_support", "events")).toBe(true);
  });
});

describe("availability overlap", () => {
  it("detects overlapping windows", () => {
    expect(
      hasWindowConflict(
        { startAt: 100, endAt: 200 },
        { startAt: 150, endAt: 250 }
      ).overlaps
    ).toBe(true);
  });

  it("does not detect overlap for touching ranges", () => {
    expect(
      hasWindowConflict(
        { startAt: 100, endAt: 200 },
        { startAt: 200, endAt: 300 }
      ).overlaps
    ).toBe(false);
  });
});

describe("status transitions", () => {
  it("allows valid booking transitions", () => {
    expect(canTransitionBookingStatus("draft", "pending")).toBe(true);
    expect(canTransitionBookingStatus("confirmed", "completed")).toBe(true);
  });

  it("blocks invalid booking transitions", () => {
    expect(canTransitionBookingStatus("draft", "completed")).toBe(false);
  });

  it("allows valid event transitions", () => {
    expect(canTransitionEventStatus("open", "acknowledged")).toBe(true);
    expect(canTransitionEventStatus("in_progress", "resolved")).toBe(true);
  });

  it("blocks invalid event transitions", () => {
    expect(canTransitionEventStatus("resolved", "open")).toBe(false);
  });
});
