require("dotenv").config();

const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

module.exports = app;
