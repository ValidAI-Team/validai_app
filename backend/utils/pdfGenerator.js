const PDFDocument = require("pdfkit");

function generatePDF(req, res, type) {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${type}.pdf`);

  doc.fontSize(20).text(`Reporte ${type.toUpperCase()}`, { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Generado para: ${req.user.email}`);
  doc.text(`Fecha: ${new Date().toLocaleString()}`);

  doc.end();
  doc.pipe(res);
}

module.exports = { generatePDF };
