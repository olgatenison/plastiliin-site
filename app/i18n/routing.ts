import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "et", "ru", "uk"],
  defaultLocale: "en",
  localePrefix: "always",
});
