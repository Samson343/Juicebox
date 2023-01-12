const { Client } = require('pg')

const client = new Client ('postgres://localhost:5432/juicebox')
// connects to the database through this port

//'postgres://postgres@localhost:5432/juicebox'

async function getAllUsers () {
    const { rows } = await client.query(
        `SELECT id, username 
    FROM users;
  `)
  return rows
}

// ^^ SELECT thing you want to grab FROM databasename

async function createUser({ username, password }) {
  try {
    const result = await client.query(`
       INSERT INTO users(username, password)
       VALUES ($1, $2)
       ON CONFLICT (username) DO NOTHING
       RETURNING *;
    `, [username, password])

    return result.rows
  } 
  catch (error) {
    throw error
  }
}

module.exports = {
    client,
    getAllUsers,
    createUser
  }