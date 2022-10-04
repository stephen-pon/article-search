-- How to run --

In the root directory of this project, follow the following steps:
1. Add .env file to root of project (Sent to Mike through email)
2. run `npm install`
3. run `npm start`
(I'm currently using node v17.4.0. If you're having issues running it, try moving to that version).



-- Making a request --

Using postman or cURL or your favorite method, run:
GET localhost:3000/articles?keywords=midterms

The main endpoint is `GET /articles`
The query params that are expected are:
- author<string> (Article author's name)
- amt<number> (Number of results requested (max 100)) [Technically the user can make the amt > 100, but only 100 results will shown (this is explained below in the notes)]
- keywords<string, space-separated> (Keyword based article search query)
- title<string> (Title based article search query)

All combinations of params are accepted except for the following rules: 
1. User must choose either 'keyword' or 'title', they cannot query for both
2. 'author' queries must be accompanied by either 'keyword', 'title', or 'amt'

Examples:
- GET localhost:3000/articles?amt=6&keywords=midterms Biden
- GET localhost:3000/articles?title=Biden&author=Joe Smith
- GET localhost:3000/articles?amt=30



-- Notes --
- This project was scaffolded using 'express-generator' for convenience purposes, but the code I've written exists in `util.js`, `/routes/articles.js`, and `/services/articlesService.js`.

- API queries to fetch news data utilize `newsapi.com`, caching is done using `node-cache`, queries are made using `axios`, apikey is stored using `dotenv`.

- The reason why 'keyword' and 'title' searches are mutually exclusive is because of the way the `newsapi` api works (the query we send them can be specified as an 'in title' query, but then the query cannot be applied to keywords in general).

- The `newsapi` api does not include an author search, which is why the author param must be included in an already valid search using 'author', 'keyword', or 'amt'(our methodology is first, performing the rest of the query using the other input params, and then filtering the result so only the chosen author's articles are returned)

- In general the flow of the query is as such: 
    1) A url is generated, and a query is made based on 'keywords', 'amt', and 'title' input. If only 'amt' is present, then 'top-headlines' will be queried, otherwise 'everything'(the set of all news articles) is queried. In either case, the query will always attempt to retrieve 100 articles.
    2) Once `newsapi` returns results, then the result is cached with the url as the key.
    3) Then, if an 'author' param was inputted, the articles will be filtered by that author.
    4) Finally, if an 'amt' param was inputted, the articles array will be sliced such that the final output will include that many articles.

- The benefit of using this method is that query results that are cached are 'amt' and 'author' agnostic, so if the user makes another query with the same 'keyword'/'title', then the cached results will be used instead of making another call to the api, saving a significant amount of time.

- The downside of this system is that we're limiting the number of returned articles in any given query to 100 results. This choice was made for simplicity's sake since the maximum result page size for `newsapi` is 100 results, and to get more, we'd have to make repeated queries to the api, specifying increasing pages. I chose not to implement this logic due to time constraints, but if I had more time, I would certainly make the system more robust, and allow for the user to query for any amount of articles in any search. Adjustments would have to be made on the querying side, as explained earlier, to have the 'articlesService' perform multiple queries in order to fetch the minimum number of pages to get the requested amount. Adjustments would also have to be made to the cache fetching logic, specifically, checking if the cached result for a given query contains the amount of results necessary to return solely from cache, or if additional api requests are required to meet the amt requested. Additionally, some sort of logic would need to be implemented to let the system know that the maximum number of results for a given query have been fetched/cached, meaning no further queries are necessary.