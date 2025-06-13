package github

import (
	"context"
	"fmt"

	"github.com/google/go-github/v72/github"
)

func Authenticate() *github.Client {
	client := github.NewClient(nil) // #2 Add here

	return client
}

func GetReposByUser(client *github.Client, ctx context.Context, owner string, repo string) ([]*github.Repository, error) {
	repos, _, err := client.Repositories.ListByUser(context.Background(), owner, &github.RepositoryListByUserOptions{
		Type:      "owner",
		Sort:      "Updated",
		Direction: "desc",
		ListOptions: github.ListOptions{
			PerPage: 100,
			Page:    1,
		},
	})
	if err != nil {
		fmt.Printf("Error getting repos for user: %v", err)
		return nil, err
	}

	return repos, nil
}
