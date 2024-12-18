export const queries = {
  getUserByEmail: "SELECT email FROM auth WHERE email = $1",
  addUserToAuth:
    "INSERT INTO auth (email, password) VALUES ($1, $2) RETURNING id",
};
