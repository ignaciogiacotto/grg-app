import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import cierrePfRoutes from "./routes/cierrePfRoutes";
import cierreKioscoRoutes from "./routes/cierreKioscoRoutes";
import providerRoutes from "./routes/providerRoutes";
import extractionRoutes from "./routes/extractionRoutes";
import reportRoutes from "./routes/reportRoutes";
import exchangeRateRoutes from "./routes/exchangeRateRoutes";
import noteRoutes from "./routes/noteRoutes";
import tagRoutes from "./routes/tagRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { findUserByUsernameAndPassword } from "./services/userService";
import connectDB from "./config/database";
import jwt from "jsonwebtoken";

const app = express();
const port = 4000;

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/users", userRoutes);
app.use("/api/cierre-pf", cierrePfRoutes);
app.use("/api/cierre-kiosco", cierreKioscoRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/extractions", extractionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/exchange-rates", exchangeRateRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tags", tagRoutes);


app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await findUserByUsernameAndPassword(username, password);

  if (user) {
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "3h",
      }
    );
    res.json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});