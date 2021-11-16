//============================ SERVER SETUP ============================//

const express = require("express");
const app = express();
const db = require("./db.js");

app.use(express.static("./public"));

app.use(express.json());

//============================ MULTER SETUP ============================//

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

//============================ ROUTES ============================//

app.post("/upload", uploader.single("file"), function (req, res) {
    if (req.file) {
        // it worked!
        res.sendStatus(200);
    } else {
        // boo hoo
        res.sendStatus(500);
    }
});

app.get("/images.json", (req, res) => {
    db.getImages()
        .then((images) => {
            res.json(images);
        })
        .catch((err) => {
            console.log("err in getImages() on GET /images.json", err);
            res.sendStatus(500);
        });
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
