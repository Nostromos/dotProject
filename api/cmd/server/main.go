package main

import (
	// --- Standard Lib ---
	"fmt"
	"net/http"
	"os"

	// --- Third-Party ---
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	// --- Internal ---
	"github.com/Nostromos/dotprojectv2/api/internal/handlers"
	"github.com/Nostromos/dotprojectv2/api/internal/cache"
	"github.com/Nostromos/dotprojectv2/api/internal/github"
)

const (
	PORT    = "8080"
	IP      = "127.0.0.1"
	ADDRESS = IP + ":" + PORT
)

func main() {
	client := github.Authenticate() 
	cache := cache.GetCache()
	handler := handlers.HandleRequests(client, cache)

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Get("/repos/{owner}/", handler)
	r.Get("/health", handlers.Health)

	fmt.Printf("--> API Listening on: %s", ADDRESS)

	err := http.ListenAndServe(ADDRESS, r)
	if err != nil {
		fmt.Printf("--> API Error: %s", err)
		os.Exit(1)
	}
}
