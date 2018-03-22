// const bcrypt = require('bcrypt');

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function checkForUser(username) {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const q = 'SELECT * FROM Users WHERE username = $1';
    const result = client.query(q, [username]);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    await client.end;
  }
}

async function checkForPhone(phone) {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const q = 'SELECT * FROM Users WHERE username = $1';
    const result = client.query(q, [phone]);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    await client.end;
  }
}

async function checkForEmail(email) {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const q = 'SELECT * FROM Users WHERE username = $1';
    const result = client.query(q, [email]);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    await client.end;
  }
}

async function validateUser(username, password, name, phone, email) {

  if (username.length < 5) {
    return 'Username too short';
  }

  const checkUser = await checkForUser(username);
  if (checkUser < 0) {
    return 'Username already exists';
  }

  const checkPhone = await checkForPhone(phone);
  if (checkPhone < 0) {
    return 'Phone-number already exists';
  }

  const checkEmail = await checkForEmail(email);
  if (checkEmail < 0) {
    return 'Email already exists';
  }
  return '';
}

async function createUser(username, password, name, phone, email) {
  const client = new Client({ connectionString });

  await client.connect();

  // const hashedPassword = await bcrypt.hash(password, 11);
  const q = 'INSERT INTO Users (username, password, name) VALUES ($1, $2, $3) RETURNING *';

  const validation = validateUser(username, password, name, phone, email);
  if (validation.length < 0) {
    return validation;
  }

  try {
    const result = await Client.query(q, [username, password, name, phone, email]);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    await client.end;
  }
}

module.exports = {
  createUser,
};
