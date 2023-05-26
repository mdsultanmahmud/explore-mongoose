const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose")

app.use(express.json());
app.use(cors());

// routes 
const  productRoutes = require("./routes/product.route")

// use route
app.use("/api/v1/product", productRoutes)



app.get("/", (req, res) => {
    res.send("Route is working! YaY!");
});




module.exports = app;