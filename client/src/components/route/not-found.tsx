import { Link } from "@tanstack/react-router";

import { ArrowLeftIcon } from "lucide-react";

import { Button } from "../ui/button";

export function NotFoundComponent() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="text-8xl font-bold">404</div>
      <div className="flex flex-col gap-4">
        <div className="text-xl text-muted-foreground">page not found</div>
        <Button asChild>
          <Link to="/">
            <ArrowLeftIcon className="mr-2" /> Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
