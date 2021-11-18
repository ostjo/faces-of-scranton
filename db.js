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
    const query = `SELECT url, title, created_at AS date, id
                    FROM images
                    ORDER BY created_at DESC
                    LIMIT 6`;
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
    const query = `SELECT url, title, desc, username, created_at AS date
                    FROM images
                    WHERE id = $1`;
    return db.query(query, [id]);
};

module.exports.getNextImages = (smallestImageId) => {
    const query = `SELECT url, title, id, created_at AS date,
                        (SELECT id FROM images
                        ORDER BY id ASC
                        LIMIT 1) AS "lowestId"
                    FROM images
                    WHERE id < $1
                    ORDER BY id DESC
                    LIMIT 6`;
    return db.query(query, [smallestImageId]);
};
