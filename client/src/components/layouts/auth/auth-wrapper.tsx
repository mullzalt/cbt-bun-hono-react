import * as React from "react";
import { Link } from "@tanstack/react-router";

import { ChevronLeftIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/dark-mode-toggle";
import { Icons } from "@/components/ui/icons";

import { LanguageToggle } from "../language-toggle";

function AuthImage() {
  return (
    <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div className="absolute inset-0 bg-zinc-900" />
      <div className="relative z-20 flex items-center text-lg font-medium">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-6 w-6"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        Twittor Academy
      </div>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2">
          <p className="text-lg">&ldquo;Some quote.&rdquo;</p>
          <footer className="text-sm">quoter</footer>
        </blockquote>
      </div>
    </div>
  );
}

export function AuthFormWrapper({
  children,
  title,
  description,
  orLabel,
}: {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  orLabel?: string;
}) {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <div className="absolute right-0 top-0 w-full lg:w-1/2 p-4 lg:p-8">
        <div className="flex justify-between lg:justify-end  items-center gap-2">
          <Button
            variant={"ghost"}
            asChild
            size={"icon"}
            className="inline-flex lg:hidden"
          >
            <Link to="/">
              <ChevronLeftIcon className="size-8" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ModeToggle />
            <Button asChild variant={"ghost"}>
              <Link href="/examples/authentication">
                {t("auth.sign-up-button")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2 text-center">
        <div className="flex items-center gap-2 justify-center">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {children}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {orLabel}
          </span>
        </div>
      </div>

      <GoogleAuthButton />
    </React.Fragment>
  );
}

export function GoogleAuthButton() {
  return (
    <Button variant="outline" type="button" asChild>
      <a href="api/auth/sign-in/google">
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </a>
    </Button>
  );
}

export function AuthPage({ children }: { children?: React.ReactNode }) {
  return (
    <div className=" relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <AuthImage />

      <div className="mx-auto h-full container px-4 flex flex-col justify-center space-y-6 sm:w-[450px]">
        {children}
      </div>
    </div>
  );
}
