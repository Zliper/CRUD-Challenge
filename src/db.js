const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite", (error) => {
    if (error) console.error("Error al conectar a la DB SQLite", error.message);
    else console.log("Conectado correctamente a la DB SQLite");
});

module.exports = db;