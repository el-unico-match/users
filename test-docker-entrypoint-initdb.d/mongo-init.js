db = db.getSiblingDB('match_dev');

db.createCollection('users');

db.users.insertMany([
    {
        name: "rafael",
        email: "rafaelputaro@gmail.com",
        password: "$2a$10$p8EHaUfyGeqwqy8nE6POyOV2Cx0aYSsYG.8Qbbx42TzG9BvGL2Nx.",
        role: "administrador"
    }
]);
