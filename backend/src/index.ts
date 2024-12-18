import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    healthy: true,
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
