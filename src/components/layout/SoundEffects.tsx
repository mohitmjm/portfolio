import { useEffect } from "react";

import { playUiSound, type SoundKind } from "@/lib/sound";

const INTERACTIVE_SELECTOR = [
  "button",
  "a[href]",
  "input",
  "textarea",
  "select",
  "summary",
  '[role="button"]',
  '[role="tab"]',
  '[role="menuitem"]',
  "[data-sound]",
].join(",");

const SOUND_KINDS = new Set<SoundKind>(["tap", "nav", "action", "toggle", "success", "error", "focus"]);

function isSoundKind(value: string | undefined): value is SoundKind {
  return Boolean(value && SOUND_KINDS.has(value as SoundKind));
}

function isDisabled(el: HTMLElement) {
  return el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true";
}

function resolveSoundKind(el: HTMLElement): SoundKind {
  const explicit = el.dataset.sound;
  if (isSoundKind(explicit)) return explicit;

  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute("role");
  const href = el.getAttribute("href") ?? "";
  const label = `${el.getAttribute("aria-label") ?? ""} ${el.textContent ?? ""}`.toLowerCase();

  if (role === "tab" || (tag === "a" && (href.startsWith("#") || Boolean(el.closest("nav"))))) {
    return "nav";
  }

  if (tag === "input" || tag === "textarea" || tag === "select") {
    return "focus";
  }

  if (/delete|trash|clear|error|analyze|dismiss|close/.test(label)) {
    return "error";
  }

  if (/run|download|resume|compiler|send|submit|apply|live|github|report|copy|contact/.test(label)) {
    return "action";
  }

  if (/theme|mode|toggle|menu|open|back/.test(label)) {
    return "toggle";
  }

  return "tap";
}

function interactiveFromTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  const el = target.closest(INTERACTIVE_SELECTOR) as HTMLElement | null;
  if (!el || el.closest('[data-sound="off"], [data-sound-control]') || isDisabled(el)) return null;
  return el;
}

export function SoundEffects() {
  useEffect(() => {
    let lastPlayedAt = 0;

    const playForElement = (el: HTMLElement) => {
      const now = performance.now();
      if (now - lastPlayedAt < 45) return;
      lastPlayedAt = now;
      playUiSound(resolveSoundKind(el));
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const el = interactiveFromTarget(event.target);
      if (el) playForElement(el);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
      const el = interactiveFromTarget(document.activeElement);
      if (!el || ["input", "textarea", "select"].includes(el.tagName.toLowerCase())) return;
      playForElement(el);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  return null;
}
