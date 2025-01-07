import dotenv from "dotenv";
import { createServer } from "./utils/server";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = createServer();

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
