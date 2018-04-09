const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function createUser({ username, password, name, phone, email } = {}) {
  /* todo útfæra */
  const client = new Client({ connectionString });

  await client.connect();

  const usercheck = 'SELECT * FROM users WHERE username = $1;';
  const res = await client.query(usercheck, [username]);

  const phonecheck = 'SELECT * FROM users WHERE username = $1;';
  const res1 = await client.query(phonecheck, [username]);

  const emailcheck = 'SELECT * FROM users WHERE username = $1;';
  const res2 = await client.query(emailcheck, [username]);

  if (res.rowCount === 0 && res1.rowCount === 0 && res2.rowCount === 0) {
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

  /* const query = 'INSERT INTO users(username, password, name, phone, email) VALUES($1, $2, $3, $4, $5) RETURNING *';
  const values = [username, password, name, phone, email];

  try {
    const result = await client.query(query, values);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  } */
  return {
    success: false,
  };
}

async function login({ username, password } = {}) {
  /* todo útfæra */
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'SELECT * FROM Users WHERE username = $1 AND password = $2';
  const values = [username, password];

  try {
    const result = await client.query(query, values);
    console.info(result.rows);
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
