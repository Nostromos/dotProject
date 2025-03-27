# Rate Limiting

## Clarification Questions

*What kind of GitHub API requests are you making—REST, GraphQL, or both?*
Right now, only REST requests using Octokit.

*Is this being used in a CLI tool, backend service, or something else?*
CLI took to start but will be a backend service in the future. My thinking is to use Octokit's rate-limiting feature so I won't have to change much when I build the web service.

*Are requests made on behalf of one user or multiple users with different tokens?*
Right now, on behalf of one user. For the web service, multiple users with different tokens OR as a Github App, with its own auth and much higher limits.

*Is accuracy/timeliness more important, or is reducing API usage the main goal?*
I'll bias towards accuracy and timeliness first but I do plan on building some common-sense stuff to prevent unecessary API usage.


## Background Information

### Primary Rate Limits

Github limits the number of REST API requests you can make in a specific amount of time. Certain endpoints have more restrictive limits than others, like the search endpoint. The GraphQL API has a separate primary rate limit. 

Unauthenticated requests can only fetch public data.

Here's a high level overview: 
| Type of Consumer                             | Auth Type                 | Limit             |
| -------------------------------------------- | ------------------------- | ----------------- |
| Unauthenticated User                         | IP Address                | 60 / hr           |
| Authenticated User                           | Personal Access Token     | 5000 / hr         |
| Github Actions                               | `GITHUB_TOKEN`            | 1000 / hr         |
| Github Actions owned by Enterprise Cloud Org | `GITHUB_TOKEN`            | 15000 / hr / repo |
| Github App                                   | Installation Access Token | 5000 / hr         |
| GH App owned by Enterprise Cloud Org         | Installation Access Token | 15000 / hr        |


### Secondary Rate Limits

In addition to primary rate limits, secondary rate limits are also enforced if you do things like:
- Make more than 100 concurrent requests at one time, shared across the REST API and the GraphQL API.
- Make more than 900 points worth of requests to a single REST API endpoint per minute or 2000 points for the GraphQL API.
- Make too many requests per minute - No more than 90s of CPU time per 60s of real time is allowed and no more than 60s of CPU time may be for the GraphQL API
- Make too many requests that consume excessive compute resources in a short period of time
- Create too much content on Github in a short amount of time. No more than 80 content-generating requests per minute and no more than 500 content-generating requests per hour. There are lower content creation limits for certain endpoints. **This limit includes actions taken on the Github Web Interface** as well as via REST and GraphQL APIs.


#### Calculating points for the secondary rate limit

Some secondary rate limits are determined by the point values of requests. For GraphQL requests, these point values are separate from the point value calculations for the primary rate limit.

| Request                                            | Points |
| -------------------------------------------------- | ------ |
| GraphQL requests without mutations                 | 1      |
| GraphQL requests with mutations                    | 5      |
| Most REST API GET, HEAD, and OPTIONS requests      | 1      |
| Most REST API POST, PATCH, PUT, or DELETE requests | 5      |


### What happens if I exceed?

If primary rate limit is exceeded, requests will return a `403` or `429` response and `x-ratelimit-remaining` header will be `0`. A separate header, `x-ratelimit-reset`, specifies the time that the rate limit resets. 

If secondary rate limit is exceeded, requests will return a `403` or `429` AND an error message indicating that the secondary rate limit was exceeded. If the `retry-after` header is present, don't retry requests until that many seconds have elapsed. If the `x-ratelimit-remaining` header is `0`, don't retry requests until after the time, in UTC epoch seconds, specified by `x-ratelimit-reset`. 

If the request continues to fail due to secondary rate limiting, wait for an exponentially increasing amount of time between retries and throw an error after a specified number of retries. 


## Best Practices for using the REST API

1. Avoid polling - not super relevant to this use case yet.
2. Make authenticated requests - ✅
3. Avoid concurrent requests - 😬 I do this in batch processing but I doubt I'll have enough volume to cause issues. There will be a queue system. I wonder if they count concurrent requests per endpoint or if they only care about concurrent requests across all APIs. Also, now that I think about it, I don't know if `Promise.all()` is truly the right choice here or a superficial embellishment but we'll see.
4. Pause between mutative requests - There's no mutative requests yet but a future feature would be automatically submitting PRs with project info.
5. Handle Rate Limit Errors Appropriately - I plan to do this using Octokit's native rate-limiting and retry feature but I should probably build some rate limiting in on my side, possibly at the queue level so I don't lose requests and/or so I can message appropriately to users.
6. Follow Redirects - I hadn't thought about this. `TODO: Check if Octokit also handles redirects or if I need to build that in myself`
7. Do not manually parse URLs - I do not do this and will not do this.
8. Use conditional requests if appropriate - THIS IS USEFUL. 
   
  > Most endpoints return an etag header, and many endpoints return a last-modified header. You can use the values of these headers to make conditional GET requests. If the response has not changed, you will receive a 304 Not Modified response. Making a conditional request does not count against your primary rate limit if a 304 response is returned.
  > 
  > For example, if a previous request returned an `etag` header value of `644b5b0155e6404a9cc4bd9d8b1ae730`, you can use the `if-none-match` header in a future request:
  > `curl https://api.github.com/meta --include --header 'if-none-match: "644b5b0155e6404a9cc4bd9d8b1ae730"'`
  > 
  > For example, if a previous request returned a `last-modified` header value of `Wed, 25 Oct 2023 19:17:59 GMT`, you can use the `if-modified-since` header in a future request:
  > `curl https://api.github.com/repos/github/docs --include --header 'if-modified-since: Wed, 25 Oct 2023 19:17:59 GMT'`
  > Conditional requests for unsafe methods, such as POST, PUT, PATCH, and DELETE are not supported unless otherwise noted in the documentation for a specific endpoint.
9. Do not ignore errors - I need to build in better error handling. Proper typing should ensure that I'm not passing incorrect values to the API so shouldn't see too many `4xx` errors but I have zero handling for `5xx`, ie. server-side issues.


## Additional Techniques for getting more out of the API

Thanks to (Endor Labs)[https://endorlabs.com] and (Sebastian Cai)[https://www.linkedin.com/in/sebastian-cai/] for writing a (useful article)[[^3]] about how they get more out of the Github API. All of the info in this section comes from that article and is minimally paraphrased.


### Increase Page Size Limits

Most endpoints default to 30 records per page. Get more data by increasing the page size limit to the maximum, **usually 100**.


### Conditional Requests using `etag` header

All REST API endpoint requests return an `etag` header with a fingerprint of the response. In subsequent requests, you can provide this `etag` value in the `if-none-match` request header and if the resource has not changed, you will receive a 304 response and **no impact on your rate limit**.

Here's how Endor Labs does it:
> In practice, how you implement ETags into your infrastructure is up to you. In our case, we found that storing the ETag in the DB (along with some metadata to identify which ETag was last used for which request and repository) worked the best within our architecture.


### Multiple Github Accounts

Each paid Github account gives you more tokens for your rate limit. This requires token rotation logic but may work better for you depending on your use case.


### Incremental Ingestion

GH List APIs return the entire list of items! If you're requesting a list of commits for a repository and you have pagination logic, you're able to get the entire list. You might not want to pull that same data in subsequent runs so consider adding some incremental ingestion logic. 

Here are a few ways to accomplish that:
- Certain endpoints have a `since` option, which only returns results *after* the datetime value you pass with `since`. Using `since` in conjunction with `sort` and `direction` give you more options to get only the data you need and nothing extra, reducing the number of requests you make.
- Consider specifically requesting only the information you want/need - for example, the first query I make for a user is to get their entire list of public repositories. I have that list already, including when I made the request and identifying metadata for each repository. I also know which repositories have and have not been processed. If something goes wrong, I don't need to re-query for the list of repositories, instead I can query only the repositories that have not been processed or those repos with processing errors.
- Use git to get certain types of information instead of the Github API. For example, it might be faster to use git directly to get an entire history of commits instead of using the API!

### GraphQL

> Github also supports GraphQL queries, which has a separate rate limit pool than the API requests. You can find Github's GraphQL docs here and the GraphQL rate limit docs here. 
>
> GraphQL is great for certain use cases outside of reducing your rate limit usage. It can fetch information that is not available via the regular REST APIs, such as a tag's creation date, and do things that the regular API cannot, such as sorting tags. If you have use cases that would be better served by GraphQL, it would make sense to support GraphQL queries within your infrastructure to spread out your rate limit usage.
>
> On a side note, GraphQL queries are more difficult to generalize than REST API requests, and pagination on GraphQL is not as well supported.


## Distillation

- [ ] Set up logging for headers
- [ ] Set up monitoring on concurrent requests sent out in `processOneRepo` - does it cause problems?
- [ ] Explore Octokit rate limiting and ensure that it
  - [ ] Handles rate limit errors appropriately and backs off
    - [ ] What does this mean for a growing queue? Does it exponentially back off and retry? Does it hold its own queue of requests that hit a rate limit?
  - [ ] Handles redirects
    - [ ] Does it automatically redirect?
    - [ ] Does it surface the redirect to me somehow? 
  - [ ] Handles conditional requests
    - [ ] This is an easy way to play nice with the API. Does Octokit do this automatically or with a little effort? Do I need to provide a cache to reference in the event nothing has changed?
- [ ] Set up error handling
  - [ ] How does Octokit handle errors? Does it merely surface them?
  - [ ] Is there error handling middleware I can add to octokit so I don't need to add it to every helper?
- [ ] Explore building a cache
- [ ] Increase page size limits from default (30) to maximum (usually 100)[^3]
- [ ] Explore conditional requests using `etag`, `last-modified`, `if-none-match`, and `if-modified-since` to ensure we're not requesting data we already have

[^1]: (Rate Limits for the REST API - Github)[https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28]
[^2]: (Best practices for using the REST API - Github)[https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api?apiVersion=2022-11-28]
[^3]: (How to Get the Most out of GitHub API Rate Limits)[https://www.endorlabs.com/learn/how-to-get-the-most-out-of-github-api-rate-limits]