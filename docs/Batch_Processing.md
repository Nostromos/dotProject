# Batch Processing

Handling multiple tasks at once instead of one at a time. 

*Why is this important?* 
Rate limiting on GH can impact ability to get all the repos needed at once. I can get some of them and process those while I'm waiting for the rate limit to reset. 

## Initial Thoughts

Some questions:

### Do I really need to do batch processing right now?
Probably not tbh. The CLI app will run on user's computer and presumably will use their own API key. Rate limiting will handle issues with that. 

The web app might need it, but there'll be a different auth mechanism, with higher rates. I think I need to do some testing to see how it handles larger numbers of repos, like 1000 at once. The issue with 1000 repos is that there's no way you'd want to use that many in your portfolio, or at least I imagine the average user would not. 

**However,** it would be cool to show that I *can* handle multiple API calls, batch processing, and rate limiting.

### What needs to be batched?

Well I need to get all public repositories, then make at least 3 API calls **per** repo to get things like health metrics, language data, and (in the future) to analyze files like `project.json`, `go.mod`, etc. for library/framework information. 

Then we have the actual data manipulation, file creation, and potentially auto-PRs for each repo to gather that info. 

To go higher level, what even defines a batch for this? 

Is it a batch of user repos? A batch of API calls for each repo? How deep should I think about the hierarchy of batches before I've overcomplicated things? I've probably already done that, so let's start simple, I'll measure/monitor performance, and we'll adjust from there.

**Batches**:
- API calls needed to complete a user's request for either all their repos or the ones they select
- Processing each of those repos to ensure I have an enriched set of data useful to the user.

### Batch Size & Strategy

Some interesting questions:

*Will you process a fixed number of items per batch (e.g., 10 repos at a time)?*

Unauthenticated requests are 60 / hour for public resources only.
Authenticated requests with PAT are 5,000 / hour.
GH Apps not owned by a Github Enterprise Cloud org have a limit of 5,000 / hour.
GH Apps owned by a Github Enterprise Cloud org have a limit of 15,000 / hour.

Then there are secondary rate limits:

> In addition to primary rate limits, GitHub enforces secondary rate limits in order to prevent abuse and keep the API available for all users.
>
> You may encounter a secondary rate limit if you:
>
> - Make too many concurrent requests. No more than 100 concurrent requests are allowed. This limit is shared across the REST API and GraphQL API.
> - Make too many requests to a single endpoint per minute. No more than 900 points per minute are allowed for REST API endpoints, and no more than 2,000 points per minute are allowed for the GraphQL API endpoint. For more information about points, see Calculating points for the secondary rate limit.
> - Make too many requests per minute. No more than 90 seconds of CPU time per 60 seconds of real time is allowed. No more than 60 seconds of this CPU time may be for the GraphQL API. You can roughly estimate the CPU time by measuring the total response time for your API requests.
> - Make too many requests that consume excessive compute resources in a short period of time.
> - Create too much content on GitHub in a short amount of time. In general, no more than 80 content-generating requests per minute and no more than 500 content-generating requests per hour are allowed. Some endpoints have lower content creation limits. Content creation limits include actions taken on the GitHub web interface as well as via the REST API and GraphQL API.
>
>These secondary rate limits are subject to change without notice. You may also encounter a secondary rate limit for undisclosed reasons.

*Will you process all available items in chunks of N?*

I doubt that I'll hit 5k rph (requests per hour) but I'll probably check for pagination and if it hits, I'll process those repos already received. When that's complete, I'll request the next page of results.

*Will you have a dynamic batch size based on system performance or queue backlog?*

Great question. I doubt it. I think if system performance or backlog becomes an issue, I'll need to rewrite more than just batch processing.

### Parallel or Sequential Execution

*Can these batches run concurrently (e.g., using worker threads, async tasks)?*

I've been learning more about concurrency with golang so I'm keen to see how JS performs. 

My only options locally are callbacks, async/await, and promises. For the web, I know I can use worker threads. 

*Should they be processed in sequence to avoid rate limits or system overload?*

Per the exposition in batch size & strategy, should probably do sequentially. A side issue is - what happens if processing is interrupted due to network problems, system issues, a user cancels the processing, etc.? 

For now, I think it's safe to lose everything and the user will have to start over. Adding a DB will make this much easier - I can save progress as the user progresses.

Which brings us to our next concern...

### Error Handling & Retry Strategy

*What happens if one batch fails?*

Probably need some way of retrying a specific batch. Alternately, can move on to the next batch and come back to that original batch. 

Simplest: Retry that batch again if the error is network-related and if it doesn't work 3x times, skip it and try again later.

*Should you retry failed items immediately, or move them to a retry queue?*

Retry again immediately.

### Logging & Monitoring

*How do you track progress?*

Github API responses contain a `content-length` header that (I assume) tells me how large (in kb) the response is. I can use this to gauge progress. A simpler way is counting the total number of fetched repositories, processing each in turn, and using `successfully processed repos / total repos` as the progress gauge. 

*Will you log success/failure per batch?*

Yes. I will log all of it. How? Not sure yet. 

## Live Thoughts

Honestly, it would be simpler to keep this single-threaded but I think learning more about Node is really useful. 

### Concurrency vs Parallelism

*Concurrency is about dealing with lots of things at once. Parallelism is about doing lots of things at once. — Rob Pike*

After a shallow dive, my understanding is that:
- Concurrency comes into play when you notice that a single thread is spending time waiting and blocking other operations
- Parallelism comes into play when you have CPU-intensive tasks that can happen in parallel across multiple threads. 

Technically, you can use both concurrency and parallelism at the same time but since I'm already going beyond for this, I'll stick to parallelism. 

For example...

I have a single-core machine, a list of number, and two tasks- task 1 is `Add` and task 2 is `getNextNumberFromWeb`. They're called sequentially. Concurrency is when the machine sees that `getNextNumberFromWeb` is waiting on something and uses that 'time' to allow `Add` to execute, until such time that `getNextNumberFromWeb` has received its data and is ready to execute.

Parallelism might be using a different, multi-core machine, and having both `Add` and `getNextNumberFromWeb` run on different threads, with neither blocking the other. 

That's a bad example but I needed to write it out. 

