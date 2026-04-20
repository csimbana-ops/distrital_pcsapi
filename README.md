# Reporte PCSAPI Distrito 10 — Arquitectura en Capas

## 📁 Estructura del Proyecto

```
D10/
├── index.html                          # HTML limpio (solo estructura)
│
├── data/                               # 📦 CAPA DE DATOS
│   ├── stores.js                       # Datos de sucursales
│   └── config.js                       # Configuración centralizada
│
├── logic/                              # 🧮 CAPA DE LÓGICA DE NEGOCIO
│   └── business-logic.js               # Calculs y reglas
│
├── ui/                                 # 🎨 CAPA DE PRESENTACIÓN
│   └── renderer.js                     # Renderizado de gráficos y DOM
│
├── styles/                             # 🎭 CAPA DE ESTILOS
│   └── main.css                        # Todos los estilos CSS
│
├── reporte_pcsapi_distrito10_final.html  # Versión monolítica (respaldo)
└── README.md                           # Este archivo
```

---

## 🏗️ Modelo de Capas

### **1. Capa de Datos** (`data/`)
- **Responsabilidad**: Almacenar datos sin lógica
- **Archivos**: 
  - `stores.js` - Array `STORES` con datos de 10 sucursales
  - `config.js` - `REPORT_CONFIG` con constantes
- **Dependencias**: Ninguna
- **Uso**: Proporciona datos crudos al resto de capas

```javascript
// data/stores.js
const STORES = [
  { name: "Abasolo", score: 80.43, pass: true, ... },
  ...
];
```

---

### **2. Capa de Lógica de Negocio** (`logic/`)
- **Responsabilidad**: Procesamiento y cálculos
- **Archivo**: `business-logic.js`
- **Contiene**:
  - Clase `BusinessLogic` con métodos de negocio
  - Cálculos: KPIs, promedios, transformaciones
  - Reglas: criterios de calificación, colores
- **Métodos principales**:
  - `getKPIs()` - Obtiene métricas principales
  - `getScoreColor(value)` - Retorna color según score
  - `getSortedByScore()` - Ordena sucursales
  - `getDistrictRadarData()` - Datos para gráficos
- **Ventaja**: Lógica sin dependencias del DOM ✅ Testeable
- **Uso**: `const bl = new BusinessLogic(STORES, META);`

---

### **3. Capa de Presentación** (`ui/`)
- **Responsabilidad**: Renderizar UI
- **Archivo**: `renderer.js`
- **Contiene**:
  - Clase `UIRenderer` con métodos de visualización
  - Renderizado de gráficos con Chart.js
  - Creación de tablas y tarjetas
  - Manipulación del DOM
- **Métodos principales**:
  - `init()` - Inicializa todo el reporte
  - `renderKPIs()` - Renderiza métricas
  - `renderStoreCards()` - Crea tarjetas de sucursales
  - `renderDoughnutChart()` - Gráfico de dona
- **Dependencias**: Chart.js, BusinessLogic
- **Uso**: `const ui = new UIRenderer(bl); ui.init();`

---

### **4. Capa de Estilos** (`styles/`)
- **Responsabilidad**: Presentación visual
- **Archivo**: `main.css`
- **Contiene**:
  - Variables CSS (colores, espaciado)
  - Clases reutilizables (`.kpi`, `.scard`, `.bp`, etc.)
  - Media queries responsive
- **Ventaja**: Mantenimiento centralizado de estilos

---

## 🚀 Flujo de Ejecución

```
index.html carga en orden:
    ↓
1. data/stores.js     → Crea STORES[]
    ↓
2. data/config.js     → Crea CONFIG{}
    ↓
3. logic/business-logic.js  → Instancia bl (BusinessLogic)
    ↓
4. ui/renderer.js     → Instancia ui (UIRenderer)
    ↓
5. Script inline      → DOMContentLoaded → ui.init()
    ↓
6. ui.init()          → Renderiza todo usando bl
```

---

## 📊 Ejemplo: Agregar una Nueva Sucursal

### Paso 1: Añadir datos en `data/stores.js`
```javascript
{
  name: "Nueva Sucursal",
  score: 75.5,
  pass: true,
  tiempos: 80.0,
  // ... resto de datos
}
```

### Paso 2: ¡Listo!
- BusinessLogic recalculará automáticamente todos los KPIs
- UIRenderer re-renderizará gráficos y tablas
- **No hay que tocar lógica ni presentación**

---

## 🔄 Beneficios de la Arquitectura en Capas

| Aspecto | Beneficio |
|--------|----------|
| **Mantenimiento** | Cambios en datos no afectan presentación |
| **Testing** | BusinessLogic es 100% testeable sin DOM |
| **Escalabilidad** | Fácil reutilizar para otros distritos |
| **Colaboración** | Teams pueden trabajar en paralelo en diferentes capas |
| **Rendimiento** | Modularidad permite optimizaciones |
| **Reutilización** | Componentes independientes por responsabilidad |
| **Claridad** | Estructura de carpetas identifica responsabilidades |

---

## 🔧 Cómo Usar

### Opción 1: Archivo nuevo (RECOMENDADO)
```bash
# Abrir en navegador:
index.html  # Nueva estructura modular con carpetas
```

### Opción 2: Versión monolítica (Original)
```bash
# Versión anterior (todo en un archivo):
reporte_pcsapi_distrito10_final.html
```

---

## 📝 Checklist de Funcionalidad

✅ Todos los KPIs funcionan igual  
✅ Gráficos (dona, barras, radares) idénticos  
✅ Tabla scorecard completa  
✅ Tarjetas de sucursales con radares  
✅ Colores y criterios de calificación preservados  
✅ Responsive design mantenido  
✅ **CERO pérdida de funcionalidad**

---

## 🛣️ Roadmap Futuro

- [ ] Tests unitarios para BusinessLogic
- [ ] Filtros interactivos (fecha, rango de score)
- [ ] Export a PDF
- [ ] API de datos remota
- [ ] Componentes Web (Web Components)
- [ ] Framework (Vue/React)
- [ ] Modo oscuro

---

## 📞 Soporte

Si encuentras problemas:
1. Verifica orden de carga de scripts en `index.html`
2. Abre DevTools (F12) → Console para errores
3. Asegúrate que Chart.js esté disponible
4. Valida rutas de carpetas

---

**Última actualización**: 20 de Abril de 2026  
**Versión**: 2.1 (Arquitectura en Capas + Organización de Carpetas)
