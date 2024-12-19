export const queries = {
  getUserByEmail: "SELECT email FROM auth WHERE email = $1",
  getAuthByEmail: "SELECT email, password FROM auth WHERE email = $1",
  addUserToAuth:
    "INSERT INTO auth (email, password) VALUES ($1, $2) RETURNING id",
  addUser:
    "INSERT INTO users (id, first_name, last_name, email) VALUES ($1, $2, $3, $4)",
  getUserById:
    "SELECT id, first_name, last_name, email FROM users WHERE id = $1",
  updateUserById:
    "UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3",
};
