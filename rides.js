const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

/**
 * Create a ride asynchronously.
 *
 * @param {Object} note - ride to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function create({ rideFrom, rideTo, date, depTime, seatsAvailable, cost } = {}) {
  /* todo útfæra */
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'INSERT INTO rides(rideFrom, rideTo, date, depTime, seatsAvailable, cost) VALUES($1, $2, $3, $4, $5, $6) RETURNING id';
  const values = [rideFrom, rideTo, date, depTime, seatsAvailable, cost];

  try {
    const result = await client.query(query, values);
    return result.rows;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Read all notes.
 *
 * @returns {Promise} Promise representing an array of all note objects
 */
async function readAll() {
  /* todo útfæra */
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query('SELECT * FROM rides');
    return result.rows;
  } catch (err) {
    console.error('Error selecting from data');
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Read a single note.
 *
 * @param {number} id - Id of note
 *
 * @returns {Promise} Promise representing the note object or null if not found
 */
async function rideSearch(rideFrom) {
  /* todo útfæra */
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const q = `
      SELECT * FROM Rides
      WHERE
        rideFrom = $1
      `;
    const result = await client.query(q, [rideFrom]);
    return result.rows;
  } catch (err) {
    console.error('Error selecting from data');
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Update a note asynchronously.
 *
 * @param {number} id - Id of note to update
 * @param {Object} note - Note to create
 * @param {string} note.title - Title of note
 * @param {string} note.text - Text of note
 * @param {string} note.datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function update(id, { rideFrom, rideTo, date, depTime, seatsAvailable, cost } = {}) {
  /* todo útfæra */
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'UPDATE rides SET rideFrom = ($7), rideTo = ($6), date = ($5), depTime = ($4), seatsAvailable = ($3), cost = ($2), WHERE id = ($1)';
  const values = [id, cost, seatsAvailable, depTime, date, rideTo, rideFrom];

  try {
    const result = await client.query(query, values);
    return result.rowCount;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Delete a note asynchronously.
 *
 * @param {number} id - Id of note to delete
 *
 * @returns {Promise} Promise representing the boolean result of creating the note
 */
async function del(date) {
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'DELETE FROM rides WHERE date = ($1)';
  const values = [date];

  try {
    const result = await client.query(query, values);
    return result.rowCount;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

module.exports = {
  create,
  readAll,
  rideSearch,
  update,
  del,
};
