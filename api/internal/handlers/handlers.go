package handlers

import (
	// --- Standard Lib ---
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	// --- Third Party ---
	"github.com/go-chi/chi/v5"
	gogithub "github.com/google/go-github/v72/github"
	gocache "github.com/patrickmn/go-cache"

	// --- Internal ---
	"github.com/Nostromos/dotprojectv2/api/internal/github"
)

func HandleRequests(client *gogithub.Client, cache *gocache.Cache) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
		defer cancel()

		owner := chi.URLParam(r, "owner")
		repo := chi.URLParam(r, "repo")

		if owner == "" || repo == "" {
			writeError(w, http.StatusBadRequest, fmt.Errorf("missing owner or repo"))
			return
		}

		// TODO: Check cache here

		info, err := github.GetReposByUser(client, ctx)
		if err != nil {
			writeError(w, 502, err)
			return
		}

		writeJSON(w, http.StatusOK, info)
	}
}

func Health(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ok"))
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(payload); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

type errResp struct {
	Error string `json:"error"`
}

func writeError(w http.ResponseWriter, status int, err error) {
	writeJSON(w, status, errResp{Error: err.Error()})
}
