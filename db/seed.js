// grab our client with destructuring from the export in index.js

const {
  client,
  getAllUsers,
  createUser
} = require('./index');


async function createInitialUsers() {
  // const albertTwo = await createUser({ username: 'albert', password: 'imposter_albert' })
  try {
    console.log("Starting to create users...")

    const albert = await createUser({ username: 'albert', password: 'bertie99' })
    const sandra = await createUser ({ username: 'sandra', password: '2sandy4me' })
    const glamgal = await createUser ({ username: 'glamgal', password: 'soglam' })

    console.log(albert)
    console.log("finished creating users!")
  }
  catch (error) {
    console.error("error creating users!")
    throw error
  }
}

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL
      );
    `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers()
  } catch (error) {
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}


rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
  //the client.end() tells node to cut off the connection to this file/database, important to have a client.end() in all node applications


  //queries must end with a semicolon
// \l to see your database
// \c databaseName connects you to a given database
// INSERT INTO allows you to directly insert data into a database
// duplicate values, like id or name, are not allowed by sql
// CREATE TABLE specify structure after
// DELETE * FROM
// nmp i pg to install postgress in your node project
// \q to quit postgres
// to drop a table essentially means deleting it
// psql -U postgres to start postgress with the username posgres
// npm init -y is writes a super basic package.json
// after a .query(``) you can insert commands for postgres to execute, should always be awaited 
// make sure to drop a table often when you are updating it - this allows you to delete the database and reconstruct it with the new data
// $1 is a way to protect against sql insertion which is a backdoor for people to steal info
// spaces in javascript will turn into % signs in a url