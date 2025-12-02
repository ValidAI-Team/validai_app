const jwt = require("jsonwebtoken");
const SECRET = "VALIDAI_SECRET_2025";

function verifyToken(req, res, next) {
    console.log("🔒 Verificando token...");
    
    const header = req.headers.authorization;
    
    if (!header) {
        console.log("❌ No hay header de autorización");
        return res.status(401).json({ 
            success: false,
            message: "No autorizado. Token no proporcionado." 
        });
    }

    const token = header.split(" ")[1];
    
    if (!token) {
        console.log("❌ Token no encontrado en header");
        return res.status(401).json({ 
            success: false,
            message: "Formato de token inválido." 
        });
    }

    try {
        console.log("🔍 Verificando token...");
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        console.log("✅ Token válido para usuario:", decoded.email);
        next();
    } catch (error) {
        console.log("❌ Token inválido o expirado:", error.message);
        return res.status(403).json({ 
            success: false,
            message: "Token inválido o expirado" 
        });
    }
}

module.exports = verifyToken;