const THEME_KEY = "traking_theme";

export type Theme = "light" | "dark";

function getStoredTheme(): Theme | null {
  const value = localStorage.getItem(THEME_KEY);
  return value === "light" || value === "dark" ? value : null;
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function initTheme(): void {
  const theme = getStoredTheme() ?? getSystemTheme();
  document.documentElement.setAttribute("data-theme", theme);
}

export function getCurrentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}
