var express = require('express');
var router = express.Router();
const {getArticles} = require('../services/articlesService');

/**
 * GET /articles/ Endpoint to get news articles based on certain user inputs (in the form of query params)
 * @param {string (space separated keywords)} keywords 
 * @param {number} amt 
 * @param {string} title 
 * @param {string} author
 * @returns Array of result articles
 */
router.get('/', async function(req, res, next) {
  const {
    keywords,
    amt,
    title,
    author
  } = req.query;

  // Keyword and title searches must be mutually exclusive
  if (keywords && title) {
    res.send("Error: Keyword and title searches are mutually exclusive, please pick only one");
    return;
  }
  // Author search must accompany a valid search query
  if (!(keywords || title || amt) && author) {
    res.send("Error: Author searches must accompany a valid search query");
    return;
  }

  try {
    const articles = await getArticles(keywords, amt, title, author)
    res.send(articles);
  } catch (err) {
    res.send(`Error: ${err}`);
  }
});

module.exports = router;
