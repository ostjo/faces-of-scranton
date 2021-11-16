const aws = require("aws-sdk");
const fs = require("fs");
const { AWS_KEY, AWS_SECRET } = require("./secrets.json");
const s3 = new aws.S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("No file on server... :(");
        // something went wrong with multer, there is nothing to upload -> let the client side know
        return res.sendStatus(500);
    }

    // console.log("req.file:", req.file);
    const { filename, mimetype, size, path } = req.file;
    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();
    promise
        .then(() => {
            console.log("yaaay our pictures are in the cloud!");
            next();
            // once my image is in the cloud, we don't need to store it in the uploads folder any longer
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            console.log("oh oh, sth went wrong with our cloud upload", err);
            return res.sendStatus(500);
        });
};
