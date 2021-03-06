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
                    LIMIT 12`;
    return db.query(query, smallestImageId && [smallestImageId]);
};

module.exports.addImage = (url, username, title, desc) => {
    const query = `INSERT INTO images (url, username, title, description)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *`;
    const params = [url, username, title, desc];
    return db.query(query, params);
};

module.exports.addTag = (imageId, tag) => {
    const query = `INSERT INTO tags (image_id, tag)
                    VALUES ($1, $2)
                    RETURNING image_id AS id, tag`;
    const params = [imageId, tag];
    return db.query(query, params);
};

module.exports.getImageById = (id) => {
    const query = `SELECT id, url, title, description AS desc, username, created_at AS date,
                        (SELECT id FROM images
                        WHERE id < $1
                        ORDER BY id DESC
                        LIMIT 1) AS "prevId",
                        (SELECT id FROM images
                        WHERE id > $1
                        LIMIT 1) AS "nextId"
                    FROM images
                    WHERE id = $1`;
    return db.query(query, [id]);
};

module.exports.getTagsById = (id) => {
    const query = `SELECT tag, id AS "tagId", image_id AS id
                    FROM tags
                    WHERE image_id = $1`;
    return db.query(query, [id]);
};

module.exports.getImagesByTag = (tag) => {
    const query = `SELECT images.id AS id, images.url AS url, images.title AS title, 
                        images.description AS desc, images.username AS username, images.created_at AS date,
                        tags.tag AS tag, 
                        (SELECT images.id
                        ORDER BY id ASC
                        LIMIT 1) AS "lowestId"
                    FROM tags
                    JOIN images
                    ON tags.image_id = images.id
                    WHERE tags.tag = $1
					ORDER BY id DESC`;
    return db.query(query, [tag]);
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
