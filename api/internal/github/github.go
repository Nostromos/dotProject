package github

import (
	"context"
	"fmt"
	"os"

	"github.com/google/go-github/v72/github"
)

func Authenticate() *github.Client {
	client := github.NewClient(nil).WithAuthToken(os.Getenv("LOCAL_GITHUB_PAT")) // #2 Add here

	return client
}

func GetReposByUser(
	client *github.Client, 
	ctx context.Context, 
	owner string, 
	repo string) ([]*github.Repository, error) {
		fmt.Println("Getting github repos for nostromos")
	repos, resp, err := client.Repositories.ListByUser(ctx, owner, &github.RepositoryListByUserOptions{
		Type:      "owner",
		Sort:      "Updated",
		Direction: "desc",
		ListOptions: github.ListOptions{
			PerPage: 3,
			Page:    1,
		},
	})
	fmt.Println(resp)
	if err != nil {
		fmt.Printf("Error getting repos for user: %v", err)
		return nil, err
	}

	return repos, nil
}
