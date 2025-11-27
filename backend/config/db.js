const sql = require("mssql");

const config = {
    user: "validai_user",
    password: "Luisdq@987",
    server: "DESKTOP-SF6O3LN",
    database: "ValidAI_DB",
    options: {
        encrypt: false,             // importante para conexión local
        trustServerCertificate: true
    }
};

let pool;

async function connectDB() {
    try {
        if (!pool) {
            pool = await sql.connect(config);
            console.log("✅ Conectado a SQL Server");
        }
        return pool;
    } catch (error) {
        console.error("❌ Error al conectar:", error);
        throw error;
    }
}

module.exports = { connectDB, sql };
