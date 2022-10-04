const { default: axios } = require('axios');
const { filterByAuthor, makeUrl } = require('../util');

const NodeCache = require( "node-cache" );
const articlesCache = new NodeCache();


/**
 * Service function to utlize axios to query newsapi and fetch articles
 * @param {string (space separated keywords)} keywords 
 * @param {number} amt 
 * @param {string} title 
 * @param {string} author
 * @returns Array of result articles
 */
const getArticles = async (keywords, amt, title, author) => {
  const url = makeUrl(keywords, amt, title);

  let articles = articlesCache.get(url);
  if (articles == undefined) {
    try {
      articles = await (await axios.get(url)).data.articles;
      articlesCache.set(url, articles);
    } catch (err) {
      throw err;
    }
  }
  if (author) {
    articles = filterByAuthor(articles, author);
  }
  if (amt) {
    articles = articles.slice(0, amt);
  }
  
  return articles
}

module.exports = {getArticles};