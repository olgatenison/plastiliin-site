import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <h1 className="text-4xl font-bold text-gray-900">{t("title")}</h1>
    </main>
  );
}
