const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function createUser({ username, password, name, phone, email } = {}) {
  /* todo útfæra */
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'INSERT INTO users(username, password, name, phone, email) VALUES($1, $2, $3, $4, $5) RETURNING *';
  const values = [username, password, name, phone, email];

  try {
    const result = await client.query(query, values);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

async function login({ username, password } = {}) {
  /* todo útfæra */
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'SELECT * FROM Users WHERE username = $1 AND password = $2';
  const values = [username, password];

  try {
    const result = await client.query(query, values);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

module.exports = {
  createUser,
  login,
};
