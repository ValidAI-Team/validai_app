const pdfGen = require('../utils/pdfGenerator');

function sendPdfBuffer(res, buffer, filename) {
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Length': buffer.length,
    'Content-Disposition': `attachment; filename="${filename}"`
  });
  res.set('x-filename', filename);
  res.send(buffer);
}

exports.viability = async (req, res) => {
  try {
    const idea = req.query.idea || 'Idea sin especificar';
    const user = req.query.user || 'Anónimo';
    const buffer = await pdfGen.generateViabilityPDF({ idea, user });
    sendPdfBuffer(res, buffer, `viability-${Date.now()}.pdf`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generando PDF de viabilidad');
  }
};

exports.summary = async (req, res) => {
  try {
    const idea = req.query.idea || 'Idea sin especificar';
    const user = req.query.user || 'Anónimo';
    const buffer = await pdfGen.generateSummaryPDF({ idea, user });
    sendPdfBuffer(res, buffer, `summary-${Date.now()}.pdf`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generando PDF de resumen');
  }
};

exports.dashboard = async (req, res) => {
  try {
    const idea = req.query.idea || 'Idea sin especificar';
    const user = req.query.user || 'Anónimo';
    const buffer = await pdfGen.generateDashboardPDF({ idea, user });
    sendPdfBuffer(res, buffer, `dashboard-${Date.now()}.pdf`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generando PDF dashboard');
  }
};

exports.academic = async (req, res) => {
  try {
    const idea = req.query.idea || 'Idea sin especificar';
    const user = req.query.user || 'Anónimo';
    const buffer = await pdfGen.generateAcademicPDF({ idea, user });
    sendPdfBuffer(res, buffer, `academic-${Date.now()}.pdf`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generando PDF académico');
  }
};
