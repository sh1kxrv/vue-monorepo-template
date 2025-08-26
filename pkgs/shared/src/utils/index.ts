export * from "./middleware";

export function createFormatter() {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 2,
  });
}

export function createDateFormatter(options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("ru-RU", options);
}

export const capitalize = (s: string) =>
  s && String(s[0]).toUpperCase() + String(s).slice(1);
