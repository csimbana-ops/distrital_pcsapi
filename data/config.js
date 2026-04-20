/**
 * CAPA DE DATOS - CONFIGURACIÓN
 * Define valores reutilizables en todo el proyecto
 */

const CONFIG = {
  // Información del reporte
  report: {
    title: 'Reporte PCSAPI — Distrito 10',
    district: 'Distrito 10',
    week: '16 – 22 Mar 2026',
    methodology: 'Opción A',
    meta: 70,
    company: 'Little Caesars',
    credit: 'elaborado por gritsee'
  },

  // Colores del sistema
  colors: {
    red: '#D9291C',
    navy: '#0F1E2E',
    navy2: '#1A3A5C',
    green: '#1A7A34',
    amber: '#B8620A',
    blue: '#2980B9',
    border: '#DDE3EA',
    bg: '#F4F7FA',
    white: '#fff',
    text: '#1A202C',
    muted: '#6B7F93'
  },

  // Umbrales de calificación
  thresholds: {
    excellent: 80,    // Verde
    good: 70,         // Ámbar
    // >= good: Verde/Ámbar, < good: Rojo
    apoyo: {
      high: 70,       // Verde
      medium: 40      // Ámbar
      // < 40: Rojo
    }
  },

  // Pilares de evaluación
  pillars: {
    tiempos: {
      name: 'Tiempos',
      weight: '35%'
    },
    calidad: {
      name: 'Calidad',
      weight: '25%'
    },
    operativo: {
      name: 'Operativo',
      weight: '25%'
    },
    cobro: {
      name: 'Cobro',
      weight: '15%'
    }
  },

  // Configuración de gráficos
  charts: {
    doughnut: {
      cutout: '60%',
      type: 'doughnut'
    },
    bar: {
      borderRadius: 3,
      type: 'bar'
    },
    radar: {
      min: 0,
      max: 100,
      stepSize: 25,
      type: 'radar'
    }
  }
};
