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
async function create({ rideFrom, rideTo, date, depTime, seatsAvailable, cost, userName, phone, email } = {}) {
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'INSERT INTO rides(rideFrom, rideTo, date, depTime, seatsAvailable, cost, userName, phone, email) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id';
  const values = [rideFrom, rideTo, date, depTime, seatsAvailable, cost, userName, phone, email];

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
async function rideSearch(rideFrom = '', rideTo = '', date = '') {
  /* todo útfæra */
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const q = `
      SELECT * FROM Rides
      WHERE
        to_tsvector('english', rideFrom) @@ to_tsquery('english', $1)
        AND
        to_tsvector('english', rideTo) @@ to_tsquery('english', $2)
        AND
        to_tsvector('english', date) @@ to_tsquery('english', $3)
      `;

    const result = await client.query(q, [rideFrom, rideTo, date]);

    return result.rows;
  } catch (err) {
    console.error('Error selecting from data', err);
  } finally {
    await client.end();
  }
}

async function mehRides(username = '') {
  /* todo útfæra */
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const q = `
      SELECT * FROM Rides
      WHERE
        to_tsvector('english', username) @@ to_tsquery('english', $1)
      `;

    const result = await client.query(q, [username]);

    return result.rows;
  } catch (err) {
    console.error('Error selecting from data', err);
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
async function update(ride, id) {

  const client = new Client({ connectionString });
  await client.connect();

  const realId = parseInt(id, 10);
  const data = [
    ride.seatsAvailable,
    realId,
  ];

  console.info('dafasdfa: ', data);

  const pstring = `
    UPDATE rides SET 
    seatsAvailable = $1
    WHERE id = $2 
    RETURNING *;
    `;

  try {
    const result = await client.query(pstring, data);

    if (result.rowCount === 0) {
      return {
        success: false,
      };
    }
    return {
      success: true,
      validation: [],
      item: result.rows[0],
    };
  } catch (err) {
    console.error('Error updating data');
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
async function del(id) {
  const client = new Client({ connectionString });

  await client.connect();

  const query = 'DELETE FROM rides WHERE id = ($1)';
  const values = [id];

  try {
    const result = await client.query(query, values);
    console.info('rowcount: ', result.rowCount);
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
  mehRides,
  update,
  del,
};
