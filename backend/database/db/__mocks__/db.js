// Manual mock for backend/database/db/db.js — used whenever a test calls
// jest.mock('.../database/db/db') (or a relative equivalent). Every route
// module imports the same `pool` instance, so mocking `query` here is
// enough to control DB behavior across the whole request without ever
// touching a real database.
module.exports = {
  query: jest.fn(),
};
