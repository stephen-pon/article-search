require('dotenv').config();
var API_KEY = process.env.API_KEY;

/**
 * Util function to filter out articles not written by author
 * @param {array<article>} articles 
 * @param {string} author 
 * @returns Array of articles
 */
const filterByAuthor = (articles, author) => {
  return articles.filter(e => {
    return e.author === author;
  });
}

/**
 * Makes appropriate URL to request articles based on user input
 * @param {string (space separated keywords)} keywords 
 * @param {number} amt 
 * @param {string} title 
 * @returns string
 */
const makeUrl = (keywords, amt, title) => {
  let url;
  if (amt && !(keywords || title)) {
    url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=100&apiKey=${API_KEY}`
  } else {
    url = `https://newsapi.org/v2/everything?sortBy=popularity&pageSize=100&apiKey=${API_KEY}`
  }

  if (keywords) {
    url += `&q=${keywords}`;
  }
  if (title) {
    url += `&q=${title}&in=title`;
  }

  return url;
}

module.exports = {filterByAuthor, makeUrl};