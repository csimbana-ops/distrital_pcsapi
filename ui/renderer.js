/**
 * CAPA DE PRESENTACIÓN / UI
 * Renderiza todos los gráficos, tablas y componentes visuales
 */

class UIRenderer {
  constructor(businessLogic) {
    this.bl = businessLogic;
  }

  /**
   * Inicializa la renderización del reporte completo
   */
  init() {
    this.renderHeader();
    this.renderKPIs();
    this.renderGeneralScorecard();
    this.renderDistrictMatrix();
    this.renderStoreCards();
  }

  /**
   * Renderiza el encabezado con metadata
   */
  renderHeader() {
    const kpis = this.bl.getKPIs();
    const metaEl = document.getElementById('meta-count');
    if (metaEl) {
      metaEl.textContent = kpis.total;
    }
  }

  /**
   * Renderiza los KPIs principales
   */
  renderKPIs() {
    const kpis = this.bl.getKPIs();

    const elements = {
      'kpi-total': kpis.total,
      'kpi-avg': kpis.average,
      'kpi-pass': `${kpis.passed}/${kpis.total}`,
      'kpi-fail': kpis.failed
    };

    Object.entries(elements).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });
  }

  /**
   * Renderiza el scorecard general (gráficos + tabla)
   */
  renderGeneralScorecard() {
    this.renderBarChart();
    this.renderScorecardTable();
    this.renderTimingRankingTable();
  }

  /**
   * Crea el gráfico de dona (pass/fail)
   */
  renderDoughnutChart() {
    const el = document.getElementById('donaChart');
    if (!el) return;

    const data = this.bl.getDoughnutChartData();
    const total = data.total;

    new Chart(el, {
      type: 'doughnut',
      data: {
        labels: ['Pasan', 'Fallan'],
        datasets: [{
          data: [data.passed, data.failed],
          backgroundColor: ['#0F1E2E', '#D9291C'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { size: 10 }, padding: 8 }
          },
          tooltip: {
            callbacks: {
              label: (c) =>
                `${c.label}: ${c.raw} (${((c.raw / total) * 100).toFixed(1)}%)`
            }
          }
        }
      }
    });
  }

  /**
   * Crea el gráfico de barras (ranking por sucursal)
   */
  renderBarChart() {
    const el = document.getElementById('barChart');
    if (!el) return;

    const data = this.bl.getBarChartData();

    new Chart(el, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.scores,
          backgroundColor: data.colors,
          borderRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: { font: { size: 9 }, maxRotation: 30 },
            grid: { display: false }
          },
          y: {
            min: 0,
            max: 100,
            ticks: { font: { size: 9 } },
            grid: { color: 'rgba(0,0,0,0.05)' }
          }
        }
      }
    });
  }

  /**
   * Renderiza la tabla de scorecard
   */
  renderScorecardTable() {
    const tb = document.getElementById('sc-tbody');
    if (!tb) return;

    tb.innerHTML = '';
    const tableData = this.bl.getScoreCardTableData();

    tableData.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><a href="#${s.anchor}" style="color:var(--navy);text-decoration:none">${s.name}</a></td>
        <td><b>${s.nivel_sucursal}</b></td>
        <td style="background:${s.scoreBgColor}"><b style="color:${s.scoreColor}">${s.scoreDisplay}</b></td>
        <td style="color:${s.calidadColor};font-weight:600">${s.calidadDisplay}%</td>
        <td style="color:${s.operativoColor};font-weight:600">${s.operativoDisplay}%</td>
        <td style="color:${s.cobroColor};font-weight:600">${s.cobroDisplay}%</td>
        <td style="color:${s.apoyoColor};font-weight:700">${s.apoyo}%</td>
      `;
      tb.appendChild(tr);
    });
  }

  /**
   * Renderiza tabla comparativa de tiempos
   */
  renderTimingRankingTable() {
    const tb = document.getElementById('timing-tbody');
    if (!tb) return;

    tb.innerHTML = '';
    const tableData = this.bl.getTimingRankingData();

    tableData.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.rank}</td>
        <td><b>${s.name}</b></td>
        <td>${s.nivel_sucursal}</td>
        <td style="color:${s.tiemposColor};font-weight:700">${s.tiempos}%</td>
        <td>${s.comida}%</td>
        <td>${s.cena}%</td>
        <td>${s.drive}%</td>
        <td>${s.seg}s</td>
        <td><span class="time-focus">${s.focusLabel}: ${s.focusValue}%</span></td>
      `;
      tb.appendChild(tr);
    });
  }

  /**
   * Renderiza la matriz de desempeño (radar del distrito)
   */
  renderDistrictMatrix() {
    const el = document.getElementById('radarDistrito');
    if (!el) return;

    const radarData = this.bl.getDistrictRadarData();

    new Chart(el, {
      type: 'radar',
      data: {
        labels: radarData.labels,
        datasets: [{
          data: radarData.values,
          backgroundColor: 'rgba(41,128,185,0.18)',
          borderColor: '#2980B9',
          pointBackgroundColor: '#2980B9',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { font: { size: 8 }, stepSize: 25 },
            pointLabels: { font: { size: 10 } }
          }
        }
      }
    });
  }

  /**
   * Renderiza las tarjetas de sucursales
   */
  renderStoreCards() {
    const gc = document.getElementById('store-cards');
    if (!gc) return;

    gc.innerHTML = '';
    this.bl.getSortedStores().forEach((store, idx) => {
      const card = this.createStoreCard(store, idx);
      gc.appendChild(card);
      this.renderStoreRadar(store, idx);
    });
  }

  /**
   * Crea un elemento DOM para una tarjeta de sucursal
   */
  createStoreCard(store, idx) {
    const div = document.createElement('div');
    div.className = 'scard';
    div.id = `c-${this.bl.slugify(store.name)}`;

    const pillars = this.bl.getStorePillars(store);
    const tableSections = pillars
      .map(sec => this.createPillarTable(sec))
      .join('');

    const scoreColor = this.bl.getScoreColor(store.score);
    const scoreBgColor = this.bl.getScoreBgColor(store.score);
    const apoyoColor = this.bl.getApoyoColor(store.apoyo);

    div.innerHTML = `
      <div class="scard-head ${store.pass ? 'pass' : 'fail'}">
        <div>
          <div class="scard-name">${store.name}</div>
          <div class="scard-meta">
            Apoyo al cajero: <b>${store.apoyo}%</b> &nbsp;·&nbsp; 
            Prom. cajeros: <b>${store.cajeros.toFixed(2)}</b><br>
            Calidad: <b>${store.crit}</b> &nbsp;·&nbsp; Nivel: <b>${store.nivel_sucursal}</b>
          </div>
        </div>
        <div style="text-align:right">
          <div class="scard-score" style="color:${scoreColor}">${this.bl.roundValue(store.score)}</div>
        </div>
      </div>
      <div class="scard-body">
        <div class="scard-tbl">
          <table class="ptbl">
            ${tableSections}
          </table>
        </div>
        <div class="scard-radar">
          <div style="position:relative;width:170px;height:155px;">
            <canvas id="r${idx}"></canvas>
          </div>
        </div>
      </div>
    `;

    return div;
  }

  /**
   * Crea una tabla de pilar dentro de una tarjeta
   */
  createPillarTable(sec) {
    return `
      <thead>
        <tr>
          <th>${sec.headers[0]}</th>
          <th>${sec.headers[1]}</th>
          <th>${sec.headers[2]}</th>
          <th>${sec.headers[3]}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${sec.values[0]}</td>
          <td>${sec.values[1]}</td>
          <td>${sec.values[2]}</td>
          <td>${sec.values[3]}</td>
        </tr>
      </tbody>
    `;
  }

  /**
   * Renderiza el radar para una sucursal
   */
  renderStoreRadar(store, idx) {
    const el = document.getElementById(`r${idx}`);
    if (!el) return;

    const radarData = this.bl.getStoreRadarData(store);
    const bgColor = store.pass
      ? 'rgba(26,122,52,0.15)'
      : 'rgba(192,57,43,0.12)';
    const borderColor = store.pass ? '#1A7A34' : '#C0392B';

    new Chart(el, {
      type: 'radar',
      data: {
        labels: radarData.labels,
        datasets: [{
          data: radarData.values,
          backgroundColor: bgColor,
          borderColor: borderColor,
          pointBackgroundColor: borderColor,
          borderWidth: 2,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              font: { size: 7 },
              stepSize: 50,
              display: false
            },
            pointLabels: { font: { size: 8 } },
            grid: { color: 'rgba(0,0,0,0.07)' },
            angleLines: { color: 'rgba(0,0,0,0.07)' }
          }
        }
      }
    });
  }
}

// Instancia global del renderer
const ui = new UIRenderer(bl);
