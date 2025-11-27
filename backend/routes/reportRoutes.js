const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const { generatePDF } = require("../utils/pdfGenerator");

const router = express.Router();

router.get("/viability", verifyToken, (req, res) => generatePDF(req, res, "viability"));
router.get("/summary", verifyToken, (req, res) => generatePDF(req, res, "summary"));
router.get("/dashboard", verifyToken, (req, res) => generatePDF(req, res, "dashboard"));
router.get("/academic", verifyToken, (req, res) => generatePDF(req, res, "academic"));

module.exports = router;
