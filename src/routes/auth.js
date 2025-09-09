const express = require("express");
const bcrypt =  require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const User = require("../models/User");
const router = express.Router();

const userModel = new User(db);

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    userModel.findByEmail(email, (error, user) => {
        if (error || !user) return res.status(400).json({ message: "Usuario no encontrado"});

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: "Contraseña incorrecta"});
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            "secretKey",
            { expiresIn: "1h" }
        );

        res.json({token});
    });
});

module.exports = router;