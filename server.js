//================================================ SERVER SETUP ================================================//

const express = require("express");
const app = express();
const db = require("./db.js");
const s3 = require("./s3.js");

app.use(express.static("./public"));
app.use(express.json());

//================================================ MULTER SETUP ================================================//

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    // put files in the uploads directory
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    // as the file name, use the unique id generated by the call to uidSafe with the extension of the original file name appended to it
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

//================================================ ROUTES ================================================//

// The call to single indicates that we are   ↓↓↓↓   only expecting one single file to be uploaded
app.post("/upload", uploader.single("file"), s3.upload, function (req, res) {
    if (req.file) {
        // it worked!
        res.json({
            success: true,
        });
    } else {
        // boo hoo
        res.json({
            success: false,
        });
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

//================================================ PORT ================================================//

app.listen(8080, () => console.log(`I'm listening.`));
