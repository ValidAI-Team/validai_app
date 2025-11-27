document.getElementById("download-viability")?.addEventListener("click", () => {
  window.open("/api/reports/viability", "_blank");
});

document.getElementById("download-summary")?.addEventListener("click", () => {
  window.open("/api/reports/summary", "_blank");
});

document.getElementById("download-dashboard")?.addEventListener("click", () => {
  window.open("/api/reports/dashboard", "_blank");
});

document.getElementById("download-academic")?.addEventListener("click", () => {
  window.open("/api/reports/academic", "_blank");
});
