const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieSession = require("cookie-session");

const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const app = express();

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credential: true,
};

app.use(express.static(path.join(__dirname, "images")));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(
    cookieSession({
        signed: false,
        secure: false,
    })
);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

mongoose
    .connect(
        "mongodb+srv://Andiez:auuRRqVMFluTVhYW@cluster0.fkvtz7z.mongodb.net/test"
    )
    .then(app.listen(3000))
    .catch((err) => {
        console.log(err);
    });
