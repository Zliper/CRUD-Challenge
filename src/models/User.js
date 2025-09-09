const bcrypt = require("bcrypt");

class User {
    constructor(db) {
        this.db = db;
    }

    create(name, email, password, role, callback) {
        const hash = bcrypt.hashSync(password, 10);
        this.db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [name, email, hash, role],
        callback
        );
    }

    findByEmail(email, callback) {
        this.db.get(`SELECT * FROM users WHERE email = ?`, [email], callback);
    }

    findById(id, callback) {
        this.db.get(`SELECT id, name, email, role FROM users WHERE id = ?`, [id], callback);
    }

    getAll(callback) {
        this.db.all(`SELECT id, name, email, role FROM users`, [], callback);
    }

    update(id, name, email, role, callback) {
        this.db.run(
        `UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`,
        [name, email, role, id],
        callback
        );
    }
    
    delete(id, callback) {
        this.db.run(`DELETE FROM users WHERE id = ?`, [id], callback);
    }
}

module.exports = User;