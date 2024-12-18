import express, { Request, Response } from "express";
import { authRouter } from "./routes/auth.route";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    healthy: true,
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
