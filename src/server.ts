import expess, { Request, Response } from "express";

const app = expess();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
