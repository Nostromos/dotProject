package cache

import (
	// --- Standard Lib ---
	// "fmt"
	"fmt"
	"time"

	// --- Third Party ---
	gocache "github.com/patrickmn/go-cache"
)

func GetCache() (*gocache.Cache) {
	const (
		defaultExpiration = 5*time.Minute
		cleanupInterval = 10*time.Minute
	)

	cache := gocache.New(defaultExpiration, cleanupInterval)

	fmt.Printf("New Cache Size: %v", cache.ItemCount())

	return cache
}