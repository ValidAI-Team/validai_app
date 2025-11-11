// Simulación del análisis de ideas
const form = document.getElementById("analysis-form");

if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const idea = document.getElementById("idea").value;
    const sector = document.getElementById("sector").value;

    const result = document.getElementById("result");
    result.innerHTML = `
      <h3>Resultados del análisis</h3>
      <p>Tu idea <b>"${idea}"</b> en el sector <b>${sector}</b> tiene un potencial alto en el mercado peruano.</p>
      <p>✔️ Nivel de demanda estimado: <b>${Math.floor(Math.random() * 100)}%</b></p>
      <p>✔️ Riesgo de competencia: <b>${Math.floor(Math.random() * 50)}%</b></p>
      <p>✔️ Rentabilidad potencial: <b>${Math.floor(Math.random() * 100)} puntos</b></p>
    `;
  });
}
