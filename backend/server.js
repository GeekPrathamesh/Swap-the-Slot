import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import swapRoutes from "./routes/swaps.js";
import CONNECTDB from "./db.js";



dotenv.config();
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL, // frontend URL
    credentials: true,               // allow cookies/token if needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

CONNECTDB();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/swap", swapRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})

