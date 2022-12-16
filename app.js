const path = require("path")
const fs = require("fs")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const mongoose = require("mongoose")

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")

const app = express()

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credential: true,
}

app.use(express.static(path.join(__dirname, "images")))
app.use(bodyParser.json())
app.use(cors(corsOptions))

app.use("/auth", authRoutes)
app.use("/user", userRoutes)

mongoose
    .connect(
        "mongodb+srv://AndiexPie6:JnoRVDRbvQXk4kPl@nodejs-learning.odff7nk.mongodb.net/feed?authSource=admin"
    )
    .then(app.listen(3000))
    .catch((err) => {
        console.log(err)
    })




