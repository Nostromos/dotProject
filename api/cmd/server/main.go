package main

import (
	// --- Standard Lib ---
	// "fmt"
	// "net"
	"net/http"
	// "os"

	// --- Third-Party ---

	// --- Internal ---
	// 	"github.com/Nostromos/dotprojectv2/api/internal/handlers"
	// 	"github.com/Nostromos/dotprojectv2/api/internal/cache"
	"github.com/Nostromos/dotprojectv2/api/internal/github" 
)




const (
	PORT    = "8080"
	IP      = "127.0.0.1"
	ADDRESS = IP + ":" + PORT
)

func main() {
	gh := github.Authenticate() // get a github client

	http.ListenAndServe(ADDRESS)
}
