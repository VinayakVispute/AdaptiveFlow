import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware for parsing JSON
app.use(express.json());

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
