const express = require("express");
const db = require("../db");
const User = require("../models/User");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
const userModel = new User(db);

router.get("/", authenticate, (req, res) => {
    if (req.user.role !== "admin") { 
        return userModel.findById(req.user.id, (error,user) => {
            if (error) return res.status(500).json({ message: error.message });
            if (!user) return res.status(404).json({ message: "Usuario no encontrado"});
            res.json([user]);
        })
    }

    userModel.getAll((error, rows) => {
        if (error) return res.status(500).json({ message: error.message });
        res.json(rows);
    });
});

router.post("/", authenticate, authorize("admin"), (req, res) => {
    const { name, email, password, role } = req.body;
    userModel.create(name, email, password, role, (error) => {
        if (error) return res.status(500).json({ message: error.message });
        res.json({ message: "Usuario creado"});
    });
});

router.put("/:id", authenticate, (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (req.user.role !== "admin" && req.user.id != id) {
        return res.status(403).json({ message: "Solo puedes modificar tu propio perfil" });
    }

    userModel.update(id, name, email, role, (error) => {
        if (error) return res.status(500).json({ message: error.message });
        res.json({ message: "Usuario actualizado" });
    });
});

router.delete("/:id", authenticate, authorize("admin"), (req, res) => {
    const { id } = req.params;
    userModel.delete( id, (error) => {
        if (error) return res.status(500),json({ message: error.message });
        res.json({ message: "Usuario eliminado" });
    });
});

router.get("/me", authenticate, (req,res) => {
    res.json(req.user);
});

module.exports = router;