const spicedPg = require("spiced-pg");
const dbUsername = "postgres";
const dbUserPassword = "postgres";
const database = "image-board";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${dbUsername}:${dbUserPassword}@localhost:5432/${database}`
);

console.log("[db] Connecting to: ", database);

module.exports.getImages = () => {
    const query = `SELECT images.url AS url, images.title AS title, images.created_at AS date, images.id AS id
                    FROM images
                    ORDER BY created_at DESC`;
    return db.query(query);
};

module.exports.addImage = (url, username, title, desc) => {
    const query = `INSERT INTO images (url, username, title, description)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *`;
    const params = [url, username, title, desc];
    return db.query(query, params);
};

module.exports.getImageById = (id) => {
    const query = `SELECT images.url AS url, images.title AS title, 
                    images.description AS desc, images.username AS username, images.created_at AS date
                    FROM images
                    WHERE images.id = $1`;
    return db.query(query, [id]);
};
