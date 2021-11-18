const spicedPg = require("spiced-pg");
const dbUsername = "postgres";
const dbUserPassword = "postgres";
const database = "image-board";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${dbUsername}:${dbUserPassword}@localhost:5432/${database}`
);

console.log("[db] Connecting to: ", database);

module.exports.getImages = (smallestImageId) => {
    const query = `SELECT url, title, created_at AS date, id,
                        (SELECT id FROM images
                        ORDER BY id ASC
                        LIMIT 1) AS "lowestId"
                    FROM images
                    ${smallestImageId ? "WHERE id < $1" : ""}
                    ORDER BY created_at DESC
                    LIMIT 9`;
    return db.query(query, smallestImageId && [smallestImageId]);
};

module.exports.addImage = (url, username, title, desc) => {
    const query = `INSERT INTO images (url, username, title, description)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *`;
    const params = [url, username, title, desc];
    return db.query(query, params);
};

module.exports.getImageById = (id) => {
    const query = `SELECT url, title, description AS desc, username, created_at AS date
                    FROM images
                    WHERE id = $1`;
    return db.query(query, [id]);
};

module.exports.getComments = (selectedImageId) => {
    const query = `SELECT username, comment, created_at AS date
                    FROM comments
                    WHERE image_id = $1`;
    return db.query(query, [selectedImageId]);
};

module.exports.addComment = (selectedImageId, username, comment) => {
    const query = `INSERT INTO comments (image_id, username, comment)
                    VALUES($1, $2, $3)
                    RETURNING *`;
    const params = [selectedImageId, username, comment];
    return db.query(query, params);
};
