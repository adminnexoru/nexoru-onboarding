import { afterEach, describe, expect, it } from "vitest";
import { resolveAppHost } from "./urls";

const ORIGINAL_APP_URL = process.env.NEXT_PUBLIC_APP_URL;

afterEach(() => {
  if (ORIGINAL_APP_URL === undefined) {
    delete process.env.NEXT_PUBLIC_APP_URL;
  } else {
    process.env.NEXT_PUBLIC_APP_URL = ORIGINAL_APP_URL;
  }
});

describe("resolveAppHost", () => {
  it("falls back to app.nexoru.ai when NEXT_PUBLIC_APP_URL is unset", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;

    expect(resolveAppHost()).toBe("app.nexoru.ai");
  });

  it("derives the host from a well-formed NEXT_PUBLIC_APP_URL", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://preview-123.vercel.app";

    expect(resolveAppHost()).toBe("preview-123.vercel.app");
  });

  it("falls back instead of throwing when NEXT_PUBLIC_APP_URL is malformed", () => {
    process.env.NEXT_PUBLIC_APP_URL = "not a valid url";

    expect(() => resolveAppHost()).not.toThrow();
    expect(resolveAppHost()).toBe("app.nexoru.ai");
  });

  it("honors a custom fallback when provided", () => {
    process.env.NEXT_PUBLIC_APP_URL = "not a valid url";

    expect(resolveAppHost("custom.fallback")).toBe("custom.fallback");
  });
});
