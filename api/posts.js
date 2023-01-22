const express = require("express");
const postsRouter = express.Router();
const { requireUser } = require("./utils");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

postsRouter.post("/", requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;
  const tagArr = tags.trim().split(/\s+/);
  const postData = {};

  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  const token = auth.slice(prefix.length);

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    // add authorId, title, content to postData object
    const { id } = jwt.verify(token, JWT_SECRET);

    postData['title'] = title
    postData['content'] = content
    postData['authorId'] = id


    // const post = await createPost(postData);
    const post = await createPost(postData);
    // this will create the post and the tags for us
    // if the post comes back, res.send({ post });
    if (post) {
      res.send(post);
      // otherwise, next an appropriate error object
    } else {
      next({ name: "error", message: "this is an error" });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// res.send({ message: "under construction" });

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

const { getAllPosts, createPost } = require("../db");

postsRouter.get("/", async (req, res) => {
  const posts = await getAllPosts();

  res.send({
    posts,
  });
});

module.exports = postsRouter;
