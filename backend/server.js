const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Servir archivos estáticos de la app (public está un nivel arriba de backend)
app.use(express.static(path.join(__dirname, "..", "public")));

// Rutas de API
app.use("/api/auth", authRoutes);

// Redirigir "/" al login de la app
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

const PORT = 3000;

connectDB()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`)
        );
    })
    .catch((err) => {
        console.error("❌ No se pudo iniciar el servidor por error de conexión a SQL Server:", err);
    });
