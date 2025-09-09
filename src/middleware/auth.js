const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token requerido" });

    jwt.verify(token, "secretKey", (error, user) => {
        if (error) return res.status(403),json({ message: "Token invalido" });
        req.user = user;
        next();
    });
}

function authorize(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Permisos insuficientes"});
        }
        next();
    };
}

module.exports = { authenticate, authorize };