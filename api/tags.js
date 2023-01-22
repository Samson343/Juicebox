const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});


tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  // read the tagname from the params
  const { tagName } = req.params;
  // could also be written this way- const tagNames = req.params.tagName
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  const token = auth.slice(prefix.length);

  try {
    // use our method to get posts by tag name from the db
    const allPosts = await getPostsByTagName(tagName)
    const { id } = jwt.verify(token, JWT_SECRET);
    // send out an object to the client { posts: // the posts }

    const  posts = allPosts.filter(post => {
      return post.active && (post.author.id === id)
    });


    res.send({ posts: posts })

  } catch ({ name, message }) {
    // forward the name and message to the error handler
    next({ name, message });
  }
});

tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags()

  res.send({
    tags
  });
});

module.exports = tagsRouter;