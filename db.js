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
    const query = `SELECT images.url AS url, images.title AS title, images.created_at AS date
                    FROM images
                    ORDER BY created_at DESC`;
    return db.query(query);
};
