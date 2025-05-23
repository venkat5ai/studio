
"use client";

import React, { useState, useTransition, useEffect } from "react";
import MovieSearchForm from "@/components/MovieSearchForm";
import MovieRatingCard from "@/components/MovieRatingCard";
import { fetchMovieRatingsAction, type MovieRatings } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function MovieRatingsPageContent() {
  const [movieRatings, setMovieRatings] = useState<MovieRatings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleSearch = async (movieTitle: string) => {
    setError(null);
    setMovieRatings(null);

    startTransition(async () => {
      const result = await fetchMovieRatingsAction(movieTitle);
      if (result.error) {
        setError(result.error);
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else if (result.data) {
        setMovieRatings(result.data);
      }
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-8 px-4 bg-background">
      <header className="mb-10 text-center">
        <div className="flex items-center justify-center mb-2">
          <span className="text-5xl" role="img" aria-label="Clapper board">🎬</span>
          <h1 className="text-5xl font-bold mx-3 text-primary">My Movie Finder</h1>
          <span className="text-5xl" role="img" aria-label="Film projector">📽️</span>
        </div>
        <p className="text-lg text-muted-foreground">
          💃 Let's find a great movie 🕺
        </p>
      </header>

      <main className="w-full max-w-xl">
        <MovieSearchForm onSearch={handleSearch} isLoading={isPending} />

        {isPending && (
          <div className="mt-8 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        )}

        {error && !isPending && (
          <Alert variant="destructive" className="mt-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {movieRatings && !isPending && !error && (
          <div className="mt-8">
            <MovieRatingCard {...movieRatings} />
          </div>
        )}
      </main>
      <footer className="mt-auto pt-10 text-center text-sm text-muted-foreground">
        <p>
          &copy; {currentYear ? currentYear : 'Loading year...'} My Movie Finder. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
