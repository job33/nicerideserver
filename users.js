const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function createUser({ username, password, name, phone, email } = {}) {
  const client = new Client({ connectionString });
  const data = [];
  await client.connect();

  const query = 'INSERT INTO users(username, password, name, phone, email) VALUES($1, $2, $3, $4, $5) RETURNING *';
  const values = [username, password, name, phone, email];

  try {
    const result = await client.query(query, values);
    data.push({
      success: true,
      username: result.rows.username,
      name: result.rows.name,
      phone: result.rows.phone,
      email: result.rows.email,
    });
    return data;
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
