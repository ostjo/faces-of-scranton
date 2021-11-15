const express = require("express");
const app = express();
const db = require("./db.js");

app.use(express.static("./public"));

app.use(express.json());

app.get("/images.json", (req, res) => {
    db.getImages()
        .then((images) => {
            console.log(images);
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
