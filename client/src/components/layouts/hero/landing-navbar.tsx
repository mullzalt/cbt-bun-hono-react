import { Link } from "@tanstack/react-router";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/dark-mode-toggle";

import { LanguageToggle } from "../language-toggle";

export function LandingNavbar() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8 flex h-14 max-w-screen-2xl items-center justify-between">
        <Button
          variant={"link"}
          size={"lg"}
          className="mr-4 font-semibold flex items-center space-x-2 lg:mr-6 hover:no-underline text-lg"
          asChild
        >
          <Link to="/">Twittor Academy</Link>
        </Button>
        <div className="flex gap-2 items-center justify-end">
          <LanguageToggle />
          <ModeToggle />
          <Button variant={"secondary"} asChild>
            <Link to="/sign-in">{t("auth.sign-in-button")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
