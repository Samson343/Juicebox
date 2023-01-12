// grab our client with destructuring from the export in index.js

const {
  client,
    getAllUsers,
    createUser,
    updateUser, 
    createPost,
    updatePost,
    getPostsByUser,
    getUserById,
    getAllPosts
} = require('./index');


async function createInitialUsers() {
  // const albertTwo = await createUser({ username: 'albert', password: 'imposter_albert' })
  try {
    console.log("Starting to create users...")

    const albert = await createUser({ username: 'albert', password: 'bertie99', name: 'albertino', location: "asmallmoon" })
    const sandra = await createUser ({ username: 'sandra', password: '2sandy4me', name: 'sandrinotheterrifying', location: "amediummoon" })
    const glamgal = await createUser ({ username: 'glamgal', password: 'soglam', name: 'karen', location: "restarauntsmostly" })

    console.log(albert)
    console.log("finished creating users!")
  }
  catch (error) {
    console.error("error creating users!")
    throw error
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers()

    await createInitialPosts({
      authorId: albert.id,
      title: "First Post",
      content: "This is my first post."
    })
  }
  catch(error) {
    throw error
  }
}

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS posts;
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
        password varchar(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
    `);
    await client.query(`
    CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    "authorId" INTEGER REFERENCES users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    active BOOLEAN DEFAULT true
    );
    `)

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

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY"
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content"
    });
    console.log("Result:", updatePostResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
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
// when re-cloning the project, this command starts psql and holds the server open - sudo service postgresql start
