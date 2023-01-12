const { Client } = require('pg')

const client = new Client ('postgres://localhost:5432/juicebox')
// connects to the database through this port

//'postgres://postgres@localhost:5432/juicebox'

async function getAllUsers () {
    const { rows } = await client.query(
        `SELECT id, username, password, name, location, active 
         FROM users;
  `)
  return rows
}

// ^^ SELECT thing you want to grab FROM databasename

async function createUser({ 
  username, 
  password,
  name,
  location
  }) {
  try {
    const result = await client.query(`
       INSERT INTO users(username, password, name, location)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO NOTHING
       RETURNING *;
    `, [username, password, name, location])

    const { rows: [ user ] } = await client.query(`
    `, []);

    return user
  } 
  catch (error) {
    throw error
  }
}

async function updateUser(id, fields ={}) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ')

  if (setString === 0) {
    return
  }

  try {
    const result = await client.query(`
      UPDATE users
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields))

    const { rows: [ user ] } = await client.query(`
    `, []);
  
    return user
  }
  catch (error) {
    throw error
  }
}

async function getAllPosts() {
  try {

  } catch (error) {
    throw error;
  }
}

async function createPost ({
  authorId,
  title,
  content
}) {
  try {

  }
  catch (error) {
    throw error
  }
}

async function updatePost(id, {
  title,
  content,
  active
}) {
  try {

  } catch (error) {
    throw error;
  }
}

async function getPostsByUser(userId) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM posts
      WHERE "authorId"=${ userId };
    `);

    console.log("this is rows" + rows)
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById (userId) {
  const { rows: [user] } = await client.query(`
  SELECT id, username, name, location, active FROM users
  WHERE "userId"=${ userId };
`)
if (!user) {
  return null
}
else {
  user.posts = await getPostsByUser(userId)
}
;
  
}

module.exports = {
    client,
    getAllUsers,
    createUser,
    updateUser, 
    createPost,
    updatePost,
    getPostsByUser,
    getUserById,
    getAllPosts
  }