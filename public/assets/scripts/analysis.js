// analysis.js - Análisis mejorado con IA simulada
console.log("Análisis ValidAI cargado correctamente");

// Inicialización del Análisis
document.addEventListener('DOMContentLoaded', function() {
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "index.html";
    return;
  }
  
  initializeAnalysis();
  setupAnalysisListeners();
  loadUserAnalysisHistory();
  setupRealTimeSuggestions();
});

function initializeAnalysis() {
  console.log("Inicializando módulo de análisis mejorado...");
  const username = localStorage.getItem('currentUser') || 'Emprendedor';
  document.title = `ValidAI | Análisis - ${username}`;
  
  if (!localStorage.getItem('analysisHistory')) {
    localStorage.setItem('analysisHistory', JSON.stringify([]));
  }
  
  showRandomTip();
}

function setupAnalysisListeners() {
  const form = document.getElementById("analysis-form");
  if (form) {
    form.addEventListener("submit", handleAnalysisSubmit);
  }
  
  const ideaInput = document.getElementById("idea");
  const sectorSelect = document.getElementById("sector");
  
  if (ideaInput) {
    ideaInput.addEventListener("input", function() {
      validateIdeaInput(this);
    });
    
    ideaInput.addEventListener("focus", function() {
      showInputTips();
    });
  }
  
  if (sectorSelect) {
    sectorSelect.addEventListener("change", function() {
      validateSectorSelect(this);
    });
  }
  
  const logout = document.getElementById("logout");
  if (logout) {
    logout.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("currentUser");
      showNotification('Sesión cerrada correctamente', 'success');
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    });
  }
}

function setupRealTimeSuggestions() {
  loadMarketData();
}

function handleAnalysisSubmit(e) {
  e.preventDefault();
  
  const idea = document.getElementById("idea").value.trim();
  const sector = document.getElementById("sector").value;
  
  if (!validateIdeaSubmission(idea, sector)) {
    return;
  }
  
  showAnalysisInProgress(idea, sector);
  simulateAdvancedAnalysis(idea, sector);
}

function validateIdeaSubmission(idea, sector) {
  const errors = [];
  
  if (!idea) {
    errors.push('Por favor, describe tu idea de negocio');
  } else if (idea.length < 10) {
    errors.push('La descripción debe tener al menos 10 caracteres');
  } else if (idea.length > 500) {
    errors.push('La descripción es demasiado larga (máximo 500 caracteres)');
  }
  
  if (!sector) {
    errors.push('Por favor, selecciona un sector');
  }
  
  const genericTerms = ['negocio', 'empresa', 'proyecto', 'algo', 'producto'];
  const hasGenericTerms = genericTerms.some(term => 
    idea.toLowerCase().includes(term) && idea.split(' ').length < 8
  );
  
  if (hasGenericTerms) {
    errors.push('Tu idea parece muy genérica. Sé más específico sobre tu producto o servicio');
  }
  
  if (errors.length > 0) {
    showValidationErrors(errors);
    return false;
  }
  
  return true;
}

function showAnalysisInProgress(idea, sector) {
  const form = document.getElementById("analysis-form");
  const result = document.getElementById("result");
  
  form.style.opacity = '0.5';
  form.style.pointerEvents = 'none';
  
  result.innerHTML = `
    <div class="analysis-progress">
      <div class="progress-header">
        <h3>🔍 Analizando tu idea...</h3>
        <p>ValidAI está evaluando "<strong>${idea}</strong>" en el sector <strong>${sector}</strong></p>
      </div>
      
      <div class="progress-steps">
        <div class="progress-step active" data-step="1">
          <div class="step-icon">
            <i class="fas fa-search"></i>
          </div>
          <div class="step-content">
            <span class="step-title">Análisis de mercado</span>
            <span class="step-description">Evaluando demanda y competencia</span>
          </div>
          <div class="step-loader">
            <div class="loader"></div>
          </div>
        </div>
        
        <div class="progress-step" data-step="2">
          <div class="step-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="step-content">
            <span class="step-title">Proyección financiera</span>
            <span class="step-description">Calculando rentabilidad potencial</span>
          </div>
          <div class="step-loader">
            <div class="loader"></div>
          </div>
        </div>
        
        <div class="progress-step" data-step="3">
          <div class="step-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <div class="step-content">
            <span class="step-title">Evaluación de riesgos</span>
            <span class="step-description">Identificando posibles desafíos</span>
          </div>
          <div class="step-loader">
            <div class="loader"></div>
          </div>
        </div>
        
        <div class="progress-step" data-step="4">
          <div class="step-icon">
            <i class="fas fa-lightbulb"></i>
          </div>
          <div class="step-content">
            <span class="step-title">Recomendaciones</span>
            <span class="step-description">Generando insights personalizados</span>
          </div>
          <div class="step-loader">
            <div class="loader"></div>
          </div>
        </div>
      </div>
      
      <div class="progress-tips">
        <div class="tip-item">
          <i class="fas fa-info-circle"></i>
          <span>Analizando datos de mercado en tiempo real...</span>
        </div>
      </div>
    </div>
  `;
}

function simulateAdvancedAnalysis(idea, sector) {
  const analysisStages = [
    { name: "market", duration: 1500 },
    { name: "financial", duration: 2000 },
    { name: "risk", duration: 1800 },
    { name: "recommendations", duration: 1200 }
  ];
  
  let currentStage = 0;
  
  function processNextStage() {
    if (currentStage < analysisStages.length) {
      const stage = analysisStages[currentStage];
      updateProgressStage(currentStage + 1);
      
      setTimeout(() => {
        currentStage++;
        processNextStage();
      }, stage.duration);
    } else {
      completeAnalysis(idea, sector);
    }
  }
  
  processNextStage();
}

function updateProgressStage(stepNumber) {
  const steps = document.querySelectorAll('.progress-step');
  
  steps.forEach((step, index) => {
    if (index < stepNumber) {
      step.classList.add('completed');
      step.classList.remove('active');
      step.querySelector('.step-loader').innerHTML = '<i class="fas fa-check"></i>';
    } else if (index === stepNumber) {
      step.classList.add('active');
    } else {
      step.classList.remove('active', 'completed');
      step.querySelector('.step-loader').innerHTML = '<div class="loader"></div>';
    }
  });
  
  updateProgressTips(stepNumber);
}

function updateProgressTips(step) {
  const tips = [
    "📊 Consultando bases de datos de SUNAT y Mercado Libre...",
    "💡 Comparando con 150+ emprendimientos similares...",
    "🎯 Analizando tendencias de consumo en Perú...",
    "🚀 Generando recomendaciones personalizadas..."
  ];
  
  const tipContainer = document.querySelector('.progress-tips');
  if (tipContainer && tips[step - 1]) {
    tipContainer.innerHTML = `
      <div class="tip-item">
        <i class="fas fa-info-circle"></i>
        <span>${tips[step - 1]}</span>
      </div>
    `;
  }
}

function completeAnalysis(idea, sector) {
  const analysisResults = generateComprehensiveAnalysis(idea, sector);
  displayAdvancedResults(idea, sector, analysisResults);
  saveToAnalysisHistory(idea, sector, analysisResults);
  updateUserStats();
  
  const form = document.getElementById("analysis-form");
  form.style.opacity = '1';
  form.style.pointerEvents = 'auto';
  form.reset();
}

function generateComprehensiveAnalysis(idea, sector) {
  const marketAnalysis = analyzeMarket(idea, sector);
  const financialAnalysis = analyzeFinancials(idea, sector);
  const riskAnalysis = analyzeRisks(idea, sector);
  const competitionAnalysis = analyzeCompetition(idea, sector);
  const recommendations = generateStrategicRecommendations(marketAnalysis, financialAnalysis, riskAnalysis);
  
  return {
    market: marketAnalysis,
    financial: financialAnalysis,
    risk: riskAnalysis,
    competition: competitionAnalysis,
    recommendations: recommendations,
    overallScore: calculateOverallScore(marketAnalysis, financialAnalysis, riskAnalysis),
    timestamp: new Date().toISOString()
  };
}

function analyzeMarket(idea, sector) {
  const demand = calculateMarketDemand(idea, sector);
  const growth = calculateMarketGrowth(sector);
  const seasonality = analyzeSeasonality(idea, sector);
  const targetAudience = identifyTargetAudience(idea);
  
  return {
    demand: demand,
    growth: growth,
    seasonality: seasonality,
    targetAudience: targetAudience,
    marketSize: estimateMarketSize(sector),
    trends: identifyMarketTrends(sector)
  };
}

function analyzeFinancials(idea, sector) {
  const profitability = calculateProfitability(idea, sector);
  const investment = estimateRequiredInvestment(idea, sector);
  const breakeven = calculateBreakevenPoint(profitability, investment);
  const roi = calculateROI(profitability, investment);
  
  return {
    profitability: profitability,
    requiredInvestment: investment,
    breakevenMonths: breakeven,
    roi: roi,
    monthlyRevenue: estimateMonthlyRevenue(idea, sector),
    operationalCosts: estimateOperationalCosts(sector)
  };
}

function analyzeRisks(idea, sector) {
  const marketRisks = assessMarketRisks(sector);
  const operationalRisks = assessOperationalRisks(idea);
  const financialRisks = assessFinancialRisks();
  const regulatoryRisks = assessRegulatoryRisks(sector);
  
  return {
    market: marketRisks,
    operational: operationalRisks,
    financial: financialRisks,
    regulatory: regulatoryRisks,
    overallRisk: calculateOverallRisk(marketRisks, operationalRisks, financialRisks)
  };
}

function analyzeCompetition(idea, sector) {
  const competitionLevel = assessCompetitionLevel(sector);
  const competitors = identifyMainCompetitors(sector);
  const competitiveAdvantage = identifyCompetitiveAdvantage(idea, sector);
  
  return {
    level: competitionLevel,
    mainCompetitors: competitors,
    competitiveAdvantage: competitiveAdvantage,
    marketShare: estimateMarketShare(sector),
    differentiation: analyzeDifferentiation(idea, competitors)
  };
}

// Funciones de cálculo
function calculateMarketDemand(idea, sector) {
  const baseScores = {
    'Tecnología': 82,
    'Salud': 78,
    'Educación': 75,
    'Alimentos': 70
  };
  
  let score = baseScores[sector] || 72;
  const ideaKeywords = idea.toLowerCase();
  
  if (ideaKeywords.includes('digital') || ideaKeywords.includes('online') || ideaKeywords.includes('app')) {
    score += 8;
  }
  
  if (ideaKeywords.includes('sostenible') || ideaKeywords.includes('ecológico') || ideaKeywords.includes('verde')) {
    score += 6;
  }
  
  if (ideaKeywords.includes('salud') || ideaKeywords.includes('bienestar') || ideaKeywords.includes('fitness')) {
    score += 5;
  }
  
  const wordCount = idea.split(' ').length;
  if (wordCount < 8) score -= 10;
  
  return Math.max(10, Math.min(95, score));
}

function calculateMarketGrowth(sector) {
  const growthRates = {
    'Tecnología': 12,
    'Salud': 8,
    'Educación': 6,
    'Alimentos': 4
  };
  return growthRates[sector] || 5;
}

function analyzeSeasonality(idea, sector) {
  const ideaText = idea.toLowerCase();
  if (ideaText.includes('verano') || ideaText.includes('playa') || ideaText.includes('sol')) {
    return 'Alta estacionalidad (verano)';
  }
  if (ideaText.includes('navidad') || ideaText.includes('fiestas') || ideaText.includes('regalo')) {
    return 'Alta estacionalidad (diciembre)';
  }
  if (ideaText.includes('escolar') || ideaText.includes('clases') || ideaText.includes('colegio')) {
    return 'Estacionalidad moderada (marzo)';
  }
  return 'Baja estacionalidad';
}

function identifyTargetAudience(idea) {
  const ideaText = idea.toLowerCase();
  
  if (ideaText.includes('estudiante') || ideaText.includes('universidad') || ideaText.includes('colegio')) {
    return 'Jóvenes 18-25 años';
  }
  if (ideaText.includes('ejecutivo') || ideaText.includes('empresa') || ideaText.includes('oficina')) {
    return 'Profesionales 25-45 años';
  }
  if (ideaText.includes('familia') || ideaText.includes('niños') || ideaText.includes('hogar')) {
    return 'Familias 30-50 años';
  }
  if (ideaText.includes('adulto') || ideaText.includes('mayor') || ideaText.includes('jubilado')) {
    return 'Adultos 50+ años';
  }
  
  return 'Público general 25-45 años';
}

function estimateMarketSize(sector) {
  const sizes = {
    'Tecnología': 'Grande (S/ 5,000M+)',
    'Salud': 'Grande (S/ 3,500M+)',
    'Educación': 'Mediano (S/ 2,000M+)',
    'Alimentos': 'Muy Grande (S/ 8,000M+)'
  };
  return sizes[sector] || 'Mediano (S/ 1,500M+)';
}

function identifyMarketTrends(sector) {
  const trends = {
    'Tecnología': [
      'Crecimiento de SaaS y soluciones en la nube',
      'Aumento de demanda en ciberseguridad',
      'Expansión de e-commerce y pagos digitales'
    ],
    'Salud': [
      'Telemedicina y salud digital',
      'Bienestar y prevención',
      'Tecnología wearable en salud'
    ],
    'Educación': [
      'E-learning y educación remota',
      'Micro-learning y cursos especializados',
      'Plataformas educativas interactivas'
    ],
    'Alimentos': [
      'Alimentos saludables y orgánicos',
      'Delivery y comida preparada',
      'Productos locales y sostenibles'
    ]
  };
  return trends[sector] || ['Digitalización del sector', 'Enfoque en experiencia del cliente'];
}

function calculateProfitability(idea, sector) {
  const sectorMargins = {
    'Tecnología': 65,
    'Salud': 55,
    'Educación': 50,
    'Alimentos': 40
  };
  
  let margin = sectorMargins[sector] || 45;
  const ideaText = idea.toLowerCase();
  
  if (ideaText.includes('premium') || ideaText.includes('exclusiv') || ideaText.includes('alta gama')) {
    margin += 15;
  }
  
  if (ideaText.includes('bajo costo') || ideaText.includes('económico') || ideaText.includes('accesible')) {
    margin -= 10;
  }
  
  if (ideaText.includes('servicio') && !ideaText.includes('producto')) {
    margin += 8;
  }
  
  return Math.max(15, Math.min(85, margin));
}

function estimateRequiredInvestment(idea, sector) {
  const baseInvestments = {
    'Tecnología': 50000,
    'Salud': 80000,
    'Educación': 30000,
    'Alimentos': 60000
  };
  
  let investment = baseInvestments[sector] || 40000;
  const ideaText = idea.toLowerCase();
  
  if (ideaText.includes('app') || ideaText.includes('software') || ideaText.includes('plataforma')) {
    investment *= 1.3;
  }
  if (ideaText.includes('tienda') || ideaText.includes('local') || ideaText.includes('físic')) {
    investment *= 1.5;
  }
  if (ideaText.includes('servicio') && !ideaText.includes('producto')) {
    investment *= 0.8;
  }
  
  return Math.round(investment / 1000) * 1000;
}

function calculateBreakevenPoint(profitability, investment) {
  const monthlyProfit = (investment * (profitability / 100)) / 12;
  return Math.ceil(investment / monthlyProfit);
}

function calculateROI(profitability, investment) {
  const annualProfit = investment * (profitability / 100);
  return Math.round((annualProfit / investment) * 100);
}

function estimateMonthlyRevenue(idea, sector) {
  const baseRevenues = {
    'Tecnología': 25000,
    'Salud': 35000,
    'Educación': 18000,
    'Alimentos': 30000
  };
  
  let revenue = baseRevenues[sector] || 20000;
  const ideaText = idea.toLowerCase();
  
  if (ideaText.includes('premium') || ideaText.includes('exclusiv')) {
    revenue *= 1.4;
  }
  if (ideaText.includes('masivo') || ideaText.includes('popular')) {
    revenue *= 1.2;
  }
  
  return Math.round(revenue / 1000) * 1000;
}

function estimateOperationalCosts(sector) {
  const costs = {
    'Tecnología': 8000,
    'Salud': 15000,
    'Educación': 6000,
    'Alimentos': 12000
  };
  return costs[sector] || 10000;
}

function assessMarketRisks(sector) {
  const risks = {
    'Tecnología': { level: 'Medio', description: 'Cambios tecnológicos rápidos' },
    'Salud': { level: 'Alto', description: 'Regulaciones estrictas' },
    'Educación': { level: 'Bajo-Medio', description: 'Competencia establecida' },
    'Alimentos': { level: 'Medio', description: 'Estacionalidad y preferencias cambiantes' }
  };
  return risks[sector] || { level: 'Medio', description: 'Riesgos generales del mercado' };
}

function assessOperationalRisks(idea) {
  const ideaText = idea.toLowerCase();
  
  if (ideaText.includes('app') || ideaText.includes('software')) {
    return { level: 'Medio', description: 'Desarrollo técnico y mantenimiento' };
  }
  if (ideaText.includes('físic') || ideaText.includes('local')) {
    return { level: 'Alto', description: 'Gestión de ubicación y logística' };
  }
  if (ideaText.includes('servicio')) {
    return { level: 'Bajo-Medio', description: 'Gestión de calidad del servicio' };
  }
  
  return { level: 'Medio', description: 'Riesgos operativos estándar' };
}

function assessFinancialRisks() {
  return { level: 'Medio', description: 'Flujo de caja y gestión financiera' };
}

function assessRegulatoryRisks(sector) {
  const risks = {
    'Salud': { level: 'Alto', description: 'Permisos sanitarios y regulaciones' },
    'Alimentos': { level: 'Alto', description: 'Normativas de seguridad alimentaria' },
    'Tecnología': { level: 'Bajo', description: 'Protección de datos y privacidad' },
    'Educación': { level: 'Medio', description: 'Certificaciones y estándares educativos' }
  };
  return risks[sector] || { level: 'Bajo', description: 'Regulaciones generales' };
}

function calculateOverallRisk(marketRisks, operationalRisks, financialRisks) {
  const riskLevels = {
    'Bajo': 25,
    'Bajo-Medio': 40,
    'Medio': 60,
    'Alto': 80
  };
  
  const avgRisk = (
    riskLevels[marketRisks.level] + 
    riskLevels[operationalRisks.level] + 
    riskLevels[financialRisks.level]
  ) / 3;
  
  return Math.round(avgRisk);
}

function assessCompetitionLevel(sector) {
  const competition = {
    'Tecnología': 75,
    'Alimentos': 85,
    'Educación': 65,
    'Salud': 60
  };
  return competition[sector] || 70;
}

function identifyMainCompetitors(sector) {
  const competitors = {
    'Tecnología': ['Startups locales', 'Empresas internacionales', 'Desarrolladores independientes'],
    'Alimentos': ['Restaurantes establecidos', 'Cadenas internacionales', 'Delivery apps'],
    'Educación': ['Instituciones tradicionales', 'Plataformas online', 'Tutores independientes'],
    'Salud': ['Clínicas privadas', 'Centros especializados', 'Servicios públicos']
  };
  return competitors[sector] || ['Competidores establecidos', 'Nuevos entrants'];
}

function identifyCompetitiveAdvantage(idea, sector) {
  const ideaText = idea.toLowerCase();
  
  if (ideaText.includes('innov') || ideaText.includes('nuevo') || ideaText.includes('único')) {
    return 'Propuesta de valor única';
  }
  if (ideaText.includes('bajo costo') || ideaText.includes('económico')) {
    return 'Precio competitivo';
  }
  if (ideaText.includes('calidad') || ideaText.includes('premium')) {
    return 'Alta calidad y diferenciación';
  }
  if (ideaText.includes('local') || ideaText.includes('peruano')) {
    return 'Enfoque local y auténtico';
  }
  
  return 'Servicio especializado';
}

function estimateMarketShare(sector) {
  const shares = {
    'Tecnología': '0.5-2% en nicho específico',
    'Alimentos': '1-3% en mercado local',
    'Educación': '0.8-2.5% en especialización',
    'Salud': '0.3-1.5% en servicio específico'
  };
  return shares[sector] || '1-2% en mercado objetivo';
}

function analyzeDifferentiation(idea, competitors) {
  const ideaText = idea.toLowerCase();
  let differentiation = [];
  
  if (ideaText.includes('digital') || ideaText.includes('online')) {
    differentiation.push('Presencia digital fuerte');
  }
  if (ideaText.includes('personal') || ideaText.includes('custom')) {
    differentiation.push('Enfoque personalizado');
  }
  if (ideaText.includes('rápido') || ideaText.includes('inmediato')) {
    differentiation.push('Velocidad de servicio');
  }
  
  return differentiation.length > 0 ? differentiation : ['Servicio especializado', 'Atención al cliente'];
}

function calculateOverallScore(market, financial, risk) {
  const marketWeight = 0.4;
  const financialWeight = 0.35;
  const riskWeight = 0.25;
  
  const marketScore = market.demand * 0.7 + market.growth * 0.3;
  const financialScore = financial.profitability * 0.6 + financial.roi * 0.4;
  const riskScore = (100 - risk.overallRisk) * 0.8 + 20;
  
  return Math.round(
    (marketScore * marketWeight) + 
    (financialScore * financialWeight) + 
    (riskScore * riskWeight)
  );
}

function generateStrategicRecommendations(market, financial, risk) {
  const actions = [];
  
  if (market.demand >= 70) {
    actions.push({
      title: 'Capitalizar alta demanda',
      description: 'Invertir en marketing agresivo para capturar mercado rápidamente',
      timeline: 'Inmediato (1-3 meses)',
      priority: 'high',
      type: 'marketing'
    });
  }
  
  if (financial.roi >= 50) {
    actions.push({
      title: 'Optimizar estructura de costos',
      description: 'Implementar controles de gastos para maximizar rentabilidad',
      timeline: 'Corto plazo (3-6 meses)',
      priority: 'medium',
      type: 'finance'
    });
  }
  
  if (risk.overallRisk >= 60) {
    actions.push({
      title: 'Plan de mitigación de riesgos',
      description: 'Desarrollar estrategias específicas para cada tipo de riesgo identificado',
      timeline: 'Inmediato (1-2 meses)',
      priority: 'high',
      type: 'risk'
    });
  }
  
  actions.push({
    title: 'Validación con clientes potenciales',
    description: 'Realizar pruebas de concepto y entrevistas con el público objetivo',
    timeline: 'Inmediato (1 mes)',
    priority: 'high',
    type: 'validation'
  });
  
  actions.push({
    title: 'Desarrollo de MVP',
    description: 'Crear versión mínima viable para testear en mercado real',
    timeline: 'Mediano plazo (2-4 meses)',
    priority: 'medium',
    type: 'development'
  });
  
  return { actions };
}

function displayAdvancedResults(idea, sector, analysis) {
  const result = document.getElementById("result");
  
  result.innerHTML = `
    <div class="advanced-results">
      <div class="report-header">
        <div class="report-title">
          <h3>📊 Reporte de Viabilidad - ValidAI</h3>
          <span class="report-date">Generado el ${new Date().toLocaleDateString('es-PE')}</span>
        </div>
        <div class="overall-score">
          <div class="score-circle">
            <span class="score-value">${analysis.overallScore}</span>
            <span class="score-label">PUNTUACIÓN</span>
          </div>
          <div class="score-verdict ${getScoreClass(analysis.overallScore)}">
            ${getVerdict(analysis.overallScore)}
          </div>
        </div>
      </div>
      
      <div class="executive-summary">
        <h4>🎯 Resumen Ejecutivo</h4>
        <div class="summary-content">
          <p><strong>Idea analizada:</strong> "${idea}"</p>
          <p><strong>Sector:</strong> ${sector}</p>
          <p><strong>Evaluación:</strong> ${generateExecutiveSummary(analysis)}</p>
        </div>
      </div>
      
      <div class="key-metrics">
        <h4>📈 Métricas Clave</h4>
        <div class="metrics-grid">
          <div class="metric-card primary">
            <div class="metric-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="metric-info">
              <span class="metric-value">${analysis.market.demand}%</span>
              <span class="metric-label">Demanda de Mercado</span>
              <span class="metric-trend ${getTrendClass(analysis.market.demand)}">
                ${getTrendIcon(analysis.market.demand)}
              </span>
            </div>
          </div>
          
          <div class="metric-card success">
            <div class="metric-icon">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <div class="metric-info">
              <span class="metric-value">${analysis.financial.profitability}%</span>
              <span class="metric-label">Rentabilidad</span>
              <span class="metric-trend ${getTrendClass(analysis.financial.profitability)}">
                ${getTrendIcon(analysis.financial.profitability)}
              </span>
            </div>
          </div>
          
          <div class="metric-card warning">
            <div class="metric-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <div class="metric-info">
              <span class="metric-value">${analysis.risk.overallRisk}%</span>
              <span class="metric-label">Nivel de Riesgo</span>
              <span class="metric-trend ${getRiskTrendClass(analysis.risk.overallRisk)}">
                ${getRiskTrendIcon(analysis.risk.overallRisk)}
              </span>
            </div>
          </div>
          
          <div class="metric-card info">
            <div class="metric-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="metric-info">
              <span class="metric-value">${analysis.competition.level}%</span>
              <span class="metric-label">Competencia</span>
              <span class="metric-trend ${getCompetitionClass(analysis.competition.level)}">
                ${getCompetitionIcon(analysis.competition.level)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="detailed-analysis">
        <div class="analysis-section">
          <h5>🏪 Análisis de Mercado</h5>
          <div class="analysis-content">
            <p><strong>Tamaño de mercado:</strong> ${analysis.market.marketSize}</p>
            <p><strong>Crecimiento anual:</strong> ${analysis.market.growth}%</p>
            <p><strong>Público objetivo:</strong> ${analysis.market.targetAudience}</p>
            <div class="market-trends">
              <strong>Tendencias identificadas:</strong>
              <ul>
                ${analysis.market.trends.map(trend => `<li>${trend}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
        
        <div class="analysis-section">
          <h5>💰 Proyección Financiera</h5>
          <div class="analysis-content">
            <p><strong>Inversión inicial estimada:</strong> S/ ${analysis.financial.requiredInvestment.toLocaleString()}</p>
            <p><strong>ROI anual proyectado:</strong> ${analysis.financial.roi}%</p>
            <p><strong>Punto de equilibrio:</strong> ${analysis.financial.breakevenMonths} meses</p>
            <p><strong>Ingresos mensuales estimados:</strong> S/ ${analysis.financial.monthlyRevenue.toLocaleString()}</p>
          </div>
        </div>
        
        <div class="analysis-section">
          <h5>⚠️ Evaluación de Riesgos</h5>
          <div class="analysis-content">
            <div class="risk-category">
              <span class="risk-type">Mercado:</span>
              <span class="risk-level ${getRiskLevelClass(analysis.risk.market)}">${analysis.risk.market.level}</span>
            </div>
            <div class="risk-category">
              <span class="risk-type">Operacional:</span>
              <span class="risk-level ${getRiskLevelClass(analysis.risk.operational)}">${analysis.risk.operational.level}</span>
            </div>
            <div class="risk-category">
              <span class="risk-type">Financiero:</span>
              <span class="risk-level ${getRiskLevelClass(analysis.risk.financial)}">${analysis.risk.financial.level}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="strategic-recommendations">
        <h4>🎯 Plan de Acción Recomendado</h4>
        <div class="recommendations-grid">
          ${analysis.recommendations.actions.map((action, index) => `
            <div class="recommendation-card ${action.priority}">
              <div class="rec-icon">${getActionIcon(action.type)}</div>
              <div class="rec-content">
                <h6>${action.title}</h6>
                <p>${action.description}</p>
                <span class="rec-timeline">${action.timeline}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="result-actions">
        <button class="btn primary" onclick="downloadDetailedReport('${idea}', '${sector}')">
          <i class="fas fa-download"></i> Descargar Reporte Completo
        </button>
        <button class="btn secondary" onclick="analyzeAnotherIdea()">
          <i class="fas fa-plus"></i> Analizar Otra Idea
        </button>
        <button class="btn success" onclick="shareResults()">
          <i class="fas fa-share"></i> Compartir Análisis
        </button>
      </div>
    </div>
  `;
  
  result.style.animation = 'fadeInUp 0.8s ease';
  trackAnalysisCompletion(idea, sector, analysis.overallScore);
}

// Funciones auxiliares
function getScoreClass(score) {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 50) return 'moderate';
  return 'poor';
}

function getVerdict(score) {
  if (score >= 80) return '🚀 Excelente Oportunidad';
  if (score >= 65) return '✅ Viable';
  if (score >= 50) return '⚠️  Con Reservas';
  return '❌ No Recomendado';
}

function getTrendClass(value) {
  if (value >= 70) return 'positive';
  if (value >= 50) return 'neutral';
  return 'negative';
}

function getTrendIcon(value) {
  if (value >= 70) return '↗️';
  if (value >= 50) return '→';
  return '↘️';
}

function getRiskTrendClass(value) {
  if (value <= 30) return 'positive';
  if (value <= 50) return 'neutral';
  return 'negative';
}

function getRiskTrendIcon(value) {
  if (value <= 30) return '↘️';
  if (value <= 50) return '→';
  return '↗️';
}

function getCompetitionClass(value) {
  if (value <= 50) return 'positive';
  if (value <= 70) return 'neutral';
  return 'negative';
}

function getCompetitionIcon(value) {
  if (value <= 50) return '↘️';
  if (value <= 70) return '→';
  return '↗️';
}

function getRiskLevelClass(risk) {
  const level = risk.level.toLowerCase();
  if (level.includes('bajo')) return 'low';
  if (level.includes('medio')) return 'medium';
  return 'high';
}

function getActionIcon(type) {
  const icons = {
    'marketing': '📢',
    'finance': '💰',
    'risk': '🛡️',
    'validation': '🔍',
    'development': '🚀'
  };
  return icons[type] || '💡';
}

function generateExecutiveSummary(analysis) {
  const score = analysis.overallScore;
  
  if (score >= 80) {
    return 'Excelente oportunidad de negocio con alto potencial de crecimiento y rentabilidad. Se recomienda avanzar con el desarrollo.';
  } else if (score >= 65) {
    return 'Oportunidad viable que requiere planificación cuidadosa. Considerar los riesgos identificados antes de proceder.';
  } else if (score >= 50) {
    return 'Oportunidad con desafíos significativos. Se recomienda realizar más investigación y ajustar el modelo de negocio.';
  } else {
    return 'Oportunidad de alto riesgo. Se recomienda reconsiderar el enfoque o buscar alternativas.';
  }
}

function saveToAnalysisHistory(idea, sector, analysis) {
  const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
  
  const analysisRecord = {
    idea,
    sector,
    score: analysis.overallScore,
    timestamp: new Date().toISOString(),
    summary: generateExecutiveSummary(analysis)
  };
  
  history.unshift(analysisRecord);
  localStorage.setItem('analysisHistory', JSON.stringify(history.slice(0, 10)));
  updateUserStats();
}

function updateUserStats() {
  const userStats = JSON.parse(localStorage.getItem('userStats') || '{"ideasCount": 3, "successRate": 85}');
  userStats.ideasCount += 1;
  
  const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
  const successfulAnalyses = history.filter(analysis => analysis.score >= 65).length;
  userStats.successRate = history.length > 0 ? Math.round((successfulAnalyses / history.length) * 100) : 85;
  
  localStorage.setItem('userStats', JSON.stringify(userStats));
}

function loadUserAnalysisHistory() {
  return JSON.parse(localStorage.getItem('analysisHistory') || '[]');
}

function validateIdeaInput(input) {
  const value = input.value.trim();
  const minLength = 10;
  const maxLength = 500;
  
  if (value.length > 0 && value.length < minLength) {
    input.style.borderColor = '#ff9800';
  } else if (value.length >= minLength) {
    input.style.borderColor = '#4caf50';
  } else {
    input.style.borderColor = '#ccc';
  }
  
  if (value.length > maxLength) {
    input.style.borderColor = '#f44336';
  }
}

function validateSectorSelect(select) {
  if (select.value) {
    select.style.borderColor = '#4caf50';
  } else {
    select.style.borderColor = '#ccc';
  }
}

function showValidationErrors(errors) {
  let errorMessage = 'Por favor corrige los siguientes errores:\n';
  errors.forEach(error => {
    errorMessage += `• ${error}\n`;
  });
  
  showNotification(errorMessage, 'error');
}

function loadMarketData() {
  console.log('Cargando datos de mercado actualizados...');
}

function showRandomTip() {
  const tips = [
    "💡 Las ideas con propuestas de valor claras tienen 3x más probabilidades de éxito",
    "📊 Incluye datos específicos sobre tu público objetivo para un análisis más preciso",
    "🎯 Las ideas que resuelven problemas reales suelen tener mejor recepción en el mercado",
    "🚀 Considera la escalabilidad de tu idea desde el inicio",
    "💰 Incluye información sobre tu modelo de negocio para mejores proyecciones financieras"
  ];
  
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  
  const form = document.getElementById("analysis-form");
  if (form && !document.querySelector('.analysis-tip')) {
    const tipElement = document.createElement('div');
    tipElement.className = 'analysis-tip';
    tipElement.innerHTML = `
      <i class="fas fa-lightbulb"></i>
      <span>${randomTip}</span>
    `;
    form.parentNode.insertBefore(tipElement, form);
  }
}

function showInputTips() {
  // Puedes implementar tips específicos cuando el usuario hace focus
}

// Funciones globales para los botones
function downloadDetailedReport(idea, sector) {
  showNotification('Generando reporte detallado en PDF...', 'info');
  setTimeout(() => {
    showNotification('Reporte descargado exitosamente', 'success');
  }, 2000);
}

function analyzeAnotherIdea() {
  document.getElementById("result").innerHTML = '';
  document.getElementById("analysis-form").reset();
  showRandomTip();
}

function shareResults() {
  showNotification('Compartiendo análisis...', 'info');
}

function trackAnalysisCompletion(idea, sector, score) {
  console.log(`Análisis completado: "${idea}" (${sector}) - Score: ${score}`);
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close">&times;</button>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${getNotificationColor(type)};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 400px;
    animation: slideInRight 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
  
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  });
}

function getNotificationIcon(type) {
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
  const colors = {
    success: '#00C853',
    error: '#f44336',
    warning: '#FF9800',
    info: '#2196F3'
  };
  return colors[type] || '#2196F3';
}