// grab our client with destructuring from the export in index.js
const { client, getAllUsers } = require('./index');


async function testDB() {
    try {
      // connect the client to the database, finally
      client.connect();
  
      // queries are promises, so we can await them
      const users = await getAllUsers()
      //   const result = await client.query(`SELECT * FROM users;`);
  
      // for now, logging is a fine way to see what's up

      console.log(users);
    } catch (error) {
      console.error(error);
    } finally {
      // it's important to close out the client connection
      client.end();
    }
  }
  
  testDB();

  //queries must end with a semicolon
// \l to see your database
// \c databaseName connects you to a given database
// INSERT INTO allows you to directly insert data into a database
// duplicate values, like id or name, are not allowed by sql
// CREATE TABLE specify structure after
// DELETE * FROM
// nmp i pg to start postgress in your node project
// \q to quit postgres