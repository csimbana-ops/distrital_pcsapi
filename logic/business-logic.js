/**
 * CAPA DE LÓGICA DE NEGOCIO
 * Contiene cálculos, transformaciones y reglas de negocio
 */

class BusinessLogic {
  constructor(stores, meta) {
    this.stores = stores;
    this.meta = meta;
  }

  /**
   * Obtiene el total de sucursales
   */
  getTotal() {
    return this.stores.length;
  }

  /**
   * Obtiene cantidad de sucursales aprobadas
   */
  getPassed() {
    return this.stores.filter(s => s.pass).length;
  }

  /**
   * Calcula el promedio de score del distrito
   */
  getAverageScore() {
    const sum = this.stores.reduce((a, s) => a + s.score, 0);
    return (sum / this.getTotal()).toFixed(1);
  }

  /**
   * Obtiene cantidad de sucursales reprobadas
   */
  getFailed() {
    return this.getTotal() - this.getPassed();
  }

  /**
   * Retorna color según criterio de score
   */
  getScoreColor(value) {
    if (value >= 80) return '#1A7A34'; // Verde
    if (value >= 70) return '#B8620A'; // Ámbar
    return '#A32D2D'; // Rojo
  }

  /**
   * Retorna color de fondo según criterio de score
   */
  getScoreBgColor(value) {
    if (value >= 80) return '#EAF5ED'; // Verde claro
    if (value >= 70) return '#FFF8EC'; // Ámbar claro
    return '#FEF0EF'; // Rojo claro
  }

  /**
   * Convierte texto a slug para URLs
   */
  slugify(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-');
  }

  /**
   * Ordena sucursales por score descendente
   */
  getSortedByScore() {
    return [...this.stores].sort((a, b) => b.score - a.score);
  }

  /**
   * Calcula promedio de un atributo en todas las sucursales
   */
  getAttributeAverage(attribute) {
    const sum = this.stores.reduce((a, s) => a + s[attribute], 0);
    return +(sum / this.getTotal()).toFixed(1);
  }

  /**
   * Obtiene color para el indicador de apoyo al cajero
   */
  getApoyoColor(apoyo) {
    if (apoyo >= 70) return '#1A7A34'; // Verde
    if (apoyo >= 40) return '#B8620A'; // Ámbar
    return '#A32D2D'; // Rojo
  }

  /**
   * Genera datos para el radar de cada sucursal
   */
  getStoreRadarData(store) {
    return {
      labels: ['Tiempos', 'Calidad', 'Oper.', 'Cobro', 'Apoyo'],
      values: [
        store.tiempos,
        store.calidad,
        store.operativo,
        store.cobro,
        Math.min(store.apoyo, 100)
      ]
    };
  }

  /**
   * Obtiene datos para el radar del distrito
   */
  getDistrictRadarData() {
    return {
      labels: ['Tiempos', 'Calidad', 'Operativo', 'Cobro', 'Apoyo'],
      values: [
        this.getAttributeAverage('tiempos'),
        this.getAttributeAverage('calidad'),
        this.getAttributeAverage('operativo'),
        this.getAttributeAverage('cobro'),
        this.getAttributeAverage('apoyo')
      ]
    };
  }

  /**
   * Calcula estadísticas generales
   */
  getKPIs() {
    return {
      total: this.getTotal(),
      passed: this.getPassed(),
      failed: this.getFailed(),
      average: this.getAverageScore()
    };
  }

  /**
   * Obtiene datos para gráfico de dona (pass/fail)
   */
  getDoughnutChartData() {
    return {
      passed: this.getPassed(),
      failed: this.getFailed(),
      total: this.getTotal()
    };
  }

  /**
   * Obtiene datos para gráfico de barras
   */
  getBarChartData() {
    const sorted = this.getSortedByScore();
    return {
      labels: sorted.map(s =>
        s.name.length > 14 ? s.name.split(' ')[0] : s.name
      ),
      scores: sorted.map(s => +s.score.toFixed(1)),
      colors: sorted.map(s => {
        if (s.nivel_sucursal === 2) return '#2980B9';    // Azul - Nivel 2
        if (s.nivel_sucursal === 3) return '#B8620A';    // Naranja - Nivel 3
        return '#A32D2D';                                 // Rojo - Nivel 4
      }),
      stores: sorted
    };
  }

  /**
   * Prepara datos para tabla scorecard
   */
  getScoreCardTableData() {
    return this.getSortedByScore().map(s => ({
      ...s,
      anchor: `c-${this.slugify(s.name)}`,
      scoreColor: this.getScoreColor(s.score),
      scoreBgColor: this.getScoreBgColor(s.score),
      tiemposColor: this.getScoreColor(s.tiempos),
      calidadColor: this.getScoreColor(s.calidad),
      operativoColor: this.getScoreColor(s.operativo),
      cobroColor: this.getScoreColor(s.cobro),
      apoyoColor: this.getApoyoColor(s.apoyo)
    }));
  }

  /**
   * Prepara datos de pilares para tarjeta de sucursal
   */
  getStorePillars(store) {
    return [
      {
        title: 'Tiempos (35%)',
        score: store.tiempos,
        headers: ['Rush comida', 'Rush cena', 'Drive', 'Tiempo prom'],
        values: [
          `${store.td.comida.toFixed(2)}%`,
          `${store.td.cena.toFixed(2)}%`,
          `${store.td.drive.toFixed(2)}%`,
          `${store.td.seg}s`
        ]
      },
      {
        title: 'Calidad (25%)',
        score: store.calidad,
        headers: ['Aprobadas', 'Burbujas', 'Distribución', 'Horneado'],
        values: [
          `${store.cd.aprobadas.toFixed(2)}%`,
          `${store.cd.burbujas.toFixed(2)}%`,
          `${store.cd.distrib.toFixed(2)}%`,
          `${store.cd.horneado.toFixed(2)}%`
        ]
      },
      {
        title: 'Operativo (25%)',
        score: store.operativo,
        headers: ['Limpieza', 'Calidad vestido', 'Sheetout', 'Etiquetado'],
        values: [
          store.od.limVest != null ? `${store.od.limVest.toFixed(0)}%` : '—',
          store.od.calVest != null ? `${store.od.calVest.toFixed(0)}%` : '—',
          store.od.sheet != null ? `${store.od.sheet.toFixed(0)}%` : '—',
          store.od.etiq != null ? `${store.od.etiq.toFixed(0)}%` : '—'
        ]
      },
      {
        title: 'Cobro (15%)',
        score: store.cobro,
        headers: ['Transacc. OK', 'Aperturas', 'Ticket no ent.', ''],
        values: [
          `${store.cod.ok.toFixed(2)}%`,
          `${store.cod.apertura.toFixed(2)}%`,
          `${store.cod.ticket.toFixed(2)}%`,
          ''
        ]
      }
    ];
  }
}

// Instancia global de lógica de negocio
const bl = new BusinessLogic(STORES, REPORT_CONFIG.META);
