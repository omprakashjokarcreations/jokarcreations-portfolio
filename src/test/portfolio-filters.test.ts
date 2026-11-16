import { describe, expect, it } from "vitest";
import { DELIVERABLE_CATEGORIES, DESIGN_PROJECTS } from "@/data/portfolio";

describe("Graphic design deliverable filters", () => {
  it("has valid categories for all design projects", () => {
    const validIds = new Set(DELIVERABLE_CATEGORIES.map((c) => c.id));
    for (const project of DESIGN_PROJECTS) {
      expect(validIds.has(project.category)).toBe(true);
    }
  });

  it("includes expected deliverable filters like logo and letterhead", () => {
    const ids = DELIVERABLE_CATEGORIES.map((c) => c.id);
    expect(ids).toContain("logo");
    expect(ids).toContain("letterhead");
    expect(ids).toContain("visiting-card");
    expect(ids).toContain("brochure");
    expect(ids).toContain("poster");
    expect(ids).toContain("packaging");
    expect(ids).toContain("menu");
    expect(ids).toContain("signage");
  });

  it("categorizes logo and letterhead projects correctly", () => {
    const logos = DESIGN_PROJECTS.filter((p) => p.category === "logo");
    const letterheads = DESIGN_PROJECTS.filter((p) => p.category === "letterhead");

    expect(logos.length).toBeGreaterThan(0);
    expect(letterheads.length).toBeGreaterThan(0);
    expect(letterheads.some((p) => p.label.toLowerCase().includes("letter"))).toBe(true);
  });
});

