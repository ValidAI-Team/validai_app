const bcrypt = require("bcryptjs");
const { findUserByEmail, createUser } = require("../models/userModel");

async function register(req, res) {
    const { fullname, email, usertype, password } = req.body;
    if (!fullname || !email || !usertype || !password) {
        return res.status(400).json({ message: "Faltan datos" });
    }

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Usuario ya existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser({ fullname, email, usertype, password: hashedPassword });

        res.json({ message: "Usuario registrado correctamente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error con la base de datos" });
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Faltan datos" });
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        const validPassword = await bcrypt.compare(password, user.Password);
        if (!validPassword) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        res.json({
            message: "Login exitoso",
            user: {
                id: user.Id,
                fullname: user.FullName,
                email: user.Email,
                usertype: user.UserType
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error con la base de datos" });
    }
}

module.exports = { register, login };
