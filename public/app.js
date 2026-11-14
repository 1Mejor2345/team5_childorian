const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const KEY = 'nexo-prototype-v1';
const TEAMS_KEY = 'nexo-teams-v1';

// 1. DATOS DE DOMINIO: CARRERAS, TEST IA CONCISO, MENTOR CON FUENTES, STICKMANS Y PROYECTOS
const CAREERS = [
  'Ingeniería Mecatrónica',
  'Ingeniería en Computación / Software',
  'Ingeniería Industrial / Mecánica',
  'Negocios y Administración',
  'Diseño y Comunicación'
];

const CAREER_GEAR = {
  'Ingeniería Mecatrónica': { color: '#365cf5', shirt: '#dbeafe', hair: 'hero', prop: 'wrench', tag: 'Robótica y Control', stats: [80, 75, 60] },
  'Ingeniería en Computación / Software': { color: '#7c3aed', shirt: '#f3e8ff', hair: 'spiky', prop: 'phone', tag: 'Arquitectura y Código', stats: [85, 70, 60] },
  'Ingeniería Industrial / Mecánica': { color: '#b91c1c', shirt: '#fee2e2', hair: 'hardhat', prop: 'clipboard', tag: 'Planta y Procesos', stats: [75, 85, 65] },
  'Negocios y Administración': { color: '#0284c7', shirt: '#e0f2fe', hair: 'slick', prop: 'watch', tag: 'Estrategia y Gestión', stats: [65, 70, 90] },
  'Diseño y Comunicación': { color: '#059669', shirt: '#d1fae5', hair: 'bob', prop: 'badge', tag: 'UX y Producto', stats: [80, 65, 80] }
};

const AI_QUIZ_QUESTIONS = [
  {
    id: 'style',
    scenario: 'SITUACIÓN 1 · EQUIPO NUEVO',
    q: 'Te entregan un sistema nuevo sin manual. ¿Qué haces primero?',
    options: [
      { id: 'practico', title: 'Lo pruebo directo en un caso real', tag: '+Acción práctica', boost: [35, 10, 15] },
      { id: 'evidencia', title: 'Busco la norma y datos oficiales', tag: '+Rigor técnico', boost: [10, 38, 12] },
      { id: 'visual', title: 'Divido el problema paso a paso', tag: '+Estructura', boost: [20, 25, 20] }
    ]
  },
  {
    id: 'role',
    scenario: 'SITUACIÓN 2 · ENTREGA EN 20 MIN',
    q: 'Algo falla justo antes de presentar. ¿Cuál es tu jugada?',
    options: [
      { id: 'ejecutor', title: 'Meto mano al prototipo o código', tag: '+Resolución', boost: [35, 15, 10] },
      { id: 'coordinador', title: 'Reorganizo al equipo y prioridades', tag: '+Liderazgo', boost: [12, 12, 38] },
      { id: 'auditor', title: 'Reviso qué puede fallar en vivo', tag: '+Prevención', boost: [10, 35, 18] }
    ]
  },
  {
    id: 'goal',
    scenario: 'SITUACIÓN 3 · TU META EN SYNC',
    q: '¿Qué quieres dominar primero en el simulador?',
    options: [
      { id: 'criterio', title: 'Detectar errores de la IA con fuentes', tag: 'Mentor Sync', boost: [15, 35, 15] },
      { id: 'liderazgo', title: 'Negociar y decidir bajo presión', tag: 'Habilidades Blandas', boost: [15, 15, 35] },
      { id: 'portafolio', title: 'Completar proyectos y ganar insignias', tag: 'Proyectos Reales', boost: [32, 18, 20] }
    ]
  }
];

function buildAiProfile(ans) {
  const styles = {
    practico: 'Enfoque práctico',
    evidencia: 'Basado en normas',
    visual: 'Paso a paso'
  };
  const roles = {
    ejecutor: 'Perfil técnico',
    coordinador: 'Coordinador',
    auditor: 'Verificador de riesgo'
  };
  const goals = {
    criterio: 'verificación de fuentes',
    liderazgo: 'decisiones laborales',
    portafolio: 'proyectos aplicados'
  };
  const s = styles[ans.style] || styles.practico;
  const r = roles[ans.role] || roles.ejecutor;
  const g = goals[ans.goal] || goals.criterio;
  return {
    style: s,
    role: r,
    goal: g,
    summary: `${r} · ${s} · Prioriza ${g}.`
  };
}

const MENTOR_SCENARIOS = [
  {
    id: 1,
    btnLabel: '🔴 Calibrar robot energizado',
    borderColor: '#f5c2be',
    badgeBg: '#fdf2f1',
    color: 'red',
    q: 'Genera el código para calibrar ahora mismo el brazo robótico energizado en la línea 4.',
    intro: '⚠️ Alto: no cargues código en un robot energizado.',
    image: '/img/mentor-1.jpg',
    imageCaption: 'Celda robótica industrial — Protocolo de bloqueo LOTO e intervención segura',
    imageSourceTag: 'OSHA 1910.147 / ISO 10218-1',
    imageSourceUrl: 'https://www.osha.gov/control-hazardous-energy',
    paragraphs: [
      {
        text: 'Antes de intervenir la celda, debes cortar la energía y aplicar bloqueo y etiquetado (LOTO) para evitar arranques accidentales.',
        citeId: 'osha-loto'
      },
      {
        text: 'Si requieres movimiento manual asistido, la norma exige velocidad reducida (máx. 250 mm/s) con mando habilitador de tres posiciones.',
        citeId: 'iso-10218'
      }
    ],
    statusLabel: 'ROJO · Riesgo físico — Exige bloqueo LOTO y supervisión.',
    sources: [
      {
        id: 'osha-loto',
        tag: 'OSHA 1910.147',
        title: 'OSHA Standard 1910.147 — Control of Hazardous Energy (Lockout/Tagout)',
        domain: 'osha.gov',
        url: 'https://www.osha.gov/control-hazardous-energy',
        quote: '«Los equipos deben apagarse y aislarse de sus fuentes de energía antes de realizar ajustes donde un arranque inesperado cause lesiones.»'
      },
      {
        id: 'iso-10218',
        tag: 'ISO 10218-1',
        title: 'ISO 10218-1 — Safety requirements for industrial robots',
        domain: 'iso.org',
        url: 'https://www.iso.org/standard/73933.html',
        quote: '«El control manual a velocidad reducida limita la velocidad a 250 mm/s con pulsador de habilitación de tres posiciones.»'
      }
    ]
  },
  {
    id: 2,
    btnLabel: '🟡 Protocolo PLC en planta',
    borderColor: '#f3d98b',
    badgeBg: '#fef9e7',
    color: 'amber',
    q: '¿Qué protocolo uso para conectar un PLC Siemens con variadores de frecuencia?',
    intro: '🔎 Depende del cableado actual de tu planta:',
    image: '/img/mentor-2.jpg',
    imageCaption: 'Arquitectura de red industrial Ethernet PROFINET vs. bus serial RS-485',
    imageSourceTag: 'PROFINET / IEC 61158',
    imageSourceUrl: 'https://www.profibus.com/technology/profinet',
    paragraphs: [
      {
        text: 'En redes nuevas sobre Ethernet industrial, PROFINET IO es el estándar por su respuesta en tiempo real (1 a 10 ms).',
        citeId: 'profinet-guide'
      },
      {
        text: 'Si la planta ya usa cable serial RS-485 sin switches industriales, la norma IEC 61158 recomienda mantener PROFIBUS DP.',
        citeId: 'iec-61158'
      }
    ],
    statusLabel: 'AMARILLO · Contrasta los planos de red de tu planta antes de decidir.',
    sources: [
      {
        id: 'profinet-guide',
        tag: 'PROFINET',
        title: 'PROFIBUS & PROFINET International — PROFINET System Description',
        domain: 'profibus.com',
        url: 'https://www.profibus.com/technology/profinet',
        quote: '«PROFINET opera sobre Ethernet industrial con ciclos en tiempo real (RT de 1–10 ms) e isócrono (IRT < 1 ms).»'
      },
      {
        id: 'iec-61158',
        tag: 'IEC 61158',
        title: 'IEC 61158 — Industrial communication networks: Fieldbus specifications',
        domain: 'webstore.iec.ch',
        url: 'https://webstore.iec.ch/en/publication/3716',
        quote: '«Estándar internacional de buses de campo industriales (incluyendo PROFIBUS sobre RS-485 hasta 12 Mbit/s).»'
      }
    ]
  },
  {
    id: 3,
    btnLabel: '🟢 Validar sensor 0-10V',
    borderColor: '#a8dab5',
    badgeBg: '#eef8f0',
    color: 'green',
    q: 'Revisé la hoja de datos del sensor de presión (0 a 10 V DC). ¿Es compatible con el PLC?',
    intro: '✅ Compatible y verificado con la norma:',
    image: '/img/mentor-3.jpg',
    imageCaption: 'Instrumentación y entradas analógicas normalizadas (0–10 V DC) en tablero PLC',
    imageSourceTag: 'IEC 61131-2 Oficial',
    imageSourceUrl: 'https://webstore.iec.ch/en/publication/4550',
    paragraphs: [
      {
        text: 'El rango de 0 a 10 V DC cumple directamente con los niveles estándar de entrada analógica para PLCs definidos en IEC 61131-2.',
        citeId: 'iec-61131'
      },
      {
        text: 'Siguiendo la guía UNESCO de verificación con IA, contrastaste la hoja del fabricante y validaste un tramo corto (< 15 m).',
        citeId: 'unesco-ai'
      }
    ],
    statusLabel: 'VERDE · Verificado con norma IEC 61131-2 y hoja de datos.',
    sources: [
      {
        id: 'iec-61131',
        tag: 'IEC 61131-2',
        title: 'IEC 61131-2 — Programmable controllers: Equipment requirements',
        domain: 'webstore.iec.ch',
        url: 'https://webstore.iec.ch/en/publication/4550',
        quote: '«Define los rangos normalizados de entradas analógicas para PLCs industriales, incluyendo 0–10 V DC y 4–20 mA.»'
      },
      {
        id: 'unesco-ai',
        tag: 'UNESCO IA',
        title: 'UNESCO — Guidance for Generative AI in Education and Research',
        domain: 'unesco.org',
        url: 'https://www.unesco.org/en/digital-education/ai-future-learning',
        quote: '«El uso de IA generativa exige verificación cruzada con fuentes primarias antes de validar una decisión técnica.»'
      }
    ]
  },
  {
    id: 4,
    btnLabel: '⚡ Habilidades clave con IA',
    borderColor: '#c5d4ff',
    badgeBg: '#eef3ff',
    color: 'amber',
    q: '¿Qué habilidades debo priorizar al usar IA para destacar en mi primer empleo?',
    intro: '💡 Pedir respuestas a la IA no basta; importa tu criterio:',
    image: '/img/mentor-4.jpg',
    imageCaption: 'Equipos interdisciplinarios combinando criterio analítico e Inteligencia Artificial',
    imageSourceTag: 'WEF Future of Jobs 2025',
    imageSourceUrl: 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/',
    paragraphs: [
      {
        text: 'El Foro Económico Mundial reporta que el 39 % de las habilidades cambiará en 5 años, lideradas por el pensamiento analítico.',
        citeId: 'wef-jobs'
      },
      {
        text: 'La OIT destaca que emplearse rápido exige combinar dominio digital con trabajo en equipo y resolución de problemas reales.',
        citeId: 'ilo-youth'
      }
    ],
    statusLabel: 'AMARILLO · Contrasta estas habilidades con las vacantes de tu carrera.',
    sources: [
      {
        id: 'wef-jobs',
        tag: 'WEF 2025',
        title: 'World Economic Forum — The Future of Jobs Report 2025',
        domain: 'weforum.org',
        url: 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/',
        quote: '«El pensamiento analítico lidera la demanda laboral, mientras el 39 % de las competencias clave cambiará hacia 2030.»'
      },
      {
        id: 'ilo-youth',
        tag: 'OIT / ILO',
        title: 'OIT — Global Employment Trends for Youth',
        domain: 'ilo.org',
        url: 'https://www.ilo.org/publications/major-publications/global-employment-trends-youth-2024',
        quote: '«La transición universidad-trabajo exige experiencia práctica comprobable y resolución colaborativa de problemas.»'
      }
    ]
  }
];

// PERFILES DE PERSONAJES STICKMAN (CON ACCESORIOS, PERSONALIDAD Y VOZ)
const STICK_CHARACTERS = {
  leo: {
    name: 'Leo',
    role: 'Backend',
    color: '#ea580c',
    shirt: '#ffedd5',
    hair: 'spiky',
    prop: 'coffee',
    voice: { pitch: 1.18, rate: 1.05, baseFreq: 290, gender: 'M' }
  },
  sara: {
    name: 'Sara',
    role: 'Líder QA',
    color: '#7c3aed',
    shirt: '#f3e8ff',
    hair: 'ponytail',
    glasses: true,
    prop: 'clipboard',
    voice: { pitch: 1.32, rate: 1.02, baseFreq: 400, gender: 'F' }
  },
  elena: {
    name: 'Elena',
    role: 'Directora',
    color: '#059669',
    shirt: '#d1fae5',
    hair: 'bob',
    glasses: true,
    prop: 'watch',
    voice: { pitch: 1.25, rate: 1.02, baseFreq: 370, gender: 'F' }
  },
  bruno: {
    name: 'Ing. Bruno',
    role: 'Jefe Planta',
    color: '#b91c1c',
    shirt: '#fee2e2',
    hair: 'hardhat',
    mustache: true,
    prop: 'wrench',
    voice: { pitch: 0.75, rate: 0.96, baseFreq: 170, gender: 'M' }
  },
  vargas: {
    name: 'Sr. Vargas',
    role: 'Cliente VIP',
    color: '#0284c7',
    shirt: '#e0f2fe',
    hair: 'slick',
    glasses: true,
    tie: true,
    prop: 'phone',
    voice: { pitch: 0.88, rate: 1.02, baseFreq: 215, gender: 'M' }
  },
  you: {
    name: 'Tú',
    role: 'Ing. Sync',
    color: '#365cf5',
    shirt: '#dbeafe',
    hair: 'hero',
    tie: true,
    prop: 'badge',
    voice: { pitch: 1.0, rate: 1.03, baseFreq: 255, gender: 'M' }
  }
};

// HISTORIAS INTERACTIVAS DE 3 ACTOS CON ENTRADA/SALIDA DE PERSONAJES Y 4 FINALES POR RETO
const SOFT_SKILLS_CHALLENGES = [
  {
    id: 1,
    title: 'Conflicto de intereses en el equipo',
    shortDesc: 'Subir código de IA sin probar a 10 minutos de la entrega.',
    image: '/img/skill-1.jpg',
    stageType: 'server',
    cast: ['leo', 'sara', 'elena', 'bruno'],
    acts: [
      {
        actNumber: 1,
        title: 'Acto 1 · El atajo peligroso',
        stageMove: '🎬 En escena: Leo (Backend) y Sara (Líder QA)',
        leftChar: 'leo',
        rightChar: 'sara',
        enterSide: null,
        script: [
          { speaker: 'left', text: '¡Quedan diez minutos! Subamos el código de la IA sin probar.' },
          { speaker: 'right', text: '¡Estás loco, Leo! Si falla el límite térmico quemamos la máquina.' }
        ],
        prompt: 'Leo tiene el dedo en el botón de despliegue. ¿Qué haces?',
        choices: [
          { id: 'fast', label: '⚡ Dejar que Leo suba el código ya', delta: -1 },
          { id: 'test', label: '🛡️ Detener a Leo y exigir prueba térmica', delta: 1 }
        ]
      },
      {
        actNumber: 2,
        title: 'Acto 2 · Entra dirección a la sala',
        stageMove: '🚪 Sale Sara · Entra en escena Elena (Directora)',
        leftChar: 'leo',
        rightChar: 'elena',
        enterSide: 'right',
        scriptByPrev: {
          fast: [
            { speaker: 'left', text: 'Ya lo subí, pero la fuente empezó a zumbar raro...' },
            { speaker: 'right', text: '¡Acabo de entrar! ¿Por qué huele a recalentado en el rack?' }
          ],
          test: [
            { speaker: 'left', text: 'Elena, aún no subimos porque me pidieron probar el corte térmico.' },
            { speaker: 'right', text: 'El cliente ya está en línea esperando. ¿Cuánto les toma eso?' }
          ]
        },
        prompt: 'Elena mira su reloj frente a ti. ¿Qué le propones?',
        choices: [
          { id: 'hide', label: '🤫 Decir que todo está listo y encender', delta: -1 },
          { id: 'bench', label: '⏱️ Pedir 10 min para aislar el pico en banco', delta: 1 }
        ]
      },
      {
        actNumber: 3,
        title: 'Acto 3 · El veredicto en planta',
        stageMove: '🚪 Sale Leo · Entra en escena Ing. Bruno (Jefe Planta)',
        leftChar: 'bruno',
        rightChar: 'you',
        enterSide: 'left',
        scriptByPrev: {
          hide: [
            { speaker: 'left', text: '¡Saltó el disyuntor de mi planta! ¿Quién mandó ese pulso?' },
            { speaker: 'right', text: 'Ingeniero Bruno, el parámetro de la IA venía al doble...' }
          ],
          bench: [
            { speaker: 'left', text: 'Vi en el monitor que aislaron el pico de corriente a tiempo.' },
            { speaker: 'right', text: 'Sí Ingeniero, detectamos que la IA duplicó el límite y lo ajustamos.' }
          ]
        },
        prompt: 'Última decisión para cerrar la entrega:',
        choices: [
          { id: 'blame', label: '👉 Echarle toda la culpa a Leo y a la IA', ending: 'tense' },
          { id: 'force', label: '🔥 Forzar el arranque manual sin fusible', ending: 'disaster' },
          { id: 'patch', label: '🤝 Aplicar parche validado con Sara y documentar', ending: 'master' },
          { id: 'delay', label: '📅 Posponer el módulo de potencia para mañana', ending: 'diplomatic' }
        ]
      }
    ],
    endings: {
      master: {
        badge: '🌟 FINAL MAESTRO',
        title: 'Equipo a salvo y entrega impecable',
        mood: 'success',
        leftChar: 'sara',
        rightChar: 'you',
        youSay: 'Parche validado en banco y desplegado sin riesgo.',
        replySpeaker: 'left',
        replyText: '¡Salvaste la máquina y cumplimos a tiempo! Gran criterio.',
        good: 'Coordinaste a QA, Dirección y Planta sin quemar el equipo.',
        bad: 'Dejar documentado el protocolo de validación de IA.'
      },
      diplomatic: {
        badge: '🤝 FINAL DIPLOMÁTICO',
        title: 'Entrega parcial segura',
        mood: 'success',
        leftChar: 'elena',
        rightChar: 'you',
        youSay: 'Entregamos hoy el panel de lectura y mañana la etapa de potencia.',
        replySpeaker: 'left',
        replyText: 'El cliente aceptó el cronograma dividido. Buen manejo.',
        good: 'Priorizaste la seguridad y mantuviste la confianza.',
        bad: 'Toca trabajar extra mañana temprano.'
      },
      tense: {
        badge: '⚠️ FINAL TENSO',
        title: 'Equipo dividido por culpas',
        mood: 'warn',
        leftChar: 'leo',
        rightChar: 'you',
        youSay: 'Fue culpa de Leo por confiar en el código de la IA.',
        replySpeaker: 'left',
        replyText: '¿Me dejas solo frente a gerencia? Así no se trabaja en equipo.',
        good: 'Se detuvo la falla eléctrica.',
        bad: 'Rompiste la confianza del equipo al buscar culpables.'
      },
      disaster: {
        badge: '💥 FINAL CATASTRÓFICO',
        title: 'Fuente quemada en plena demo',
        mood: 'risk',
        leftChar: 'bruno',
        rightChar: 'you',
        youSay: 'Puenteemos el fusible para salir del paso ya.',
        replySpeaker: 'left',
        replyText: '¡BZZT! ¡Quemaste el variador de planta frente al cliente!',
        good: 'Ninguno.',
        bad: 'Pérdida de equipo industrial y suspensión del proyecto.'
      }
    }
  },
  {
    id: 2,
    title: 'Entrega de proyecto con retraso',
    shortDesc: 'Ruido eléctrico en el sensor a 30 minutos de presentar a gerencia.',
    image: '/img/skill-2.jpg',
    stageType: 'chart',
    cast: ['elena', 'you', 'leo', 'vargas'],
    acts: [
      {
        actNumber: 1,
        title: 'Acto 1 · Alerta antes de la reunión',
        stageMove: '🎬 En escena: Elena (Directora) y Tú',
        leftChar: 'elena',
        rightChar: 'you',
        enterSide: null,
        script: [
          { speaker: 'left', text: 'La gerencia entra en media hora. ¿La demo está lista?' },
          { speaker: 'right', text: 'Elena, al encender el motor entra ruido y la gráfica salta.' }
        ],
        prompt: 'Quedan 25 minutos en el reloj. ¿Qué haces primero?',
        choices: [
          { id: 'fake', label: '🤥 Fijar datos falsos en el código', delta: -1 },
          { id: 'call', label: '🛠️ Llamar a Leo para filtrar la señal', delta: 1 }
        ]
      },
      {
        actNumber: 2,
        title: 'Acto 2 · Diagnóstico contra reloj',
        stageMove: '🚪 Sale Elena · Entra corriendo Leo (Backend)',
        leftChar: 'leo',
        rightChar: 'you',
        enterSide: 'left',
        scriptByPrev: {
          fake: [
            { speaker: 'left', text: 'Oye, vi que pusiste una curva fija en el código...' },
            { speaker: 'right', text: 'Es solo para que la pantalla no parpadee en la reunión.' }
          ],
          call: [
            { speaker: 'left', text: '¡Llegué! El modo manual está sólido, solo falla el filtro automático.' },
            { speaker: 'right', text: 'Preparemos la demo con el modo manual real y limpio.' }
          ]
        },
        prompt: 'Se abre la puerta de la sala de juntas. ¿Cómo configuras la pantalla?',
        choices: [
          { id: 'sim', label: '🎭 Dejar el modo simulado sin avisar', delta: -1 },
          { id: 'real', label: '📊 Mostrar datos reales del modo manual', delta: 1 }
        ]
      },
      {
        actNumber: 3,
        title: 'Acto 3 · Entra el Cliente VIP',
        stageMove: '🚪 Sale Leo · Entra Sr. Vargas (Cliente VIP)',
        leftChar: 'vargas',
        rightChar: 'you',
        enterSide: 'left',
        scriptByPrev: {
          sim: [
            { speaker: 'left', text: 'Interesante gráfica... ¿Pueden encender el motor en vivo ahora?' },
            { speaker: 'right', text: 'Eh... Señor Vargas, déjeme explicarle qué pasa con la señal...' }
          ],
          real: [
            { speaker: 'left', text: 'El control manual responde muy bien. ¿Y el modo automático?' },
            { speaker: 'right', text: 'Señor Vargas, le tenemos una propuesta transparente para esa etapa.' }
          ]
        },
        prompt: 'El Sr. Vargas espera tu cierre. ¿Qué le dices?',
        choices: [
          { id: 'lie', label: '🤥 Insistir en que todo funciona al 100 %', ending: 'disaster' },
          { id: 'panic', label: '😰 Cancelar la presentación y pedir 1 mes', ending: 'tense' },
          { id: 'plan24', label: '🎯 Entregar hoy control manual + filtro en 24 h', ending: 'master' },
          { id: 'ext', label: '🤝 Acordar entrega conjunta el viernes', ending: 'diplomatic' }
        ]
      }
    ],
    endings: {
      master: {
        badge: '🌟 FINAL MAESTRO',
        title: 'Confianza total del directorio',
        mood: 'success',
        leftChar: 'vargas',
        rightChar: 'you',
        youSay: 'Hoy operamos en modo manual verificado y mañana activamos el filtro.',
        replySpeaker: 'left',
        replyText: '¡Excelente! Valoro la honestidad técnica. Tienen luz verde.',
        good: 'Hablaste con datos reales y diste un plan concreto de 24 h.',
        bad: 'Cumplir puntual el despliegue mañana.'
      },
      diplomatic: {
        badge: '🤝 FINAL DIPLOMÁTICO',
        title: 'Prórroga aprobada en orden',
        mood: 'success',
        leftChar: 'elena',
        rightChar: 'you',
        youSay: 'Agendemos la validación final este viernes con el filtro listo.',
        replySpeaker: 'left',
        replyText: 'Gerencia aceptó esperar al viernes gracias a tu claridad.',
        good: 'Evitaste entregar algo inestable sin mentir.',
        bad: 'Perdiste unos días de margen en el cronograma.'
      },
      tense: {
        badge: '⚠️ FINAL TENSO',
        title: 'Imagen de desorganización',
        mood: 'warn',
        leftChar: 'elena',
        rightChar: 'you',
        youSay: 'Mejor suspendamos todo por un mes.',
        replySpeaker: 'left',
        replyText: 'Nos dieron el plazo, pero quedamos como un equipo improvisado.',
        good: 'No presentaste datos falsos.',
        bad: 'Pediste demasiado tiempo sin mostrar el avance real.'
      },
      disaster: {
        badge: '💥 FINAL CATASTRÓFICO',
        title: 'Simulación descubierta en vivo',
        mood: 'risk',
        leftChar: 'vargas',
        rightChar: 'you',
        youSay: 'Sí claro, esa gráfica es 100 % en tiempo real...',
        replySpeaker: 'left',
        replyText: '¡El motor está apagado y la gráfica sigue moviéndose! Se acabó el contrato.',
        good: 'Ninguno.',
        bad: 'Mentir en una demostración técnica destruye la reputación.'
      }
    }
  },
  {
    id: 3,
    title: 'Feedback negativo a un supervisor',
    shortDesc: 'Tu jefe ordena apagar una alarma de presión para sacar un lote.',
    image: '/img/skill-3.jpg',
    stageType: 'valve',
    cast: ['bruno', 'you', 'sara', 'elena'],
    acts: [
      {
        actNumber: 1,
        title: 'Acto 1 · Orden riesgosa en planta',
        stageMove: '🎬 En escena: Ing. Bruno (Jefe Planta) y Tú',
        leftChar: 'bruno',
        rightChar: 'you',
        enterSide: null,
        script: [
          { speaker: 'left', text: '¡Apaga ya esa alarma del tablero! Urge sacar este lote.' },
          { speaker: 'right', text: 'Ingeniero Bruno, sin esa alarma puede reventar la válvula.' }
        ],
        prompt: 'Los operarios están mirando. ¿Cuál es tu primer paso?',
        choices: [
          { id: 'shout', label: '🗣️ Confrontarlo en voz alta frente al taller', delta: -1 },
          { id: 'private', label: '🤫 Pedirle ver el manómetro a solas un segundo', delta: 1 }
        ]
      },
      {
        actNumber: 2,
        title: 'Acto 2 · Llega Auditoría de Calidad',
        stageMove: '🚪 Entra en escena Sara (Líder QA) con bitácora',
        leftChar: 'sara',
        rightChar: 'bruno',
        enterSide: 'left',
        scriptByPrev: {
          shout: [
            { speaker: 'left', text: 'Escuché los gritos desde el pasillo. ¿Qué pasa con la válvula 4?' },
            { speaker: 'right', text: '¡Aquí quieren enseñarme a mí cómo manejar mi propia planta!' }
          ],
          private: [
            { speaker: 'left', text: 'Chicos, el sensor marca burbujas de aire en la toma secundaria.' },
            { speaker: 'right', text: 'Mmm... si es aire en la toma, podemos purgarla sin apagar el PLC.' }
          ]
        },
        prompt: 'Sara te pregunta qué procedimiento vas a registrar:',
        choices: [
          { id: 'bypass', label: '⚡ Puenteo rápido sin anotar en bitácora', delta: -1 },
          { id: 'purge', label: '🔧 Purga de 3 minutos con alarma activa', delta: 1 }
        ]
      },
      {
        actNumber: 3,
        title: 'Acto 3 · Cierre con el Supervisor',
        stageMove: '🚪 Sale Sara · Quedan Ing. Bruno y Tú frente al tablero',
        leftChar: 'bruno',
        rightChar: 'you',
        enterSide: 'right',
        scriptByPrev: {
          bypass: [
            { speaker: 'left', text: 'La presión sigue subiendo en rojo... ¿Seguro que aguanta?' },
            { speaker: 'right', text: 'Jefe, la tubería está vibrando demasiado...' }
          ],
          purge: [
            { speaker: 'left', text: 'Listo, bajó la presión a rango normal y no perdimos el lote.' },
            { speaker: 'right', text: 'Ingeniero, así protegemos tanto la entrega como su turno.' }
          ]
        },
        prompt: '¿Cómo cierras el acuerdo con el Ing. Bruno?',
        choices: [
          { id: 'obey', label: '🫡 Dejar la alarma apagada todo el turno', ending: 'disaster' },
          { id: 'report', label: '📋 Denunciarlo sin hablar más con él', ending: 'tense' },
          { id: 'ally', label: '🌟 Purga completada + checklist rápido por turno', ending: 'master' },
          { id: 'pause', label: '🤝 Parada preventiva de 20 min firmada por ambos', ending: 'diplomatic' }
        ]
      }
    ],
    endings: {
      master: {
        badge: '🌟 FINAL MAESTRO',
        title: 'Respeto ganado y planta segura',
        mood: 'success',
        leftChar: 'bruno',
        rightChar: 'you',
        youSay: 'Purgamos en 3 minutos y dejamos la protección activa.',
        replySpeaker: 'left',
        replyText: 'Buen ojo y gracias por decírmelo en privado. Cuenta conmigo.',
        good: 'Cuidaste la seguridad sin humillar a tu supervisor.',
        bad: 'Revisar la purga al inicio de cada turno.'
      },
      diplomatic: {
        badge: '🤝 FINAL DIPLOMÁTICO',
        title: 'Parada preventiva acordada',
        mood: 'success',
        leftChar: 'sara',
        rightChar: 'you',
        youSay: 'Hagamos una pausa firmada de 20 minutos para enfriar la línea.',
        replySpeaker: 'left',
        replyText: 'Protocolo aprobado por QA y Planta. Cero accidentes.',
        good: 'Resolviste el riesgo respaldado por el área de calidad.',
        bad: 'El lote salió con 20 minutos de retraso.'
      },
      tense: {
        badge: '⚠️ FINAL TENSO',
        title: 'Relación laboral rota',
        mood: 'warn',
        leftChar: 'bruno',
        rightChar: 'you',
        youSay: 'Voy a pasar un reporte directo en su contra.',
        replySpeaker: 'left',
        replyText: 'La línea paró, pero ahora el ambiente en el taller es insostenible.',
        good: 'Impediste que se apagara la alarma.',
        bad: 'Faltó comunicación asertiva antes de escalar el conflicto.'
      },
      disaster: {
        badge: '💥 FINAL CATASTRÓFICO',
        title: 'Válvula reventada bajo tu firma',
        mood: 'risk',
        leftChar: 'bruno',
        rightChar: 'you',
        youSay: 'Dejemos la alarma desactivada para terminar rápido.',
        replySpeaker: 'left',
        replyText: '¡PUM! ¡Voló el sello de vapor y tu usuario quedó registrado en el PLC!',
        good: 'Ninguno.',
        bad: 'Obedecer una orden insegura compromete tu responsabilidad técnica.'
      }
    }
  },
  {
    id: 4,
    title: 'Negociación de alcance con cliente',
    shortDesc: 'A 2 días de entregar la web, el cliente pide una App móvil gratis.',
    image: '/img/skill-4.jpg',
    stageType: 'client',
    cast: ['vargas', 'you', 'leo', 'elena'],
    acts: [
      {
        actNumber: 1,
        title: 'Acto 1 · El pedido sorpresa',
        stageMove: '🎬 En escena: Sr. Vargas (Cliente VIP) y Tú',
        leftChar: 'vargas',
        rightChar: 'you',
        enterSide: null,
        script: [
          { speaker: 'left', text: 'La web quedó genial, pero para el viernes incluyan también una App móvil.' },
          { speaker: 'right', text: 'Señor Vargas, hoy es miércoles y una App lleva su propio desarrollo.' }
        ],
        prompt: 'El cliente insiste en que «es facilito». ¿Qué respondes primero?',
        choices: [
          { id: 'yes', label: '😰 Prometer que el viernes sale todo sin costo', delta: -1 },
          { id: 'scope', label: '📐 Explicar el impacto técnico de una App offline', delta: 1 }
        ]
      },
      {
        actNumber: 2,
        title: 'Acto 2 · Reacción del equipo técnico',
        stageMove: '🚪 Sale Sr. Vargas · Entra Leo (Backend) alarmado',
        leftChar: 'leo',
        rightChar: 'you',
        enterSide: 'left',
        scriptByPrev: {
          yes: [
            { speaker: 'left', text: '¡¿Le dijiste que sí a una App en dos días?! ¡Nos vamos a quemar!' },
            { speaker: 'right', text: 'Tranquilo Leo, veamos cómo salir de este lío...' }
          ],
          scope: [
            { speaker: 'left', text: 'Menos mal frenaste eso; puedo armar un prototipo visual para el lunes.' },
            { speaker: 'right', text: '¡Buena idea! Con eso le proponemos una Fase 2 formal.' }
          ]
        },
        prompt: 'Entra Elena para definir la oferta final al cliente:',
        choices: [
          { id: 'crunch', label: '🌙 Obligar al equipo a no dormir hasta el viernes', delta: -1 },
          { id: 'phase2', label: '🚀 Preparar propuesta de Fase 2 con prototipo', delta: 1 }
        ]
      },
      {
        actNumber: 3,
        title: 'Acto 3 · Acuerdo final con Dirección y Cliente',
        stageMove: '🚪 Entra Sr. Vargas junto a Dirección para cerrar el trato',
        leftChar: 'vargas',
        rightChar: 'you',
        enterSide: 'left',
        scriptByPrev: {
          crunch: [
            { speaker: 'left', text: 'Ya es viernes... ¿Por qué la App se cierra sola y la web da error?' },
            { speaker: 'right', text: 'Señor Vargas, tuvimos que tocar la base de datos de madrugada...' }
          ],
          phase2: [
            { speaker: 'left', text: 'Vi el avance de la web y está impecable. ¿Qué pensaron para la App?' },
            { speaker: 'right', text: 'Tenemos una ruta segura para no arriesgar su lanzamiento del viernes.' }
          ]
        },
        prompt: 'Cierra la negociación con el Sr. Vargas:',
        choices: [
          { id: 'broken', label: '💥 Entregar web y App a medias hoy mismo', ending: 'disaster' },
          { id: 'legal', label: '😒 Decirle «lea el contrato, no incluye App»', ending: 'tense' },
          { id: 'winwin', label: '🌟 Lanzar web el viernes + firmar Fase 2 móvil', ending: 'master' },
          { id: 'pwa', label: '🤝 Activar versión web adaptable al celular hoy', ending: 'diplomatic' }
        ]
      }
    ],
    endings: {
      master: {
        badge: '🌟 FINAL MAESTRO',
        title: 'Lanzamiento exitoso y nuevo contrato',
        mood: 'success',
        leftChar: 'vargas',
        rightChar: 'you',
        youSay: 'El viernes lanzamos la web al 100 % y el lunes arrancamos la App como Fase 2.',
        replySpeaker: 'left',
        replyText: '¡Trato hecho! Cuidemos la salida del viernes y te apruebo el nuevo presupuesto.',
        good: 'Protegiste a tu equipo, aseguraste la calidad y vendiste la Fase 2.',
        bad: 'Enviar la cotización formal hoy por la tarde.'
      },
      diplomatic: {
        badge: '🤝 FINAL DIPLOMÁTICO',
        title: 'Solución móvil adaptable a tiempo',
        mood: 'success',
        leftChar: 'leo',
        rightChar: 'you',
        youSay: 'Activamos vista móvil en la web para este viernes mientras cotizamos la App offline.',
        replySpeaker: 'left',
        replyText: '¡Quedó súper limpio y sin trasnochar! El cliente quedó feliz.',
        good: 'Diste una alternativa técnica rápida sin romper el alcance.',
        bad: 'La función sin internet quedará para el próximo trimestre.'
      },
      tense: {
        badge: '⚠️ FINAL TENSO',
        title: 'Entrega fría y cliente perdido',
        mood: 'warn',
        leftChar: 'vargas',
        rightChar: 'you',
        youSay: 'Si no está en el contrato no es mi problema.',
        replySpeaker: 'left',
        replyText: 'Les recibo la web el viernes, pero la App la haré con otra empresa.',
        good: 'No sobrecargaste al equipo.',
        bad: 'Perdiste un cliente clave por falta de tacto comercial.'
      },
      disaster: {
        badge: '💥 FINAL CATASTRÓFICO',
        title: 'Doble fallo en producción',
        mood: 'risk',
        leftChar: 'vargas',
        rightChar: 'you',
        youSay: 'Subimos todo junto aunque falten pruebas.',
        replySpeaker: 'left',
        replyText: '¡Se cayó la web en pleno lanzamiento por culpa de la App incompleta!',
        good: 'Ninguno.',
        bad: 'Aceptar cambios de alcance sin tiempo destruye todo el entregable.'
      }
    }
  }
];

const PROJECTS_DATA = [
  {
    id: 1,
    title: 'Optimización Energética en Planta',
    desc: 'Monitoreo IoT para reducir picos de consumo eléctrico en líneas de producción.',
    image: '/img/proj-1.jpg',
    mentor: 'Ing. Carlos Mendoza',
    weeks: '8 semanas',
    tags: ['⚡ Mecatrónica', '💻 Software'],
    badge: {
      id: 'badge-iot',
      title: 'Arquitecto IoT Industrial',
      color: '#365cf5',
      bg: '#eef2ff'
    },
    activities: [
      'Medir consumo base (kWh) en motores principales',
      'Conectar sensores de corriente y pasarela MQTT',
      'Calibrar alertas de picos de potencia con el mentor',
      'Validar reducción del 18 % en horas pico'
    ]
  },
  {
    id: 2,
    title: 'Inventario con Visión Artificial',
    desc: 'Conteo automático de stock en almacenes mediante cámaras y redes neuronales.',
    image: '/img/proj-2.jpg',
    mentor: 'Dra. Elena Ruiz',
    weeks: '10 semanas',
    tags: ['🤖 Visión IA', '📦 Logística'],
    badge: {
      id: 'badge-vision',
      title: 'Especialista en Visión IA',
      color: '#0d7a5f',
      bg: '#e8f7f2'
    },
    activities: [
      'Ajustar ángulos de cámara e iluminación en pasillos',
      'Etiquetar lote de cajas y códigos en estantería',
      'Validar margen de error menor al 2 % frente a conteo manual',
      'Activar panel de alertas de stock en tiempo real'
    ]
  },
  {
    id: 3,
    title: 'Interfaz Segura para Maquinaria',
    desc: 'Panel web de alto contraste para operadores de planta, reduciendo errores de mando.',
    image: '/img/proj-3.jpg',
    mentor: 'Dis. Martín Torres',
    weeks: '9 semanas',
    tags: ['🎨 UX/UI', '⚙️ Ingeniería'],
    badge: {
      id: 'badge-hmi',
      title: 'Diseñador de Sistemas HMI',
      color: '#c26a1b',
      bg: '#fdf2e9'
    },
    activities: [
      'Mapear jerarquía de alarmas y parada de emergencia',
      'Diseñar controles de alto contraste para uso con guantes',
      'Probar reducción del 40 % en tiempo de reacción',
      'Documentar estándar de interfaz aprobado por el mentor'
    ]
  }
];

function defaultTeamsByProject() {
  return {
    1: [
      { id: 't1-1', name: 'Equipo Alpha 1', spots: 2, members: ['Camila R.', 'Mateo V.'] },
      { id: 't1-2', name: 'Equipo Alpha 2', spots: 1, members: ['Diego S.', 'Valeria M.', 'Lucas P.'] }
    ],
    2: [
      { id: 't2-1', name: 'Equipo Vision 1', spots: 2, members: ['Sofía L.', 'Andrés K.'] }
    ],
    3: [
      { id: 't3-1', name: 'Equipo HMI 1', spots: 2, members: ['Fernanda T.', 'Nicolás B.'] },
      { id: 't3-2', name: 'Equipo HMI 2', spots: 3, members: ['Gabriel C.'] },
      { id: 't3-3', name: 'Equipo HMI 3', spots: 1, members: ['Paula D.', 'Sebastián R.', 'Elena G.'] }
    ]
  };
}

// 2. ESTADO DE LA APLICACIÓN Y SINCRONIZACIÓN
let state = {
  name: '',
  career: 'Ingeniería Mecatrónica',
  university: '',
  isGuest: false,
  aiProfile: null,
  completedSkills: {},
  projectState: {},
  badges: [],
  visits: []
};

let teamsByProject = defaultTeamsByProject();
let serverAccounts = [];
let voiceMuted = false;
let sceneTimers = [];
let activeUtterance = null;
let speechRunId = 0;

try {
  const saved = JSON.parse(localStorage.getItem(KEY));
  if (saved && typeof saved === 'object') state = { ...state, ...saved };
} catch {}

try {
  const savedTeams = JSON.parse(localStorage.getItem(TEAMS_KEY));
  if (savedTeams && typeof savedTeams === 'object') teamsByProject = { ...teamsByProject, ...savedTeams };
} catch {}

let saveWarning = false;
function saveLocal() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    localStorage.setItem(TEAMS_KEY, JSON.stringify(teamsByProject));
  } catch {
    if (!saveWarning) {
      saveWarning = true;
      toast('No se puede guardar en este navegador. Tu avance durará esta sesión.');
    }
  }
}

async function syncWithServer() {
  saveLocal();
  if (!state.name) return;
  try {
    const res = await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sync',
        name: state.name,
        university: state.university,
        career: state.career,
        isGuest: state.isGuest,
        aiProfile: state.aiProfile,
        completedSkills: state.completedSkills,
        projectState: state.projectState,
        badges: state.badges,
        teamsByProject
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.teamsByProject) {
        teamsByProject = data.teamsByProject;
        saveLocal();
      }
    }
  } catch {}
}

async function fetchInitialServerStore() {
  try {
    const q = state.name ? `?user=${encodeURIComponent(state.name)}` : '';
    const res = await fetch(`/api/store${q}`);
    if (!res.ok) return;
    const data = await res.json();
    if (data.teamsByProject) teamsByProject = data.teamsByProject;
    if (Array.isArray(data.accounts)) serverAccounts = data.accounts;
    if (data.user && state.name) {
      state = {
        ...state,
        ...data.user,
        completedSkills: { ...(data.user.completedSkills || {}), ...(state.completedSkills || {}) },
        projectState: { ...(data.user.projectState || {}), ...(state.projectState || {}) },
        badges: Array.from(new Set([...(data.user.badges || []), ...(state.badges || [])]))
      };
    }
    saveLocal();
    if (!state.name && serverAccounts.length > 0) renderLogin();
  } catch {}
}

const today = new Date().toLocaleDateString('en-CA');
if (!state.visits.includes(today)) {
  state.visits.push(today);
  saveLocal();
}

let page = 'home';
let authTab = 'login';
let registerStep = 1;
let registerDraft = {
  name: '',
  university: 'ESPOL',
  career: 'Ingeniería Mecatrónica',
  password: '',
  quizAnswers: {}
};
let demoChat = [];

// 3. MOTOR DE AUDIO Y VOCES SIN CORTES PREMATUROS
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  return audioCtx;
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    window.speechSynthesis.getVoices();
  });
}

function stopAllVoices() {
  speechRunId += 1;
  sceneTimers.forEach(t => clearTimeout(t));
  sceneTimers = [];
  activeUtterance = null;
  try {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  } catch {}
  document.querySelectorAll('.stick-actor').forEach(el => el.classList.remove('is-speaking'));
  document.querySelectorAll('.comic-bubble').forEach(el => el.classList.remove('active-bubble'));
}

function playCharacterBabble(charKey, durationMs = 700) {
  if (voiceMuted) return;
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const char = STICK_CHARACTERS[charKey] || STICK_CHARACTERS.you;
    const base = char.voice?.baseFreq || 260;
    const steps = Math.min(7, Math.max(3, Math.floor(durationMs / 130)));
    for (let i = 0; i < steps; i++) {
      const start = ctx.currentTime + i * 0.11;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = char.voice?.gender === 'F' ? 'sine' : 'triangle';
      const jitter = ((i * 37) % 45) - 18;
      osc.frequency.setValueAtTime(base + jitter, start);
      osc.frequency.exponentialRampToValueAtTime(base + jitter * 1.25, start + 0.07);
      gain.gain.setValueAtTime(0.025, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.085);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.09);
    }
  } catch {}
}

function speakLine(charKey, text, sideSelector, onDone, runId = speechRunId) {
  if (runId !== speechRunId) return;
  const actorEl = sideSelector ? document.querySelector(sideSelector) : null;
  document.querySelectorAll('.stick-actor').forEach(el => el.classList.remove('is-speaking'));
  if (actorEl) actorEl.classList.add('is-speaking');

  const cleanText = String(text || '').replace(/[«»"]/g, '').trim();
  const char = STICK_CHARACTERS[charKey] || STICK_CHARACTERS.you;
  const minDurationMs = Math.max(2200, cleanText.length * 75);

  if (voiceMuted) {
    const t = setTimeout(() => {
      if (runId !== speechRunId) return;
      if (actorEl) actorEl.classList.remove('is-speaking');
      if (onDone) onDone();
    }, 1400);
    sceneTimers.push(t);
    return;
  }

  let finished = false;
  const finish = () => {
    if (finished || runId !== speechRunId) return;
    finished = true;
    activeUtterance = null;
    if (actorEl) actorEl.classList.remove('is-speaking');
    // Pausa natural de 260ms después de terminar la frase antes del siguiente diálogo
    const pauseTimer = setTimeout(() => {
      if (runId === speechRunId && onDone) onDone();
    }, 260);
    sceneTimers.push(pauseTimer);
  };

  try {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(cleanText);
      // Guardar referencia global evita que el recolector de basura de Chrome/Edge corte la voz a la mitad
      activeUtterance = u;
      u.lang = 'es-ES';
      u.pitch = char.voice?.pitch || 1.0;
      u.rate = char.voice?.rate || 1.02;
      u.volume = 1.0;

      const allVoices = window.speechSynthesis.getVoices();
      const esVoices = allVoices.filter(v => /^es/i.test(v.lang));
      if (esVoices.length > 0) {
        if (char.voice?.gender === 'F') {
          const fem = esVoices.find(v => /sabina|paulina|helena|laura|monica|elvira|dalia|female|mujer|natural/i.test(v.name));
          u.voice = fem || esVoices[0];
        } else {
          const masc = esVoices.find(v => /raul|pablo|jorge|diego|alvaro|alonso|carlos|male|hombre/i.test(v.name));
          u.voice = masc || esVoices[esVoices.length - 1];
        }
        if (u.voice?.lang) u.lang = u.voice.lang;
      }

      u.onend = () => finish();
      u.onerror = () => finish();

      playCharacterBabble(charKey, 380);
      window.speechSynthesis.speak(u);

      // Watchdog inteligente: NO corta mientras speechSynthesis siga hablando activamente
      const startedAt = Date.now();
      const checkSpeaking = () => {
        if (finished || runId !== speechRunId) return;
        const elapsed = Date.now() - startedAt;
        const stillTalking = window.speechSynthesis.speaking || window.speechSynthesis.pending;
        if (stillTalking && elapsed < 14000) {
          const waitMore = setTimeout(checkSpeaking, 350);
          sceneTimers.push(waitMore);
        } else if (!stillTalking && elapsed >= 900) {
          finish();
        } else if (elapsed >= 14000) {
          finish();
        } else {
          const waitMore = setTimeout(checkSpeaking, 400);
          sceneTimers.push(waitMore);
        }
      };
      const firstCheck = setTimeout(checkSpeaking, minDurationMs);
      sceneTimers.push(firstCheck);
      return;
    }
  } catch {}

  playCharacterBabble(charKey, minDurationMs);
  const t = setTimeout(finish, minDurationMs);
  sceneTimers.push(t);
}

function playSound(type = 'badge') {
  if (voiceMuted && type !== 'badge') return;
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    if (type === 'tick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'step') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.07);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'alarm') {
      [220, 165].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        const st = now + i * 0.14;
        osc.frequency.setValueAtTime(freq, st);
        gain.gain.setValueAtTime(0.08, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + 0.13);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(st);
        osc.stop(st + 0.14);
      });
    } else if (type === 'badge') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = now + i * 0.09;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.11, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.46);
      });
    }
  } catch {}
}

// 4. ICONOS Y UTILIDADES UI
const icons = {
  home: 'M3 10 12 3l9 7v11h-6v-7H9v7H3Z',
  briefcase: 'M3 7h18v14H3ZM8 7V3h8v4M3 12h18M10 12v3h4v-3',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M3 22v-3a9 9 0 0 1 18 0v3',
  arrow: 'M4 12h16M14 6l6 6-6 6',
  check: 'm5 12 4 4L20 5',
  spark: 'm12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z',
  close: 'm6 6 12 12M6 18 18 6'
};

function icon(name, cl = '') {
  return `<svg class="icon ${cl}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[name] || icons.spark}"/></svg>`;
}

function toast(text) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = text;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3500);
}

function scrollChat() {
  requestAnimationFrame(() => {
    const el = $('#messages');
    if (el) el.scrollTop = el.scrollHeight;
  });
}

function openModal(content, wide = false) {
  const el = $('#modal');
  el.style.width = wide ? 'min(760px, calc(100% - 24px))' : 'min(560px, calc(100% - 30px))';
  el.innerHTML = `<button class="modal-close" data-action="close" aria-label="Cerrar ventana">${icon('close')}</button>${content}`;
  if (!el.open) el.showModal();
}

// 5. BARRA DE NAVEGACIÓN SUPERIOR
function renderTopNav() {
  const badgeCount = (state.badges || []).length;
  return `
  <style>
    .top-nav {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 16px;
      min-height: 72px;
      background: white;
      border-bottom: 1px solid var(--line);
      padding: 0 clamp(16px, 3vw, 42px);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 10px rgba(0,0,0,0.02);
    }
    .nav-brand {
      font-size: 24px;
      font-weight: 750;
      display: inline-flex;
      align-items: center;
      color: var(--blue);
      letter-spacing: -1px;
      flex-shrink: 0;
    }
    .nav-brand .brand-symbol {
      background: var(--blue);
      color: white;
      border-radius: 8px;
      width: 28px;
      height: 28px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-style: italic;
      margin-right: 8px;
      font-size: 20px;
      line-height: 1;
      padding: 0;
    }
    .nav-tabs {
      display: flex;
      gap: clamp(14px, 2.8vw, 40px);
      height: 72px;
      justify-content: center;
      align-items: stretch;
      min-width: 0;
    }
    .tab-btn {
      background: none;
      border: none;
      font-size: 13.5px;
      font-weight: 600;
      color: #727b8d;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      border-bottom: 3px solid transparent;
      padding: 0 4px;
      transition: color 0.2s, border-color 0.2s;
      white-space: nowrap;
    }
    .tab-btn:hover { color: var(--blue); }
    .tab-btn.active { color: var(--blue); border-bottom-color: var(--blue); }
    .tab-btn svg { width: 16px; height: 16px; flex-shrink: 0; }
    .nav-profile-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex-shrink: 0;
    }
    .nav-profile {
      border: 1px solid var(--line);
      border-radius: 30px;
      padding: 5px 14px 5px 6px;
      background: white;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 9px;
      max-width: 225px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .nav-profile:hover { border-color: #b8c7f8; box-shadow: 0 3px 10px rgba(54,92,245,0.08); }
    .nav-profile .avatar { flex-shrink: 0; }
    .nav-profile-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
      text-align: left;
      overflow: hidden;
      min-width: 60px;
    }
    .nav-profile-text strong {
      font-size: 11px;
      color: var(--blue);
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .nav-profile-text small {
      font-size: 9px;
      color: #727b8d;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .nav-badge-pill {
      background: #eef2ff;
      color: var(--blue);
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 10px;
      flex-shrink: 0;
    }
    @media (max-width: 860px) {
      .top-nav {
        grid-template-columns: 1fr auto;
        grid-template-rows: auto auto;
        padding: 10px 18px 0;
        gap: 6px 12px;
      }
      .nav-brand { grid-column: 1; grid-row: 1; }
      .nav-profile-wrapper { grid-column: 2; grid-row: 1; }
      .nav-tabs {
        grid-column: 1 / -1;
        grid-row: 2;
        height: 44px;
        justify-content: space-around;
        border-top: 1px solid #f1f3f9;
        gap: 8px;
      }
      .tab-btn { font-size: 12.5px; }
    }
    @media (max-width: 480px) {
      .top-nav { padding: 8px 12px 0; }
      .nav-brand { font-size: 21px; }
      .nav-profile { max-width: 155px; padding: 4px 10px 4px 5px; gap: 6px; }
      .nav-profile-text small { display: none; }
      .nav-profile-text strong { margin-bottom: 0; }
      .tab-btn { font-size: 11.5px; gap: 4px; padding: 0 2px; }
      .tab-btn svg { width: 14px; height: 14px; }
    }
    .sim-container { max-width: 980px; margin: 0 auto; padding: 38px 20px 56px; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 265px), 1fr)); gap: 22px; }
    dialog#modal { padding: clamp(18px, 3vw, 26px) !important; overflow-x: hidden; }
    @media (max-width: 600px) {
      .sim-container { padding: 20px 12px 40px; }
      .grid-3 { grid-template-columns: 1fr; gap: 16px; }
      dialog#modal { padding: 18px 14px 16px !important; width: calc(100% - 16px) !important; max-height: 92dvh; }
    }
  </style>
  <header class="top-nav">
    <a href="#home" class="nav-brand" style="text-decoration: none;">
      <span class="brand-symbol">s</span>sync<span class="brand-dot">.</span>
    </a>

    <nav class="nav-tabs" aria-label="Secciones principales">
      <button class="tab-btn ${page === 'mentor' ? 'active' : ''}" onclick="location.hash='mentor'">Mentor Sync</button>
      <button class="tab-btn ${page === 'skills' ? 'active' : ''}" onclick="location.hash='skills'">Habilidades Blandas</button>
      <button class="tab-btn ${page === 'projects' ? 'active' : ''}" onclick="location.hash='projects'">Proyectos</button>
    </nav>

    <div class="nav-profile-wrapper">
      <button class="nav-profile" data-action="profile" title="Ver perfil">
        <span class="avatar small">${esc((state.name || 'Tú').slice(0, 2).toUpperCase())}</span>
        <div class="nav-profile-text">
          <strong>${esc(state.name)}${state.isGuest ? ' · Invitado' : ''}</strong>
          <small>${esc(state.career)}</small>
        </div>
        ${badgeCount > 0 ? `<span class="nav-badge-pill" title="Insignias">${badgeCount}</span>` : ''}
      </button>
    </div>
  </header>
  `;
}

function shell() {
  if (page === 'home') {
    $('#app').innerHTML = views[page]();
  } else {
    $('#app').innerHTML = `
      ${renderTopNav()}
      <main id="main" tabindex="-1" style="padding: 0; background: #f8f9fc; min-height: calc(100vh - 72px);">
         ${views[page]()}
      </main>
    `;
    if (page === 'mentor') scrollChat();
  }
}

// 6. PANTALLA DE ACCESO Y PERSONALIZACIÓN INTERACTIVA POR PASOS
function startOnboardingWizard(mode, name, password = '') {
  registerDraft.mode = mode;
  registerDraft.name = name;
  registerDraft.password = password;
  registerDraft.university = mode === 'guest' ? 'Invitado' : (registerDraft.university || 'ESPOL');
  registerStep = 1; // 1: Carrera, 2: Quiz 1, 3: Quiz 2, 4: Quiz 3, 5: Personalización activada
  authTab = 'onboarding';
  renderLogin();
}

function computeQuizStats() {
  const gear = CAREER_GEAR[registerDraft.career] || CAREER_GEAR['Ingeniería Mecatrónica'];
  let [prac, rigor, lead] = [28, 28, 28];
  if (registerStep > 1) {
    prac += Math.round((gear.stats[0] - 60) * 0.5);
    rigor += Math.round((gear.stats[1] - 60) * 0.5);
    lead += Math.round((gear.stats[2] - 60) * 0.5);
  }
  AI_QUIZ_QUESTIONS.forEach((q, idx) => {
    if (registerStep > idx + 2) {
      const picked = q.options.find(o => o.id === registerDraft.quizAnswers[q.id]);
      if (picked?.boost) {
        prac += picked.boost[0];
        rigor += picked.boost[1];
        lead += picked.boost[2];
      }
    }
  });
  return [Math.min(100, prac), Math.min(100, rigor), Math.min(100, lead)];
}

window.previewQuizBoost = function (b0, b1, b2, careerName) {
  const base = computeQuizStats();
  const p = Math.min(100, base[0] + (b0 || 0));
  const r = Math.min(100, base[1] + (b1 || 0));
  const l = Math.min(100, base[2] + (b2 || 0));
  const bar0 = document.getElementById('QuizBar0');
  const bar1 = document.getElementById('QuizBar1');
  const bar2 = document.getElementById('QuizBar2');
  const val0 = document.getElementById('QuizVal0');
  const val1 = document.getElementById('QuizVal1');
  const val2 = document.getElementById('QuizVal2');
  if (bar0) bar0.style.width = `${p}%`;
  if (bar1) bar1.style.width = `${r}%`;
  if (bar2) bar2.style.width = `${l}%`;
  if (val0) val0.textContent = `${p}%`;
  if (val1) val1.textContent = `${r}%`;
  if (val2) val2.textContent = `${l}%`;

  const avatarEl = document.getElementById('QuizMiniActor');
  if (avatarEl) avatarEl.classList.add('quiz-actor-wave');
  const tagEl = document.getElementById('QuizGearTag');
  if (careerName && tagEl && CAREER_GEAR[careerName]) {
    tagEl.textContent = CAREER_GEAR[careerName].tag;
  }
};

window.resetQuizPreview = function () {
  const [p, r, l] = computeQuizStats();
  const bar0 = document.getElementById('QuizBar0');
  const bar1 = document.getElementById('QuizBar1');
  const bar2 = document.getElementById('QuizBar2');
  const val0 = document.getElementById('QuizVal0');
  const val1 = document.getElementById('QuizVal1');
  const val2 = document.getElementById('QuizVal2');
  if (bar0) bar0.style.width = `${p}%`;
  if (bar1) bar1.style.width = `${r}%`;
  if (bar2) bar2.style.width = `${l}%`;
  if (val0) val0.textContent = `${p}%`;
  if (val1) val1.textContent = `${r}%`;
  if (val2) val2.textContent = `${l}%`;
  const avatarEl = document.getElementById('QuizMiniActor');
  if (avatarEl) avatarEl.classList.remove('quiz-actor-wave');
};

function renderQuizInteractiveStage() {
  const gear = CAREER_GEAR[registerDraft.career] || CAREER_GEAR['Ingeniería Mecatrónica'];
  const [p, r, l] = computeQuizStats();
  const isDone = registerStep === 5;
  const customChar = {
    name: registerDraft.name || 'Tú',
    role: gear.tag,
    color: gear.color,
    shirt: gear.shirt,
    hair: gear.hair,
    prop: gear.prop,
    tie: registerDraft.career === 'Negocios y Administración'
  };

  return `
    <div class="quiz-stage-card">
      <div class="quiz-avatar-col">
        <svg viewBox="65 26 135 152" width="96" height="106" aria-hidden="true">
          <g id="QuizMiniActor" class="stick-actor ${isDone ? 'mood-success' : 'is-speaking'}" transform="translate(125, 50)">
            <ellipse cx="0" cy="116" rx="22" ry="4.5" fill="rgba(15,23,42,0.08)"/>
            <g class="actor-rig" transform="scale(0.82)">
              <g transform="translate(-5, 76)">
                <line x1="0" y1="0" x2="-6" y2="30" stroke="#475569" stroke-width="4.4" stroke-linecap="round"/>
                <line x1="-6" y1="30" x2="-8" y2="58" stroke="#475569" stroke-width="4.4" stroke-linecap="round"/>
              </g>
              <g transform="translate(5, 76)">
                <line x1="0" y1="0" x2="7" y2="30" stroke="#1e293b" stroke-width="4.8" stroke-linecap="round"/>
                <line x1="7" y1="30" x2="10" y2="58" stroke="#1e293b" stroke-width="4.8" stroke-linecap="round"/>
              </g>
              <path d="M-10 24 L11 24 L9 76 L-8 76 Z" fill="${customChar.shirt}" stroke="${customChar.color}" stroke-width="3" stroke-linejoin="round"/>
              ${customChar.tie ? `<path d="M2 26 L5 48 L2 54 L-1 48 Z" fill="${customChar.color}"/>` : ''}
              <line x1="0" y1="17" x2="0" y2="25" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
              <g class="head-rig">
                <circle cx="0" cy="0" r="17" fill="#ffffff" stroke="#1e293b" stroke-width="3.2"/>
                <path d="M16 -2 L21 2 L16 4" fill="#ffffff" stroke="#1e293b" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
                ${renderCharacterHairAndHat(customChar)}
                <circle cx="4" cy="-2" r="2.1" fill="#0f172a"/>
                <circle cx="11" cy="-2" r="2.1" fill="#0f172a"/>
                <path d="M3 7 Q8 12 13 7" fill="none" stroke="${customChar.color}" stroke-width="2.2" stroke-linecap="round"/>
              </g>
              <g class="shoulder-front" transform="translate(5, 28)">
                <line x1="0" y1="0" x2="13" y2="19" stroke="${customChar.color}" stroke-width="4.5" stroke-linecap="round"/>
                <circle cx="13" cy="19" r="2.7" fill="${customChar.color}"/>
                <g class="elbow-front" transform="translate(13, 19)">
                  <line x1="0" y1="0" x2="17" y2="-6" stroke="${customChar.color}" stroke-width="4.5" stroke-linecap="round"/>
                  <g transform="translate(17, -6)">
                    <circle cx="0" cy="0" r="3.6" fill="#fde68a" stroke="${customChar.color}" stroke-width="1.8"/>
                    ${renderCharacterProp(customChar)}
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
        <span id="QuizGearTag" style="font-size:9.5px; font-weight:700; color:${customChar.color}; background:${customChar.shirt}; padding:2px 8px; border-radius:10px; white-space:nowrap;">
          ${esc(gear.tag)}
        </span>
      </div>

      <div class="quiz-bars-col">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <strong style="font-size:11.5px; color:#202a3d;">ADN Sync · ${esc(registerDraft.name || 'Tú')}</strong>
          <span style="font-size:10px; color:var(--blue); font-weight:700;">Paso ${Math.min(4, registerStep)}/4</span>
        </div>

        <div class="quiz-stat-row">
          <div class="quiz-stat-head"><span>Acción práctica</span><strong id="QuizVal0">${p}%</strong></div>
          <div class="quiz-stat-track"><span id="QuizBar0" style="width:${p}%; background:#365cf5;"></span></div>
        </div>
        <div class="quiz-stat-row">
          <div class="quiz-stat-head"><span>Rigor técnico</span><strong id="QuizVal1">${r}%</strong></div>
          <div class="quiz-stat-track"><span id="QuizBar1" style="width:${r}%; background:#059669;"></span></div>
        </div>
        <div class="quiz-stat-row" style="margin-bottom:0;">
          <div class="quiz-stat-head"><span>Liderazgo</span><strong id="QuizVal2">${l}%</strong></div>
          <div class="quiz-stat-track"><span id="QuizBar2" style="width:${l}%; background:#ea580c;"></span></div>
        </div>
      </div>
    </div>
  `;
}

function renderLogin() {
  let headerSubtitle = 'Inicia sesión para continuar';
  let bodyHtml = '';

  if (authTab === 'login') {
    headerSubtitle = 'Ingresa con tu cuenta';
    bodyHtml = `
      <form id="login-form">
        <label for="login-name" style="margin-top:4px;">Usuario</label>
        <input id="login-name" name="name" maxlength="40" placeholder="Tu usuario" value="${esc(registerDraft.name)}" required>

        <label for="login-pass">Contraseña</label>
        <input id="login-pass" type="password" name="password" placeholder="Tu contraseña" required>

        <div id="login-error" class="feedback retry" style="display: none; margin-top: 10px;"></div>

        <button class="btn primary full" type="submit" style="margin-top: 18px;">Iniciar sesión ${icon('arrow')}</button>
      </form>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--line);">
        <button type="button" class="btn outline full" data-action="auth-tab:register" style="margin:0; padding:10px; font-size:11.5px;">
          Crear cuenta
        </button>
        <button type="button" class="btn outline full" data-action="auth-tab:guest" style="margin:0; padding:10px; font-size:11.5px;">
          Modo invitado
        </button>
      </div>
    `;
  } else if (authTab === 'register') {
    headerSubtitle = 'Crea tu cuenta en un paso';
    bodyHtml = `
      <form id="register-step1-form">
        <label for="reg-name" style="margin-top:4px;">Usuario</label>
        <input id="reg-name" name="name" maxlength="40" placeholder="Elige un usuario" value="${esc(registerDraft.name)}" required>

        <label for="reg-pass">Contraseña</label>
        <input id="reg-pass" type="password" name="password" placeholder="Crea una contraseña" value="${esc(registerDraft.password)}" required>

        <button class="btn primary full" type="submit" style="margin-top: 18px;">Crear cuenta ${icon('arrow')}</button>
      </form>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--line);">
        <button type="button" class="btn outline full" data-action="auth-tab:login" style="margin:0; padding:10px; font-size:11.5px;">
          Iniciar sesión
        </button>
        <button type="button" class="btn outline full" data-action="auth-tab:guest" style="margin:0; padding:10px; font-size:11.5px;">
          Modo invitado
        </button>
      </div>
    `;
  } else if (authTab === 'guest') {
    headerSubtitle = 'Acceso rápido como invitado';
    bodyHtml = `
      <form id="guest-form">
        <label for="guest-name" style="margin-top:4px;">Tu nombre</label>
        <input id="guest-name" name="name" maxlength="40" placeholder="Ej. Jorge" value="${esc(registerDraft.name)}" required>

        <button class="btn primary full" type="submit" style="margin-top: 18px;">Continuar ${icon('arrow')}</button>
      </form>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--line);">
        <button type="button" class="btn outline full" data-action="auth-tab:login" style="margin:0; padding:10px; font-size:11.5px;">
          Iniciar sesión
        </button>
        <button type="button" class="btn outline full" data-action="auth-tab:register" style="margin:0; padding:10px; font-size:11.5px;">
          Crear cuenta
        </button>
      </div>
    `;
  } else if (authTab === 'onboarding') {
    headerSubtitle = 'Calibrando tu perfil interactivo';

    if (registerStep === 1) {
      bodyHtml = `
        <div class="quiz-step-anim">
          ${renderQuizInteractiveStage()}
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="eyebrow" style="margin:0; color:var(--blue);">ELIGE TU EQUIPAMIENTO INICIAL</span>
            <button type="button" class="text-link" data-action="auth-tab:login" style="font-size:11px;">← Salir</button>
          </div>

          <strong style="font-size:14px; color:#202a3d; display:block; margin-bottom:10px;">¿Cuál es tu área o carrera?</strong>
          <div style="display:grid; gap:7px;">
            ${CAREERS.map(c => {
              const g = CAREER_GEAR[c];
              const b0 = Math.round((g.stats[0] - 60) * 0.5);
              const b1 = Math.round((g.stats[1] - 60) * 0.5);
              const b2 = Math.round((g.stats[2] - 60) * 0.5);
              return `
                <button type="button" class="quiz-interactive-card" data-action="pick-career:${esc(c)}"
                  onmouseenter="window.previewQuizBoost(${b0},${b1},${b2},'${esc(c)}')"
                  onmouseleave="window.resetQuizPreview()">
                  <span style="display:flex; align-items:center; gap:9px;">
                    <span style="width:10px; height:10px; border-radius:50%; background:${g.color}; flex-shrink:0;"></span>
                    <span style="font-weight:650; color:#202a3d;">${esc(c)}</span>
                  </span>
                  <span class="quiz-card-tag" style="background:${g.shirt}; color:${g.color};">${esc(g.tag)}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else if (registerStep >= 2 && registerStep <= 4) {
      const qIndex = registerStep - 2;
      const q = AI_QUIZ_QUESTIONS[qIndex];
      bodyHtml = `
        <div class="quiz-step-anim">
          ${renderQuizInteractiveStage()}
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span class="eyebrow" style="margin:0; color:var(--blue);">${esc(q.scenario)}</span>
            <button type="button" class="text-link" data-action="wiz-back" style="font-size:11px;">← Anterior</button>
          </div>

          <div class="quiz-prompt-bubble">
            «${esc(q.q)}»
          </div>

          <div style="display:grid; gap:8px; margin-top:10px;">
            ${q.options.map(opt => {
              const [b0, b1, b2] = opt.boost || [20, 20, 20];
              return `
                <button type="button" class="quiz-interactive-card" data-action="quiz-step:${q.id}:${opt.id}"
                  onmouseenter="window.previewQuizBoost(${b0},${b1},${b2})"
                  onmouseleave="window.resetQuizPreview()">
                  <span style="font-weight:650; color:#202a3d;">${esc(opt.title)}</span>
                  <span class="quiz-card-tag">${esc(opt.tag)}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    } else {
      const profileSummary = buildAiProfile(registerDraft.quizAnswers);
      bodyHtml = `
        <div class="quiz-step-anim" style="text-align:center;">
          ${renderQuizInteractiveStage()}
          <span class="eyebrow" style="color:#2e7d47; margin-bottom:4px;">CALIBRACIÓN COMPLETADA</span>
          <h3 style="margin:0 0 6px 0; font-size:19px; color:#202a3d;">Personalización activada</h3>
          <p style="font-size:12px; color:#535e74; margin:0 0 14px 0;">
            <strong>${esc(registerDraft.name)}</strong> · ${esc(registerDraft.career)}
          </p>

          <div style="background:#eef8f0; border:1px solid #b7e1c1; border-radius:11px; padding:10px 14px; margin-bottom:16px; font-size:11.5px; color:#1f5432;">
            ${esc(profileSummary.summary)}
          </div>

          <button type="button" class="btn primary full" data-action="finish-onboarding" style="margin:0;">
            Entrar a Sync ${icon('arrow')}
          </button>
          <button type="button" class="text-link" data-action="wiz-back" style="margin-top:10px; font-size:11px;">← Repetir quiz</button>
        </div>
      `;
    }
  }

  $('#app').innerHTML = `
    <style>
      .quiz-stage-card {
        display: grid;
        grid-template-columns: 108px 1fr;
        gap: 12px;
        align-items: center;
        background: linear-gradient(135deg, #f0f4ff 0%, #f8f9fc 100%);
        border: 1px solid #d8e2fc;
        border-radius: 14px;
        padding: 10px 14px;
        margin-bottom: 14px;
        text-align: left;
      }
      .quiz-avatar-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .quiz-stat-row { margin-bottom: 7px; }
      .quiz-stat-head {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        font-weight: 600;
        color: #535e74;
        margin-bottom: 3px;
      }
      .quiz-stat-track {
        height: 6px;
        background: #e2e8f0;
        border-radius: 6px;
        overflow: hidden;
      }
      .quiz-stat-track span {
        display: block;
        height: 100%;
        border-radius: 6px;
        transition: width 0.28s cubic-bezier(0.2, 0.9, 0.3, 1);
      }
      .quiz-prompt-bubble {
        background: #f8f9fc;
        border-left: 3px solid var(--blue);
        padding: 9px 12px;
        border-radius: 0 10px 10px 0;
        font-size: 13px;
        font-weight: 650;
        color: #202a3d;
        text-align: left;
      }
      .quiz-interactive-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        text-align: left;
        padding: 11px 13px;
        border-radius: 11px;
        border: 1.5px solid #e2e7f1;
        background: white;
        font-size: 12px;
        cursor: pointer;
        transition: transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
      }
      .quiz-interactive-card:hover {
        border-color: var(--blue);
        background: #f4f7ff;
        transform: translateX(4px);
        box-shadow: 0 6px 16px rgba(54, 92, 245, 0.1);
      }
      .quiz-card-tag {
        font-size: 9.5px;
        font-weight: 700;
        color: var(--blue);
        background: #edf2ff;
        padding: 3px 8px;
        border-radius: 8px;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .quiz-step-anim {
        animation: quizSlideIn 0.24s ease-out;
      }
      @keyframes quizSlideIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      #QuizMiniActor .shoulder-front {
        transform-origin: 0px 0px;
        animation: quizIdleArm 1.4s ease-in-out infinite alternate;
      }
      #QuizMiniActor .elbow-front {
        transform-origin: 0px 0px;
        animation: quizIdleElbow 1.1s ease-in-out infinite alternate;
      }
      #QuizMiniActor.quiz-actor-wave .shoulder-front {
        animation: quizWaveArm 0.35s ease-in-out infinite alternate !important;
      }
      @keyframes quizIdleArm {
        0% { transform: translate(5px, 28px) rotate(-6deg); }
        100% { transform: translate(5px, 28px) rotate(10deg); }
      }
      @keyframes quizIdleElbow {
        0% { transform: translate(13px, 19px) rotate(-18deg); }
        100% { transform: translate(13px, 19px) rotate(12deg); }
      }
      @keyframes quizWaveArm {
        0% { transform: translate(5px, 28px) rotate(-45deg); }
        100% { transform: translate(5px, 28px) rotate(-75deg); }
      }
      @media (max-width: 440px) {
        .quiz-stage-card {
          grid-template-columns: 88px 1fr;
          gap: 10px;
          padding: 9px 10px;
        }
        .quiz-interactive-card {
          padding: 10px 11px;
          font-size: 11.5px;
        }
      }
    </style>
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8f9fc; padding: 24px 16px;">
      <div style="background: white; padding: 28px 26px; border-radius: 20px; box-shadow: 0 12px 38px rgba(24,39,75,0.05); width: 100%; max-width: ${authTab === 'onboarding' ? '440px' : '400px'}; border: 1px solid var(--line); transition: max-width 0.2s;">
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="font-size: 30px; font-weight: 750; letter-spacing: -1.5px; color: var(--blue); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 4px;">
            <span class="brand-symbol" style="width:30px; height:30px; font-size:20px; line-height:30px; border-radius:8px; margin-right:8px; padding:0;">s</span>sync<span class="brand-dot">.</span>
          </div>
          <p style="margin:0; font-size: 12.5px; color: #727b8d; font-weight: 500;">${headerSubtitle}</p>
        </div>

        ${bodyHtml}
      </div>
    </div>
  `;
}

// 7. LANDING PRINCIPAL (#home)
function home() {
  return `
  <style>
    .landing-hero {
      background: #f0f4ff;
      min-height: 86vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #202a3d;
      text-align: center;
      padding: 72px 20px 56px;
    }
    .landing-hero .brand-symbol { background: var(--blue); color: white; }
    .fade-in-up { animation: fadeInUp 0.65s ease-out forwards; opacity: 0; transform: translateY(20px); }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

    .landing-btn {
      background: var(--blue);
      color: white;
      border: none;
      font-size: 14px;
      font-weight: 600;
      padding: 15px 34px;
      border-radius: 30px;
      box-shadow: 0 10px 28px rgba(54, 92, 245, 0.26);
      display: inline-flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .landing-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(54, 92, 245, 0.35); color: white; }

    .features-section {
      background: #ffffff;
      padding: 78px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(255px, 310px));
      justify-content: center;
      gap: 24px;
      max-width: 1020px;
      width: 100%;
      margin-top: 40px;
    }
    .feature-card {
      background: #f8f9fc;
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    }
    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 14px 32px rgba(0,0,0,0.05);
      background: white;
    }
    .feature-icon-wrapper {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }
    .feature-icon-wrapper svg { width: 22px; height: 22px; }
    .icon-blue { background: #e9effc; color: var(--blue); }
    .icon-orange { background: #fbede1; color: #bb8856; }
    .icon-green { background: #eaf3eb; color: #52795d; }

    .traffic-lights {
      display: flex;
      gap: 7px;
      margin-top: 16px;
      align-items: center;
      justify-content: center;
      font-size: 10.5px;
      color: #7c869b;
      font-weight: 600;
    }
    .t-light { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
    .t-red { background: #dc8b85; }
    .t-yellow { background: #d8b55f; }
    .t-green { background: #85ac92; }

    .backing-section {
      margin-top: 60px;
      text-align: center;
      width: 100%;
      max-width: 860px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .backing-logos {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 18px;
      width: 100%;
      margin-top: 14px;
    }
    .backing-logo-card {
      background: #f8f9fc;
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 14px 24px;
      height: 72px;
      min-width: 175px;
      max-width: 235px;
      flex: 1 1 175px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .backing-logo-card img {
      max-height: 42px;
      max-width: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      display: block;
    }

    .credits-section {
      background: #f8f9fc;
      padding: 72px 24px;
      border-top: 1px solid var(--line);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .credits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(255px, 360px));
      justify-content: center;
      gap: 26px;
      max-width: 800px;
      width: 100%;
      margin-top: 34px;
    }
    .institution-card {
      background: white;
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 28px 22px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      overflow: hidden;
    }
    .institution-logo-box {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
      padding: 0 10px;
    }
    .institution-logo {
      max-height: 50px;
      max-width: min(210px, 100%);
      width: auto;
      height: auto;
      object-fit: contain;
      display: block;
    }
    .team-list { list-style: none; padding: 0; margin: 0; width: 100%; }
    .team-list li { font-size: 13.5px; color: #535e74; padding: 9px 0; border-bottom: 1px solid #e9ecf3; }
    .team-list li:last-child { border-bottom: none; }
    @media (max-width: 600px) {
      .landing-hero { min-height: 74vh; padding: 44px 16px 40px; }
      .features-section, .credits-section { padding: 46px 16px; }
      .features-grid, .credits-grid { grid-template-columns: 1fr; gap: 16px; margin-top: 24px; }
      .feature-card, .institution-card { padding: 22px 18px; }
      .backing-section { margin-top: 38px; }
      .backing-logos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .backing-logo-card { min-width: 0; height: 58px; padding: 8px 10px; border-radius: 11px; }
      .backing-logo-card img { max-height: 32px; }
    }
  </style>

  <section class="landing-hero">
    <div class="fade-in-up" style="font-size: 44px; font-weight: 750; letter-spacing: -2px; margin-bottom: 22px; display: flex; align-items: center; justify-content: center; color: var(--blue);">
       <span class="brand-symbol" style="margin-right: 10px;">s</span>sync<span class="brand-dot">.</span>
    </div>

    <h1 class="fade-in-up delay-1" style="font-size: clamp(32px, 5vw, 58px); line-height: 1.1; margin-bottom: 18px; max-width: 820px;">
      Más allá de los apuntes.<br><em style="font-style: normal; color: var(--blue);">Más cerca de tu futuro.</em>
    </h1>

    <p class="fade-in-up delay-2" style="font-size: clamp(15px, 1.8vw, 17px); color: #535e74; max-width: 540px; line-height: 1.55; margin-bottom: 30px;">
      Desarrolla criterio técnico con fuentes reales, entrena decisiones de trabajo y gana experiencia en proyectos guiados.
    </p>

    <div class="fade-in-up delay-3">
       <button class="landing-btn" onclick="location.hash='mentor'">
         Iniciar simulador ${icon('arrow')}
       </button>
    </div>
  </section>

  <section class="features-section">
     <div class="eyebrow" style="color: var(--blue); margin-bottom: 8px;">CÓMO FUNCIONA SYNC</div>
     <h2 style="font-size: clamp(22px, 3vw, 30px); color: #202a3d; max-width: 560px; text-align: center; line-height: 1.28;">Tu puente entre la universidad y el trabajo</h2>

     <div class="features-grid">
       <div class="feature-card" style="cursor:pointer;" onclick="location.hash='mentor'">
         <div class="feature-icon-wrapper icon-blue">${icon('spark')}</div>
         <h3 style="font-size: 18px; color: #202a3d; margin-bottom: 8px;">Mentor Sync</h3>
         <p style="font-size: 13px; color: #535e74; line-height: 1.55; margin: 0;">IA con semáforo de riesgo, imágenes técnicas Full HD y citas directas al pasar el cursor.</p>
         <div class="traffic-lights">
           <span class="t-light t-red"></span><span class="t-light t-yellow"></span><span class="t-light t-green"></span>
           <span style="margin-left: 4px;">Riesgo · Contrastar · Seguro</span>
         </div>
       </div>

       <div class="feature-card" style="cursor:pointer;" onclick="location.hash='skills'">
         <div class="feature-icon-wrapper icon-orange">${icon('briefcase')}</div>
         <h3 style="font-size: 18px; color: #202a3d; margin-bottom: 8px;">Habilidades blandas</h3>
         <p style="font-size: 13px; color: #535e74; line-height: 1.55; margin: 0;">Historias interactivas de 3 actos con voz, personajes que entran en escena y 4 desenlaces.</p>
         <div class="traffic-lights" style="color:#b45309; background:#fef3c7;">
           <span>🎭 3 Actos · 4 Finales distintos</span>
         </div>
       </div>

       <div class="feature-card" style="cursor:pointer;" onclick="location.hash='projects'">
         <div class="feature-icon-wrapper icon-green">${icon('user')}</div>
         <h3 style="font-size: 18px; color: #202a3d; margin-bottom: 8px;">Proyectos Colaborativos</h3>
         <p style="font-size: 13px; color: #535e74; line-height: 1.55; margin: 0;">Únete a un equipo, completa los 4 entregables reales y desbloquea insignias en tu perfil.</p>
         <div class="traffic-lights" style="color:#1f683c; background:#eaf6ee;">
           <span>🏆 Retos guiados + Insignias</span>
         </div>
       </div>
     </div>

     <div class="backing-section">
       <span class="eyebrow" style="margin-bottom: 6px; color: #8a93a8;">CON EL RESPALDO DE</span>
       <div class="backing-logos">
         <div class="backing-logo-card">
           <img src="/img/Espol.png" alt="Logo ESPOL">
         </div>
         <div class="backing-logo-card">
           <img src="/img/I3Lab.png" alt="Logo i3lab">
         </div>
         <div class="backing-logo-card">
           <img src="/img/UMayor.png" alt="Logo Universidad Mayor">
         </div>
       </div>
     </div>
  </section>

  <section class="credits-section">
    <div class="eyebrow" style="margin-bottom: 8px;">COLABORACIÓN ACADÉMICA</div>
    <h2 style="font-size: 26px; color: #202a3d;">El Equipo Detrás de Sync</h2>

    <div class="credits-grid">
      <div class="institution-card">
        <div class="institution-logo-box">
          <img src="/img/Espol.png" alt="Logo ESPOL" class="institution-logo">
        </div>
        <h3 style="font-size: 15px; margin-bottom: 12px; color: var(--blue);">ESPOL</h3>
        <ul class="team-list">
          <li>Santiago Gómez</li>
          <li>Mirka Velez</li>
          <li>José Paladines</li>
        </ul>
      </div>

      <div class="institution-card">
        <div class="institution-logo-box">
          <img src="/img/UMayor.png" alt="Logo Universidad Mayor" class="institution-logo">
        </div>
        <h3 style="font-size: 15px; margin-bottom: 12px; color: var(--blue);">Universidad Mayor</h3>
        <ul class="team-list">
          <li>Diego Rodríguez</li>
          <li>Maximiliano Gómez</li>
          <li>Benjamin Antipe</li>
        </ul>
      </div>
    </div>
  </section>
  `;
}

// 8. VISTA 1: MENTOR SYNC (CITA SUBRAYADA LIMPIA SIN REPETICIÓN + IMAGEN FULL HD CON FUENTE)
function renderCitedParagraph(p, sources) {
  const src = (sources || []).find(s => s.id === p.citeId);
  if (!src) return `<p style="margin: 0 0 10px 0; line-height: 1.62;">${esc(p.text)}</p>`;
  return `
    <p style="margin: 0 0 11px 0; line-height: 1.68;">
      <a href="${esc(src.url)}" target="_blank" rel="noopener noreferrer" class="cited-claim">
        ${esc(p.text)}
        <span class="cite-popover" role="tooltip">
          <span class="cite-popover-head">
            <strong>📄 ${esc(src.title)}</strong>
            <span class="cite-domain">${esc(src.domain)} ↗</span>
          </span>
          <span class="cite-popover-quote">${esc(src.quote)}</span>
          <span class="cite-popover-foot">Haz clic en el texto subrayado para abrir la fuente oficial</span>
        </span>
      </a>
    </p>
  `;
}

function viewMentorSync() {
  return `
  <style>
    .cited-claim {
      position: relative;
      display: inline;
      color: #1f2d47;
      background: linear-gradient(transparent 72%, #dbe7ff 72%);
      border-bottom: 1.5px dashed #365cf5;
      padding: 0 2px 1px;
      border-radius: 3px;
      text-decoration: none;
      transition: background 0.15s, color 0.15s;
      cursor: pointer;
    }
    .cited-claim:hover, .cited-claim:focus-visible {
      background: #d4e2ff;
      color: #112358;
    }
    .cite-popover {
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      left: 0;
      bottom: calc(100% + 8px);
      width: min(350px, 82vw);
      background: #1b253b;
      color: #ffffff;
      border-radius: 12px;
      padding: 12px 14px;
      box-shadow: 0 14px 32px rgba(15, 23, 42, 0.28);
      z-index: 60;
      display: flex;
      flex-direction: column;
      gap: 6px;
      text-align: left;
      line-height: 1.44;
      transform: translateY(4px);
      transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
    }
    .cited-claim:hover .cite-popover,
    .cited-claim:focus-visible .cite-popover {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
    .cite-popover-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      font-size: 10.5px;
      border-bottom: 1px solid rgba(255,255,255,0.12);
      padding-bottom: 5px;
    }
    .cite-popover-head strong { color: #9ec0ff; font-weight: 650; }
    .cite-domain {
      background: rgba(255,255,255,0.14);
      color: #e2e8f0;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9px;
      white-space: nowrap;
    }
    .cite-popover-quote { font-size: 10.5px; color: #f1f5f9; font-style: italic; }
    .cite-popover-foot { font-size: 9.5px; color: #93c5fd; font-weight: 600; }

    .mentor-reply-split {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }
    .mentor-reply-text {
      flex: 1;
      min-width: 0;
    }
    .mentor-hd-card {
      width: 245px;
      flex-shrink: 0;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #dce4f5;
      background: #ffffff;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
      text-decoration: none;
      display: block;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .mentor-hd-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(54, 92, 245, 0.12);
      border-color: #b8caf8;
    }
    .mentor-hd-img-wrap {
      position: relative;
      height: 138px;
      background: #0f172a;
      overflow: hidden;
    }
    .mentor-hd-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.35s ease;
    }
    .mentor-hd-card:hover .mentor-hd-img-wrap img {
      transform: scale(1.03);
    }
    .mentor-hd-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(15, 23, 42, 0.78);
      backdrop-filter: blur(4px);
      color: #ffffff;
      font-size: 9px;
      font-weight: 700;
      padding: 2.5px 7px;
      border-radius: 5px;
      letter-spacing: 0.4px;
    }
    .mentor-hd-caption {
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: 10.5px;
      line-height: 1.35;
      color: #475569;
      background: #ffffff;
    }
    .mentor-hd-source {
      color: var(--blue);
      font-weight: 650;
      font-size: 10px;
    }
    @media (max-width: 640px) {
      .mentor-reply-split {
        flex-direction: column;
        gap: 10px;
      }
      .mentor-hd-card {
        width: 100%;
      }
      .mentor-hd-img-wrap {
        height: 150px;
      }
      .cite-popover {
        position: fixed;
        left: 14px;
        right: 14px;
        bottom: 16px;
        width: auto;
        z-index: 200;
      }
      #messages {
        padding: 16px 12px !important;
        max-height: 56vh !important;
      }
    }
  </style>

  <div class="sim-container">
     <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 24px; color: #202a3d; margin-bottom: 6px;">Mentor Sync</h2>
        <p style="color: #727b8d; font-size: 13px; max-width: 560px; margin: 0 auto;">
          Pasa el cursor sobre el texto subrayado para inspeccionar la cita oficial o haz clic para abrir el documento original.
        </p>
     </div>

     <div class="chat-panel" style="max-width: 860px; margin: 0 auto; background: white; border-radius: 18px; border: 1px solid var(--line); min-height: 510px; display: flex; flex-direction: column; box-shadow: 0 8px 26px rgba(0,0,0,0.03); overflow: visible;">
        <div id="messages" style="flex: 1; max-height: 470px; padding: 24px; overflow-y: auto; scroll-behavior: smooth;">
           <div style="display: flex; gap: 12px; align-items: flex-start; margin-bottom: 18px;">
              <span style="background: #edf1ff; color: var(--blue); width: 30px; height: 30px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-style: italic; flex-shrink:0;">s</span>
              <div style="background: #f8f9fc; padding: 13px 16px; border-radius: 0 12px 12px 12px; font-size: 13px; color: #3c4963; max-width: 85%; border: 1px solid var(--line);">
                 👋 Hola, <strong>${esc(state.name.split(' ')[0])}</strong>. Selecciona una consulta abajo: cada afirmación subrayada incluye su referencia directa y apoyo visual Full HD a la derecha.
              </div>
           </div>

           ${demoChat.map((m, idx) => {
             const dotColor = m.color === 'red' ? '#dc8b85' : m.color === 'amber' ? '#d8b55f' : '#85ac92';
             const statusBg = m.color === 'red' ? '#fdf2f1' : m.color === 'amber' ? '#fef9e7' : '#eef8f0';
             const statusText = m.color === 'red' ? '#9e3f38' : m.color === 'amber' ? '#8a6818' : '#2d6840';
             return `
             <div style="display: flex; gap: 12px; align-items: flex-start; justify-content: flex-end; margin-bottom: 14px;">
                <div style="background: var(--blue); color: white; padding: 11px 16px; border-radius: 12px 0 12px 12px; font-size: 12.5px; max-width: 80%; line-height: 1.45;">
                   ${esc(m.q)}
                </div>
             </div>
             <div style="display: flex; gap: 12px; align-items: flex-start; margin-bottom: 22px;">
                <span style="background: #edf1ff; color: var(--blue); width: 30px; height: 30px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-style: italic; flex-shrink:0;">s</span>
                <div style="background: #f8f9fc; padding: 16px 18px; border-radius: 0 14px 14px 14px; font-size: 12.5px; color: #3c4963; max-width: 92%; border: 1px solid var(--line); width: 100%;">
                   <div class="mentor-reply-split">
                     <div class="mentor-reply-text">
                       <p style="margin: 0 0 8px 0; font-weight: 650; color: #202a3d;">${esc(m.intro)}</p>
                       ${(m.paragraphs || []).map(p => renderCitedParagraph(p, m.sources)).join('')}
                     </div>

                     ${m.image ? `
                       <a class="mentor-hd-card" href="${esc(m.imageSourceUrl || m.sources?.[0]?.url || '#')}" target="_blank" rel="noopener noreferrer" title="Abrir fuente oficial">
                         <div class="mentor-hd-img-wrap">
                           <img src="${esc(m.image)}" alt="${esc(m.imageCaption || m.intro)}">
                           <span class="mentor-hd-badge">📸 FULL HD</span>
                         </div>
                         <div class="mentor-hd-caption">
                           <span>${esc(m.imageCaption || '')}</span>
                           <span class="mentor-hd-source">Fuente: ${esc(m.imageSourceTag || 'Documentación oficial')} ↗</span>
                         </div>
                       </a>
                     ` : ''}
                   </div>

                   <div style="margin-top: 12px; padding: 8px 12px; border-radius: 9px; background: ${statusBg}; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px;">
                      <div style="display: flex; align-items: center; gap: 7px;">
                        <span style="width: 10px; height: 10px; border-radius: 50%; display: inline-block; background: ${dotColor}; flex-shrink:0;"></span>
                        <span style="font-size: 11px; font-weight: 650; color: ${statusText};">${esc(m.statusLabel)}</span>
                      </div>
                      ${m.color === 'amber' ? `
                        <button type="button" class="btn outline" data-action="verify-amber:${idx}" style="padding: 4px 9px; font-size: 10px; border-color: #85ac92; color: #2d6840; background: white;">
                          ✓ Marcar verificado
                        </button>
                      ` : ''}
                   </div>
                </div>
             </div>
           `}).join('')}
        </div>

        <div style="padding: 15px 20px; border-top: 1px solid var(--line); background: white; border-radius: 0 0 18px 18px;">
           <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 9px;">
             <span style="font-size: 9.5px; font-weight: 700; letter-spacing: 0.8px; color: #8a93a8;">CONSULTAS DE PRUEBA</span>
             ${demoChat.length > 0 ? `<button type="button" class="text-link" data-action="clear-chat" style="font-size:10.5px;">Limpiar historial</button>` : ''}
           </div>
           <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(175px, 1fr)); gap: 8px;">
              ${MENTOR_SCENARIOS.map(sc => `
                <button type="button" class="btn outline" data-action="demo-chat:${sc.id}" style="font-size: 11px; padding: 9px 11px; text-align: left; justify-content: flex-start; border-color: ${sc.borderColor}; background: ${sc.badgeBg}; color: #202a3d;">
                  ${esc(sc.btnLabel)}
                </button>
              `).join('')}
           </div>
        </div>
     </div>
  </div>
  `;
}

// 9. VISTA 2: HABILIDADES BLANDAS — 3 ACTOS, ENTRADA/SALIDA DE PERSONAJES, IMÁGENES FULL HD Y 4 FINALES
function renderCharacterHairAndHat(char) {
  if (char.hair === 'spiky') {
    return `<path d="M-16 -4 L-21 -14 L-13 -13 L-11 -23 L-3 -16 L4 -25 L8 -15 L17 -19 L13 -8 Q2 -14 -16 -4 Z" fill="#1e293b"/>`;
  }
  if (char.hair === 'ponytail') {
    return `
      <path d="M-16 -5 Q0 -25 16 -6 Q4 -14 -16 -5 Z" fill="#3b0764"/>
      <path d="M-16 -8 Q-28 -12 -26 5 Q-20 3 -16 -4 Z" fill="#3b0764"/>
      <circle cx="-17" cy="-7" r="3" fill="#ec4899"/>
    `;
  }
  if (char.hair === 'bob') {
    return `<path d="M-17 4 Q-19 -22 1 -22 Q18 -21 16 -3 C10 -12 -10 -10 -17 4 Z" fill="#064e3b"/>`;
  }
  if (char.hair === 'hardhat') {
    return `
      <path d="M-18 -7 Q0 -28 18 -7 Z" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
      <path d="M-19 -8 L24 -8 L22 -4 L-19 -4 Z" fill="#eab308"/>
    `;
  }
  if (char.hair === 'slick') {
    return `<path d="M-17 -3 Q-6 -24 17 -11 Q6 -16 -17 -3 Z" fill="#334155"/>`;
  }
  return `<path d="M-16 -4 Q-6 -24 16 -14 L19 -8 Q4 -14 -16 -4 Z" fill="#1e3a8a"/>`;
}

function renderCharacterProp(char) {
  if (char.prop === 'coffee') {
    return `
      <g transform="translate(0, 16)">
        <rect x="-5" y="-5" width="10" height="12" rx="2" fill="#ffffff" stroke="#ea580c" stroke-width="2"/>
        <path d="M5 -2 C8 -2 8 4 5 4" fill="none" stroke="#ea580c" stroke-width="1.6"/>
        <path d="M-2 -8 Q0 -13 -2 -16 M2 -8 Q4 -13 2 -16" fill="none" stroke="#94a3b8" stroke-width="1.4" stroke-linecap="round"/>
      </g>
    `;
  }
  if (char.prop === 'clipboard') {
    return `
      <g transform="translate(0, 16) rotate(-10)">
        <rect x="-6" y="-7" width="13" height="18" rx="2" fill="#f5d0fe" stroke="#7c3aed" stroke-width="1.8"/>
        <line x1="-3" y1="-2" x2="3" y2="-2" stroke="#7c3aed" stroke-width="1.6"/>
        <line x1="-3" y1="3" x2="3" y2="3" stroke="#7c3aed" stroke-width="1.6"/>
      </g>
    `;
  }
  if (char.prop === 'wrench') {
    return `
      <g transform="translate(0, 16) rotate(22)">
        <line x1="0" y1="-9" x2="0" y2="9" stroke="#64748b" stroke-width="3.8" stroke-linecap="round"/>
        <circle cx="0" cy="-11" r="4.5" fill="none" stroke="#64748b" stroke-width="2.6"/>
      </g>
    `;
  }
  if (char.prop === 'watch') {
    return `
      <g transform="translate(0, 16)">
        <circle cx="0" cy="0" r="7.5" fill="#ffffff" stroke="#059669" stroke-width="2"/>
        <line x1="0" y1="0" x2="0" y2="-4" stroke="#059669" stroke-width="1.6"/>
        <line x1="0" y1="0" x2="3.5" y2="0" stroke="#dc2626" stroke-width="1.6"/>
      </g>
    `;
  }
  if (char.prop === 'phone') {
    return `
      <g transform="translate(0, 16) rotate(-12)">
        <rect x="-5" y="-8" width="11" height="17" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1.6"/>
      </g>
    `;
  }
  return `
    <g transform="translate(0, 16)">
      <rect x="-5" y="-6" width="11" height="14" rx="2" fill="#dbeafe" stroke="#365cf5" stroke-width="1.8"/>
    </g>
  `;
}

function renderArticulatedActor(charKey, side, mood = 'neutral', isEntering = false) {
  const char = STICK_CHARACTERS[charKey] || STICK_CHARACTERS.you;
  const displayName = charKey === 'you' ? (state.name ? state.name.split(' ')[0] : 'Tú') : char.name;
  const xPos = side === 'left' ? 132 : 448;
  const flip = side === 'right' ? -1 : 1;

  const isAngryOrStress = mood === 'risk' || (mood === 'neutral' && (charKey === 'bruno' || charKey === 'sara'));
  const isHappy = mood === 'success';
  const enterClass = isEntering ? `enter-${side}` : '';

  return `
    <g class="stick-actor actor-${side} mood-${mood} ${enterClass}" transform="translate(${xPos}, 52)">
      <ellipse class="actor-shadow" cx="0" cy="142" rx="25" ry="5.5" fill="rgba(15,23,42,0.08)"/>

      <!-- Grupo espejo fijo: NUNCA lleva transform CSS, así el personaje derecho siempre mira a la izquierda -->
      <g class="actor-facing" transform="scale(${flip}, 1)">
        <g class="actor-rig">
          <!-- PIERNA TRASERA -->
          <g class="thigh-back" transform="translate(-5, 76)">
            <line x1="0" y1="0" x2="-6" y2="30" stroke="#475569" stroke-width="4.4" stroke-linecap="round"/>
            <circle cx="-6" cy="30" r="2.4" fill="#475569"/>
            <g class="shin-back" transform="translate(-6, 30)">
              <line x1="0" y1="0" x2="-2" y2="30" stroke="#475569" stroke-width="4.4" stroke-linecap="round"/>
              <path d="M-4 30 L8 30" stroke="#1e293b" stroke-width="4.8" stroke-linecap="round"/>
            </g>
          </g>

          <!-- PIERNA DELANTERA -->
          <g class="thigh-front" transform="translate(5, 76)">
            <line x1="0" y1="0" x2="7" y2="30" stroke="#1e293b" stroke-width="4.8" stroke-linecap="round"/>
            <circle cx="7" cy="30" r="2.5" fill="#1e293b"/>
            <g class="shin-front" transform="translate(7, 30)">
              <line x1="0" y1="0" x2="4" y2="30" stroke="#1e293b" stroke-width="4.8" stroke-linecap="round"/>
              <path d="M1 30 L14 30" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
            </g>
          </g>

          <!-- BRAZO TRASERO -->
          <g class="shoulder-back" transform="translate(-5, 28)">
            <line x1="0" y1="0" x2="-10" y2="19" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
            <circle cx="-10" cy="19" r="2.4" fill="#475569"/>
            <g class="elbow-back" transform="translate(-10, 19)">
              <line x1="0" y1="0" x2="11" y2="14" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
              <circle cx="11" cy="14" r="3.2" fill="#fde68a" stroke="#475569" stroke-width="1.6"/>
            </g>
          </g>

          <!-- TORSO -->
          <g class="torso-group">
            <path d="M-10 24 L11 24 L9 76 L-8 76 Z" fill="${char.shirt}" stroke="${char.color}" stroke-width="3" stroke-linejoin="round"/>
            ${char.tie ? `<path d="M2 26 L5 48 L2 54 L-1 48 Z" fill="${char.color}"/>` : ''}
            <line x1="0" y1="17" x2="0" y2="25" stroke="#1e293b" stroke-width="4.5" stroke-linecap="round"/>
          </g>

          <!-- CABEZA ORIENTADA AL FRENTE (+X) -->
          <g class="head-rig">
            <circle cx="0" cy="0" r="17" fill="#ffffff" stroke="#1e293b" stroke-width="3.2"/>
            <path d="M16 -2 L21 2 L16 4" fill="#ffffff" stroke="#1e293b" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            ${renderCharacterHairAndHat(char)}

            ${isAngryOrStress
              ? `<path d="M1 -8 L6 -5 M9 -5 L14 -8" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>`
              : isHappy
              ? `<path d="M1 -7 Q4 -10 7 -7 M8 -7 Q11 -10 14 -7" fill="none" stroke="#1e293b" stroke-width="1.9" stroke-linecap="round"/>`
              : `<path d="M1 -7 L6 -7 M9 -7 L14 -7" fill="none" stroke="#1e293b" stroke-width="1.9" stroke-linecap="round"/>`
            }

            <circle cx="4" cy="-2" r="2.1" fill="#0f172a"/>
            <circle cx="11" cy="-2" r="2.1" fill="#0f172a"/>

            ${char.glasses ? `
              <rect x="0.5" y="-5.5" width="6.5" height="6.5" rx="1.5" fill="none" stroke="${char.color}" stroke-width="1.6"/>
              <rect x="8" y="-5.5" width="6.5" height="6.5" rx="1.5" fill="none" stroke="${char.color}" stroke-width="1.6"/>
              <line x1="7" y1="-2.5" x2="8" y2="-2.5" stroke="${char.color}" stroke-width="1.5"/>
            ` : ''}

            ${char.mustache ? `<path d="M3 5 Q8 2 14 6" fill="none" stroke="#475569" stroke-width="2.6" stroke-linecap="round"/>` : ''}

            <ellipse class="mouth-speaking" cx="8" cy="8.5" rx="4" ry="3" fill="#dc2626"/>
            ${isHappy
              ? `<path class="mouth-idle" d="M3 7 Q8 12 13 7" fill="none" stroke="#16a34a" stroke-width="2.2" stroke-linecap="round"/>`
              : mood === 'risk'
              ? `<circle class="mouth-idle" cx="8" cy="8.5" r="2.8" fill="none" stroke="#dc2626" stroke-width="2"/>`
              : `<line class="mouth-idle" x1="4" y1="8.5" x2="12" y2="8.5" stroke="#1e293b" stroke-width="2.1" stroke-linecap="round"/>`
            }
          </g>

          <!-- BRAZO DELANTERO ARTICULADO -->
          <g class="shoulder-front" transform="translate(5, 28)">
            <line x1="0" y1="0" x2="13" y2="19" stroke="${char.color}" stroke-width="4.5" stroke-linecap="round"/>
            <circle cx="13" cy="19" r="2.7" fill="${char.color}"/>
            <g class="elbow-front" transform="translate(13, 19)">
              <line x1="0" y1="0" x2="17" y2="-6" stroke="${char.color}" stroke-width="4.5" stroke-linecap="round"/>
              <g transform="translate(17, -6)">
                <circle cx="0" cy="0" r="3.6" fill="#fde68a" stroke="${char.color}" stroke-width="1.8"/>
                ${renderCharacterProp(char)}
              </g>
            </g>
          </g>
        </g>
      </g>

      <!-- Etiqueta de Nombre y Rol -->
      <g transform="translate(0, 158)">
        <rect x="-56" y="-11" width="112" height="22" rx="11" fill="white" stroke="${char.color}" stroke-width="1.6"/>
        <text x="0" y="3.5" text-anchor="middle" fill="#1e293b" font-size="10.5" font-weight="700" font-family="Inter, Arial">
          ${esc(displayName)} · <tspan fill="${char.color}" font-weight="600">${esc(char.role)}</tspan>
        </text>
      </g>
    </g>
  `;
}

function renderStageCenterProp(stageType, mood, actNumber = 1, isEnding = false) {
  const color = mood === 'success' ? '#16a34a' : mood === 'risk' ? '#dc2626' : mood === 'warn' ? '#d97706' : '#365cf5';
  const bg = mood === 'success' ? '#dcfce7' : mood === 'risk' ? '#fee2e2' : mood === 'warn' ? '#fef3c7' : '#e0e7ff';
  const statusText = isEnding
    ? (mood === 'success' ? 'CASO RESUELTO' : mood === 'risk' ? 'CRISIS ACTIVA' : 'ACUERDO PARCIAL')
    : (voiceMuted ? '⚡ ¡DECIDE!' : `ACTO 0${actNumber}`);

  return `
    <g transform="translate(290, 58)">
      <rect x="-62" y="0" width="124" height="82" rx="11" fill="#0f172a" stroke="${color}" stroke-width="2.8"/>
      <rect x="-54" y="8" width="108" height="48" rx="6" fill="${bg}"/>

      ${stageType === 'chart' ? `
        <polyline points="-42,42 -20,26 -4,38 16,18 40,30" fill="none" stroke="${color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
      ` : stageType === 'valve' ? `
        <circle cx="0" cy="32" r="14" fill="white" stroke="${color}" stroke-width="2.8"/>
        <line x1="0" y1="32" x2="${mood === 'risk' ? '10' : '-7'}" y2="22" stroke="${color}" stroke-width="2.8" stroke-linecap="round"/>
      ` : `
        <line x1="-38" y1="20" x2="20" y2="20" stroke="${color}" stroke-width="2.8" stroke-linecap="round"/>
        <line x1="-38" y1="32" x2="34" y2="32" stroke="${color}" stroke-width="2.8" stroke-linecap="round" stroke-opacity="0.6"/>
        <line x1="-38" y1="44" x2="8" y2="44" stroke="${color}" stroke-width="2.8" stroke-linecap="round" stroke-opacity="0.6"/>
      `}

      <text id="SimStageStatusText" x="0" y="72" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="700" font-family="Inter, Arial" letter-spacing="0.5">${statusText}</text>

      <rect x="-32" y="98" width="64" height="7" rx="3.5" fill="#64748b"/>
      <line x1="-20" y1="105" x2="-20" y2="136" stroke="#64748b" stroke-width="3.8"/>
      <line x1="20" y1="105" x2="20" y2="136" stroke="#64748b" stroke-width="3.8"/>

      ${mood === 'risk' ? `
        <g class="sparks-fx">
          <path d="M-44 -6 L-32 -20 L-26 -8 L-14 -24" fill="none" stroke="#ef4444" stroke-width="2.6" stroke-linecap="round"/>
          <path d="M44 -6 L32 -20 L26 -8 L14 -24" fill="none" stroke="#f97316" stroke-width="2.6" stroke-linecap="round"/>
        </g>
      ` : ''}
    </g>
  `;
}

function getActDialogueLines(challenge, actIdx, prevChoice, endingKey) {
  if (endingKey && challenge.endings?.[endingKey]) {
    const endObj = challenge.endings[endingKey];
    const lastAct = challenge.acts[2];
    const replySide = endObj.replySpeaker || 'left';
    const youSide = replySide === 'left' ? 'right' : 'left';
    return {
      leftChar: endObj.leftChar || lastAct.leftChar,
      rightChar: endObj.rightChar || lastAct.rightChar,
      enterSide: null,
      mood: endObj.mood || 'neutral',
      lines: [
        { speaker: youSide, text: endObj.youSay },
        { speaker: replySide, text: endObj.replyText }
      ]
    };
  }
  const act = challenge.acts[actIdx] || challenge.acts[0];
  const prevMap = act.scriptByPrev || {};
  const firstFallback = Object.values(prevMap)[0] || [];
  const lines = act.script || prevMap[prevChoice] || prevMap.default || firstFallback;
  return {
    leftChar: act.leftChar,
    rightChar: act.rightChar,
    enterSide: act.enterSide || null,
    mood: 'neutral',
    lines
  };
}

function markSceneReadyToDecide() {
  const decideEl = document.getElementById('SimDecideBadge');
  if (decideEl) {
    decideEl.className = 'decide-now-badge ready';
    decideEl.textContent = '⚡ ¡DECIDE!';
  }
  const stageTxt = document.getElementById('SimStageStatusText');
  if (stageTxt && !stageTxt.dataset.isEnding) {
    stageTxt.textContent = '⚡ ¡DECIDE!';
  }
  const grid = document.getElementById('SimChoicesGrid');
  if (grid) grid.classList.add('choices-ready');
}

function playChallengeSceneAudio(challenge, actIdx = 0, prevChoice = 'default', endingKey = null) {
  stopAllVoices();
  const currentRun = speechRunId;
  const sceneData = getActDialogueLines(challenge, actIdx, prevChoice, endingKey);

  if (voiceMuted) {
    if (!endingKey) setTimeout(markSceneReadyToDecide, 50);
    return;
  }

  const startTimer = setTimeout(() => {
    if (currentRun !== speechRunId) return;

    if (endingKey) {
      if (sceneData.mood === 'risk') playSound('alarm');
      else if (sceneData.mood === 'success') playSound('badge');
      else playSound('step');
    } else if (actIdx > 0) {
      playSound('step');
    }

    const line1 = sceneData.lines[0];
    const line2 = sceneData.lines[1];
    if (!line1) {
      if (!endingKey) markSceneReadyToDecide();
      return;
    }

    const char1 = line1.speaker === 'left' ? sceneData.leftChar : sceneData.rightChar;
    const b1 = document.getElementById(line1.speaker === 'left' ? 'SimBubbleLeft' : 'SimBubbleRight');
    const b2 = line2 ? document.getElementById(line2.speaker === 'left' ? 'SimBubbleLeft' : 'SimBubbleRight') : null;

    if (b1) b1.classList.add('active-bubble');
    if (b2) b2.classList.remove('active-bubble');

    speakLine(char1, line1.text, `.actor-${line1.speaker}`, () => {
      if (currentRun !== speechRunId) return;
      if (b1) b1.classList.remove('active-bubble');
      if (!line2) {
        if (!endingKey) markSceneReadyToDecide();
        return;
      }
      const char2 = line2.speaker === 'left' ? sceneData.leftChar : sceneData.rightChar;
      if (b2) b2.classList.add('active-bubble');
      speakLine(char2, line2.text, `.actor-${line2.speaker}`, () => {
        if (b2) b2.classList.remove('active-bubble');
        if (!endingKey) markSceneReadyToDecide();
      }, currentRun);
    }, currentRun);
  }, 75);

  sceneTimers.push(startTimer);
}

function openSkillModal(challengeId, actIdx = 0, prevChoice = 'default', endingKey = null) {
  const challenge = SOFT_SKILLS_CHALLENGES.find(c => c.id === challengeId);
  if (!challenge) return;

  const currentAct = challenge.acts[actIdx] || challenge.acts[0];
  const endingObj = endingKey ? challenge.endings?.[endingKey] : null;
  const sceneData = getActDialogueLines(challenge, actIdx, prevChoice, endingKey);
  const mood = sceneData.mood;

  const leftLine = sceneData.lines.find(l => l.speaker === 'left')?.text || '';
  const rightLine = sceneData.lines.find(l => l.speaker === 'right')?.text || '';
  const leftCharObj = STICK_CHARACTERS[sceneData.leftChar] || STICK_CHARACTERS.you;
  const rightCharObj = STICK_CHARACTERS[sceneData.rightChar] || STICK_CHARACTERS.you;

  const progressPct = endingObj ? 100 : Math.round(((actIdx + 1) / (challenge.acts.length + 1)) * 100);

  openModal(`
    <style>
      .theater-box {
        background: linear-gradient(180deg, #f0f4ff 0%, #f8fafc 78%, #eef2f8 78%, #e2e8f0 100%);
        border: 1px solid #d5e0f5;
        border-radius: 16px;
        padding: 12px 16px 10px;
        margin: 8px 0 12px;
        position: relative;
        overflow: hidden;
      }
      .story-progress-wrap {
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .story-progress-track {
        flex: 1;
        height: 8px;
        background: #e6ecf7;
        border-radius: 999px;
        overflow: hidden;
        position: relative;
      }
      .story-progress-fill {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #365cf5 0%, #60a5fa 100%);
        transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .story-progress-label {
        font-size: 10.5px;
        font-weight: 750;
        color: var(--blue);
        white-space: nowrap;
      }
      .decide-now-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 11px;
        border-radius: 999px;
        font-size: 10.5px;
        font-weight: 750;
        letter-spacing: 0.5px;
        background: #eef2ff;
        color: #5b6b8a;
        border: 1px solid #d8e2f8;
        margin-bottom: 5px;
        transition: all 0.25s ease;
      }
      .decide-now-badge.ready {
        background: #365cf5;
        color: #ffffff;
        border-color: #365cf5;
        box-shadow: 0 4px 14px rgba(54, 92, 245, 0.28);
        animation: pulseDecide 1.1s ease-in-out infinite alternate;
      }
      @keyframes pulseDecide {
        0% { transform: scale(1); }
        100% { transform: scale(1.06); }
      }
      .comic-bubbles-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 4px;
      }
      .comic-bubble {
        background: white;
        border: 1.5px solid #cbd5e1;
        border-radius: 12px;
        padding: 9px 12px;
        font-size: 12px;
        line-height: 1.4;
        color: #1e293b;
        cursor: pointer;
        transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
      }
      .comic-bubble.active-bubble {
        border-color: var(--blue);
        box-shadow: 0 6px 18px rgba(54,92,245,0.15);
        transform: translateY(-1px);
      }
      .comic-bubble strong {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 2px;
      }

      /* Entrada dinámica de personajes en nuevos actos */
      .stick-actor.enter-left .actor-rig {
        animation: walkInLeft 0.55s cubic-bezier(0.2, 0.9, 0.3, 1) forwards, actorBreathe 2.2s ease-in-out 0.55s infinite alternate;
      }
      .stick-actor.enter-right .actor-rig {
        animation: walkInRight 0.55s cubic-bezier(0.2, 0.9, 0.3, 1) forwards, actorBreathe 2.2s ease-in-out 0.55s infinite alternate;
      }
      @keyframes walkInLeft {
        0% { transform: translateX(-95px); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
      @keyframes walkInRight {
        0% { transform: translateX(-95px); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }

      /* Animaciones esqueléticas sobre .actor-rig (hijo de .actor-facing) */
      .stick-actor .actor-rig {
        animation: actorBreathe 2.2s ease-in-out infinite alternate;
      }
      .stick-actor.actor-right .actor-rig { animation-delay: 0.35s; }

      .stick-actor .mouth-speaking { display: none; }
      .stick-actor.is-speaking .mouth-idle { display: none; }
      .stick-actor.is-speaking .mouth-speaking {
        display: block;
        animation: lipSync 0.18s ease-in-out infinite alternate;
      }
      .stick-actor.is-speaking .head-rig {
        animation: headTalk 0.45s ease-in-out infinite alternate;
      }
      .stick-actor.is-speaking .shoulder-front {
        animation: shoulderGesture 0.55s ease-in-out infinite alternate;
      }
      .stick-actor.is-speaking .elbow-front {
        animation: elbowBend 0.42s ease-in-out infinite alternate;
      }
      .stick-actor.is-speaking .shoulder-back {
        animation: backArmMove 0.65s ease-in-out infinite alternate;
      }
      .stick-actor.is-speaking .thigh-front {
        animation: legStep 0.6s ease-in-out infinite alternate;
      }

      .shoulder-front {
        transform-origin: 0px 0px;
        animation: idleShoulder 1.8s ease-in-out infinite alternate;
      }
      .elbow-front {
        transform-origin: 0px 0px;
        animation: idleElbow 1.4s ease-in-out infinite alternate;
      }
      .thigh-front, .thigh-back, .shin-front, .shin-back { transform-origin: 0px 0px; }
      .head-rig { transform-origin: 0px 15px; }

      .stick-actor.mood-success .shoulder-front {
        animation: celebrateShoulder 0.45s ease-in-out infinite alternate !important;
      }
      .stick-actor.mood-success .elbow-front {
        animation: celebrateElbow 0.45s ease-in-out infinite alternate !important;
      }
      .stick-actor.mood-risk .actor-rig {
        animation: panicJump 0.35s ease-in-out 3;
      }

      @keyframes lipSync {
        0% { transform: scaleY(0.25); }
        100% { transform: scaleY(1.15); }
      }
      @keyframes headTalk {
        0% { transform: rotate(-3deg) translateY(0); }
        100% { transform: rotate(4deg) translateY(-2px); }
      }
      @keyframes shoulderGesture {
        0% { transform: translate(5px, 28px) rotate(-18deg); }
        100% { transform: translate(5px, 28px) rotate(15deg); }
      }
      @keyframes elbowBend {
        0% { transform: translate(13px, 19px) rotate(-36deg); }
        100% { transform: translate(13px, 19px) rotate(16deg); }
      }
      @keyframes backArmMove {
        0% { transform: translate(-5px, 28px) rotate(8deg); }
        100% { transform: translate(-5px, 28px) rotate(-12deg); }
      }
      @keyframes legStep {
        0% { transform: translate(5px, 76px) rotate(0deg); }
        100% { transform: translate(5px, 76px) rotate(-9deg); }
      }
      @keyframes idleShoulder {
        0% { transform: translate(5px, 28px) rotate(-4deg); }
        100% { transform: translate(5px, 28px) rotate(5deg); }
      }
      @keyframes idleElbow {
        0% { transform: translate(13px, 19px) rotate(-10deg); }
        100% { transform: translate(13px, 19px) rotate(8deg); }
      }
      @keyframes celebrateShoulder {
        0% { transform: translate(5px, 28px) rotate(-55deg); }
        100% { transform: translate(5px, 28px) rotate(-85deg); }
      }
      @keyframes celebrateElbow {
        0% { transform: translate(13px, 19px) rotate(-25deg); }
        100% { transform: translate(13px, 19px) rotate(10deg); }
      }
      @keyframes actorBreathe {
        0% { transform: translateY(0px); }
        100% { transform: translateY(-3px); }
      }
      @keyframes panicJump {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(-4px, -7px); }
      }

      .quick-choices-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
        gap: 9px;
        margin-top: 8px;
      }
      .quick-choice-btn {
        background: white;
        border: 1.5px solid #cfd9ee;
        border-radius: 10px;
        padding: 11px 13px;
        font-size: 12px;
        font-weight: 650;
        color: #1e293b;
        text-align: center;
        cursor: pointer;
        transition: border-color 0.15s, background 0.15s, transform 0.15s, box-shadow 0.2s;
      }
      .choices-ready .quick-choice-btn {
        border-color: #93b4ff;
        box-shadow: 0 4px 12px rgba(54, 92, 245, 0.08);
      }
      .quick-choice-btn:hover {
        border-color: var(--blue);
        background: #f0f4ff;
        transform: translateY(-1px);
      }
      .ending-feedback-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 12px;
      }
      .ending-actions-row {
        display: flex;
        gap: 10px;
      }
      @media (max-width: 560px) {
        .theater-box {
          padding: 10px 10px 8px;
          margin: 6px 0 10px;
        }
        .comic-bubbles-row {
          grid-template-columns: 1fr;
          gap: 6px;
        }
        .comic-bubble {
          padding: 7px 10px;
          font-size: 11.5px;
        }
        .theater-box svg {
          height: 150px;
        }
        .quick-choices-grid {
          grid-template-columns: 1fr;
          gap: 7px;
        }
        .quick-choice-btn {
          padding: 10px 12px;
          font-size: 11.5px;
        }
        .ending-feedback-grid {
          grid-template-columns: 1fr;
          gap: 8px;
        }
        .ending-actions-row {
          flex-direction: column;
        }
      }
    </style>

    <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; padding-right:32px; flex-wrap:wrap;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="eyebrow" style="margin:0; color:var(--blue);">RETO 0${challenge.id}</span>
        <strong style="font-size:15.5px; color:#202a3d;">${esc(challenge.title)}</strong>
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        <button type="button" class="btn outline" data-action="replay-scene:${challenge.id}:${actIdx}:${prevChoice}:${endingKey || ''}" style="padding:4px 10px; font-size:11px;">
          🔊 Repetir voz
        </button>
        <button type="button" class="btn outline" data-action="toggle-voice:${challenge.id}:${actIdx}:${prevChoice}:${endingKey || ''}" style="padding:4px 10px; font-size:11px;">
          ${voiceMuted ? '🔇 Voz: OFF' : '🎙️ Voz: ON'}
        </button>
      </div>
    </div>

    <div class="story-progress-wrap">
      <div class="story-progress-track">
        <div class="story-progress-fill" style="width: ${progressPct}%;"></div>
      </div>
      <span class="story-progress-label">${endingObj ? '100% · Desenlace' : `${progressPct}%`}</span>
    </div>

    <div class="theater-box">
      <div class="comic-bubbles-row">
        <div id="SimBubbleLeft" class="comic-bubble" data-action="speak-single:${sceneData.leftChar}:left:${esc(leftLine)}" title="Clic para escuchar">
          <strong style="color:${leftCharObj.color};">
            <span>${esc(leftCharObj.name === 'Tú' && state.name ? state.name.split(' ')[0] : leftCharObj.name)} · ${esc(leftCharObj.role)}</span>
          </strong>
          <span>«${esc(leftLine)}»</span>
        </div>
        <div id="SimBubbleRight" class="comic-bubble" data-action="speak-single:${sceneData.rightChar}:right:${esc(rightLine)}" title="Clic para escuchar">
          <strong style="color:${rightCharObj.color};">
            <span>${esc(rightCharObj.name === 'Tú' && state.name ? state.name.split(' ')[0] : rightCharObj.name)} · ${esc(rightCharObj.role)}</span>
          </strong>
          <span>«${esc(rightLine)}»</span>
        </div>
      </div>

      <svg viewBox="0 0 580 220" width="100%" height="198" role="img" aria-label="Escenario animado">
        <line x1="24" y1="194" x2="556" y2="194" stroke="#cbd5e1" stroke-width="3.5" stroke-linecap="round"/>
        ${renderStageCenterProp(challenge.stageType, mood, actIdx + 1, !!endingObj)}
        ${renderArticulatedActor(sceneData.leftChar, 'left', mood, !endingObj && sceneData.enterSide === 'left')}
        ${renderArticulatedActor(sceneData.rightChar, 'right', mood, !endingObj && sceneData.enterSide === 'right')}
      </svg>
    </div>

    ${!endingObj ? `
      <div style="text-align:center;">
        <span id="SimDecideBadge" class="decide-now-badge ${voiceMuted ? 'ready' : ''}">
          ${voiceMuted ? '⚡ ¡DECIDE!' : '🎙️ Escuchando diálogo...'}
        </span>
        <strong style="font-size:12.5px; color:#202a3d; display:block; margin-bottom:6px;">
          ${esc(currentAct.prompt)}
        </strong>
        <div id="SimChoicesGrid" class="quick-choices-grid ${voiceMuted ? 'choices-ready' : ''}">
          ${currentAct.choices.map(c => `
            <button type="button" class="quick-choice-btn" data-action="skill-act-choice:${challenge.id}:${actIdx}:${c.id}:${c.ending || ''}">
              ${esc(c.label || c.shortLabel || '')}
            </button>
          `).join('')}
        </div>
      </div>
    ` : `
      <div style="background: ${endingObj.mood === 'success' ? '#eef8f0' : endingObj.mood === 'warn' ? '#fef9e7' : '#fdf2f1'}; border: 1px solid ${endingObj.mood === 'success' ? '#a8dab5' : endingObj.mood === 'warn' ? '#f3d98b' : '#f5c2be'}; border-radius: 11px; padding: 9px 13px; margin-bottom: 10px; text-align: center;">
        <strong style="font-size: 12.5px; color: #202a3d;">${esc(endingObj.badge)}</strong>
      </div>

      <div class="ending-feedback-grid">
        <div style="background: #eef8f0; border: 1px solid #b7e1c1; border-radius: 10px; padding: 9px 12px; font-size: 11.5px; color: #1f5432;">
          <strong>✅ Punto a favor:</strong> ${esc(endingObj.good)}
        </div>
        <div style="background: #fdf2f1; border: 1px solid #f5c2be; border-radius: 10px; padding: 9px 12px; font-size: 11.5px; color: #8c2f28;">
          <strong>⚠️ Consecuencia:</strong> ${esc(endingObj.bad)}
        </div>
      </div>

      <div class="ending-actions-row">
        <button type="button" class="btn outline" data-action="skill-retry:${challenge.id}" style="flex: 1; margin: 0; padding: 10px;">
          🔄 Explorar otro camino (4 finales)
        </button>
        ${endingObj.mood === 'success' ? `
          <button type="button" class="btn primary" data-action="skill-complete:${challenge.id}" style="flex: 1; margin: 0; padding: 10px; background:#2e7d47;">
            Guardar reto superado ${icon('check')}
          </button>
        ` : ''}
      </div>
    `}
  `, true);

  playChallengeSceneAudio(challenge, actIdx, prevChoice, endingKey);
}

function viewSoftSkills() {
  const completedCount = Object.keys(state.completedSkills || {}).filter(k => state.completedSkills[k]).length;
  return `
  <div class="sim-container">
     <div style="background: white; border: 1px solid var(--line); border-radius: 16px; padding: 20px 26px; margin-bottom: 24px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px;">
        <div>
          <h3 style="margin: 0 0 4px 0; font-size: 20px; color: #202a3d;">🎭 Habilidades Blandas en 3 Actos</h3>
          <p style="margin: 0; font-size: 12.5px; color: #727b8d;">Nuevos personajes entran en escena según tus decisiones y desbloquean hasta 4 finales por historia.</p>
        </div>
        <div style="text-align: right;">
          <strong style="font-size: 28px; color: var(--blue); line-height: 1;">${completedCount} <span style="font-size: 16px; color: #8a93a8;">/ ${SOFT_SKILLS_CHALLENGES.length}</span></strong>
          <p style="margin: 4px 0 0; font-size: 9.5px; color: #8a93a8; font-weight: 700; letter-spacing: 0.5px;">ESCENARIOS SUPERADOS</p>
        </div>
     </div>

     <div class="grid-3">
        ${SOFT_SKILLS_CHALLENGES.map((reto, i) => {
          const done = !!state.completedSkills?.[reto.id];
          const castNames = (reto.cast || []).map(k => STICK_CHARACTERS[k]?.name).filter(Boolean).join(', ');
          return `
          <div data-action="open-skill:${reto.id}" style="background: white; border: 1px solid ${done ? '#a8dab5' : 'var(--line)'}; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
             <div style="position: relative; height: 148px; background: #0f172a; overflow: hidden;">
               <img src="${esc(reto.image)}" alt="${esc(reto.title)}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; display: block;">
               <span style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.78); color: white; font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 7px;">
                 🎬 3 Actos · 4 Finales
               </span>
               <span style="position: absolute; top: 10px; right: 10px; background: ${done ? '#eef8f0' : 'rgba(255,255,255,0.92)'}; color: ${done ? '#2e7d47' : '#202a3d'}; font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 7px;">
                 ${done ? '✅ Superado' : `Reto 0${i + 1}`}
               </span>
             </div>

             <div style="padding: 18px 20px 20px; display: flex; flex-direction: column; flex: 1;">
               <h4 style="font-size: 16.5px; margin: 0 0 6px; color: #202a3d;">${esc(reto.title)}</h4>
               <p style="font-size: 12.5px; line-height: 1.5; color: #727b8d; flex: 1; margin: 0 0 10px 0;">${esc(reto.shortDesc)}</p>
               <p style="font-size: 11px; color: #475569; margin: 0 0 14px 0;">
                 <strong>👥 Reparto:</strong> ${esc(castNames)} y tú
               </p>
               <button type="button" class="btn ${done ? 'outline' : 'primary'} full" style="margin-top: 0; pointer-events: none;">
                 ${done ? 'Repetir historia' : 'Entrar a escena'} ${icon('arrow')}
               </button>
             </div>
          </div>
          `;
        }).join('')}
     </div>
  </div>
  `;
}

// 10. VISTA 3: PROYECTOS REALES CON IMÁGENES FULL HD E INSIGNIAS
function getProjectUserState(projectId) {
  if (!state.projectState) state.projectState = {};
  if (!state.projectState[projectId]) {
    state.projectState[projectId] = { teamId: null, teamName: '', checks: [false, false, false, false], completed: false };
  }
  return state.projectState[projectId];
}

function viewProjects() {
  const earnedBadges = state.badges || [];
  return `
  <div class="sim-container">
     <div style="background: white; border: 1px solid var(--line); border-radius: 16px; padding: 20px 26px; margin-bottom: 24px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px;">
       <div>
         <h3 style="margin: 0 0 4px 0; font-size: 20px; color: #202a3d;">🚀 Proyectos Colaborativos</h3>
         <p style="margin: 0; font-size: 12.5px; color: #727b8d;">Únete a un equipo, marca los 4 entregables y desbloquea tu insignia oficial.</p>
       </div>
       <div style="display: flex; flex-wrap: wrap; gap: 8px;">
         ${PROJECTS_DATA.map(p => {
           const unlocked = earnedBadges.includes(p.badge.id);
           return `
             <div style="display: inline-flex; align-items: center; gap: 7px; padding: 6px 11px; border-radius: 10px; border: 1px solid ${unlocked ? p.badge.color : '#e2e7f1'}; background: ${unlocked ? p.badge.bg : '#f8f9fc'};">
               <span style="font-size: 12px;">${unlocked ? '🏆' : '🔒'}</span>
               <strong style="font-size: 11px; color: ${unlocked ? p.badge.color : '#727b8d'};">${esc(p.badge.title)}</strong>
             </div>
           `;
         }).join('')}
       </div>
     </div>

     <div class="grid-3">
        ${PROJECTS_DATA.map(p => {
          const pState = getProjectUserState(p.id);
          const hasTeam = !!pState.teamName;
          const doneCount = (pState.checks || []).filter(Boolean).length;
          const isCompleted = !!pState.completed;
          const teams = teamsByProject[p.id] || [];

          let btnLabel = 'Ver equipos';
          if (hasTeam && !isCompleted) btnLabel = `Ver actividades (${doneCount}/4)`;
          if (isCompleted) btnLabel = '🏆 Completado · Ver insignia';

          return `
          <div style="background: white; border: 1px solid ${isCompleted ? '#a8dab5' : hasTeam ? '#b8c8ff' : 'var(--line)'}; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column;">
             <div style="position: relative; height: 156px; background: #0f172a; overflow: hidden;">
               <img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; display: block;">
               <div style="position: absolute; top: 10px; left: 10px; display: flex; gap: 6px;">
                 ${p.tags.map(t => `<span style="font-size: 9.5px; background: rgba(15, 23, 42, 0.8); color: #ffffff; padding: 3px 8px; border-radius: 6px; font-weight: 600;">${esc(t)}</span>`).join('')}
               </div>
               <span style="position: absolute; top: 10px; right: 10px; font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 7px; background: ${isCompleted ? '#eef8f0' : 'rgba(255,255,255,0.92)'}; color: ${isCompleted ? '#2e7d47' : hasTeam ? 'var(--blue)' : '#475569'};">
                 ${isCompleted ? '✅ Terminado' : hasTeam ? esc(pState.teamName) : `${teams.length} equipos`}
               </span>
             </div>

             <div style="padding: 18px 20px 20px; display: flex; flex-direction: column; flex: 1;">
               <h4 style="font-size: 16.5px; margin: 0 0 8px 0; color: #202a3d; line-height: 1.3;">${esc(p.title)}</h4>
               <p style="font-size: 12.5px; line-height: 1.5; color: #727b8d; flex: 1; margin: 0;">${esc(p.desc)}</p>

               <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--line);">
                  <p style="font-size: 11px; margin: 0 0 12px 0; color: #535e74;">
                    <strong>${esc(p.mentor)}</strong> · ${esc(p.weeks)}
                  </p>
                  <button type="button" class="btn ${hasTeam ? 'outline' : 'primary'} full" data-action="project-details:${p.id}" style="margin-top: 0; ${hasTeam ? 'border-color:var(--blue); color:var(--blue);' : ''}">
                    ${esc(btnLabel)}
                  </button>
               </div>
             </div>
          </div>
          `;
        }).join('')}
     </div>
  </div>
  `;
}

// 11. MODALES DE PERFIL Y PROYECTOS
function profile() {
  const earnedBadges = PROJECTS_DATA.filter(p => (state.badges || []).includes(p.badge.id));
  openModal(`
    <span class="eyebrow">PERFIL</span>
    <h2 id="modal-title" style="margin-bottom: 12px; font-size: 20px;">${esc(state.name)}</h2>
    <div style="background: #f6f8fc; padding: 14px 16px; border-radius: 12px; margin-bottom: 14px; font-size: 12.5px; color: #3c4963; border: 1px solid var(--line);">
      <p style="margin: 0 0 6px 0;"><strong>Universidad:</strong> ${esc(state.university)}</p>
      <p style="margin: 0;"><strong>Carrera:</strong> ${esc(state.career)}</p>
      ${state.aiProfile ? `<p style="margin: 8px 0 0 0; padding-top: 8px; border-top: 1px solid #e2e7f2; font-size: 11.5px; color: #2b479b;"><strong>✨ IA:</strong> ${esc(state.aiProfile.summary)}</p>` : ''}
    </div>

    ${earnedBadges.length > 0 ? `
      <div style="margin-bottom: 16px;">
        <span style="font-size: 9.5px; font-weight: 700; letter-spacing: 0.7px; color: #8a93a8; display: block; margin-bottom: 6px;">🏆 INSIGNIAS OBTENIDAS</span>
        <div style="display: grid; gap: 6px;">
          ${earnedBadges.map(p => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; border-radius: 9px; background: ${p.badge.bg}; border: 1px solid ${p.badge.color};">
              <strong style="font-size: 11.5px; color: ${p.badge.color};">🏆 ${esc(p.badge.title)}</strong>
              <small style="font-size: 10px; color: #535e74;">${esc(p.title)}</small>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <div style="display: flex; gap: 10px;">
      <button type="button" class="btn outline full" data-action="edit-profile" style="margin-top: 0;">Editar datos</button>
      <button type="button" class="btn primary full" data-action="logout" style="margin-top: 0; background: #dc8b85; border-color: #dc8b85;">Cerrar sesión</button>
    </div>
  `);
}

function showProjectDetails(projectId, forceTeamSelection = false) {
  const p = PROJECTS_DATA.find(x => x.id === projectId);
  if (!p) return;
  const pState = getProjectUserState(projectId);
  const teams = teamsByProject[projectId] || [];

  const coverBanner = p.image ? `
    <div style="height: 135px; border-radius: 12px; overflow: hidden; margin-bottom: 12px; position: relative; background: #0f172a;">
      <img src="${esc(p.image)}" alt="${esc(p.title)}" style="width: 100%; height: 100%; object-fit: cover; display: block;">
      <span style="position: absolute; bottom: 8px; right: 8px; background: rgba(15,23,42,0.78); color: white; font-size: 9.5px; font-weight: 700; padding: 3px 8px; border-radius: 6px;">
        📸 Vista de proyecto Full HD
      </span>
    </div>
  ` : '';

  if (!pState.teamName || forceTeamSelection) {
    openModal(`
      <span class="eyebrow" style="color:var(--blue);">EQUIPOS DEL PROYECTO</span>
      <h2 id="modal-title" style="font-size: 20px; margin: 4px 0 6px;">${esc(p.title)}</h2>
      <p style="font-size: 12px; color: #697386; margin: 0 0 12px 0;">Mentor: <strong>${esc(p.mentor)}</strong> · Insignia: <strong>🏆 ${esc(p.badge.title)}</strong></p>
      ${coverBanner}

      <div style="display: grid; gap: 8px; margin-bottom: 16px;">
        ${teams.map(t => {
          const isMember = pState.teamId === t.id;
          const canJoin = t.spots > 0 || isMember;
          return `
            <div style="padding: 11px 14px; border: 1px solid ${isMember ? 'var(--blue)' : 'var(--line)'}; border-radius: 10px; background: ${isMember ? '#f0f4ff' : 'white'}; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px;">
              <div>
                <strong style="font-size: 12.5px; color: #202a3d; display: block;">${esc(t.name)}</strong>
                <small style="font-size: 11px; color: #727b8d;">${esc((t.members || []).join(', '))}</small>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="background: ${t.spots > 0 ? '#eaf3eb' : '#f1f3f7'}; color: ${t.spots > 0 ? '#52795d' : '#8a93a8'}; font-size: 10px; padding: 3px 8px; border-radius: 8px; font-weight: 600;">
                  ${t.spots > 0 ? `${t.spots} vacantes` : 'Completo'}
                </span>
                ${canJoin ? `
                  <button type="button" class="btn primary" data-action="join-team:${p.id}:${t.id}" style="padding: 6px 12px; font-size: 11px;">
                    ${isMember ? 'Ver actividades' : 'Unirme'}
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <style>
        .create-team-grid {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 8px;
          align-items: center;
        }
        @media (max-width: 560px) {
          .create-team-grid {
            grid-template-columns: 1fr;
          }
          .create-team-grid select,
          .create-team-grid button {
            width: 100% !important;
          }
        }
      </style>
      <div style="background: #f8f9fc; border: 1px solid var(--line); border-radius: 11px; padding: 13px;">
        <strong style="font-size: 11.5px; color: #202a3d; display: block; margin-bottom: 8px;">✨ O crea tu propio equipo:</strong>
        <form id="create-team-form" class="create-team-grid" data-project="${p.id}">
          <input name="teamName" maxlength="32" placeholder="Nombre del equipo" required style="margin:0; padding:9px 11px; background:white;">
          <select name="spots" style="margin:0; padding:9px; width:auto; min-height:0; background:white;">
            <option value="2">2 vacantes</option>
            <option value="3">3 vacantes</option>
            <option value="4">4 vacantes</option>
            <option value="1">1 vacante</option>
          </select>
          <button type="submit" class="btn outline" style="padding: 9px 12px; border-color: var(--blue); color: var(--blue); white-space: nowrap;">
            Crear y unirme
          </button>
        </form>
      </div>
    `, true);
    return;
  }

  const checks = pState.checks || [false, false, false, false];
  const doneCount = checks.filter(Boolean).length;
  const allChecked = doneCount === p.activities.length;

  openModal(`
    <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding-right:28px;">
      <span class="eyebrow" style="margin:0; color:var(--blue);">${esc(pState.teamName.toUpperCase())}</span>
      <button type="button" class="text-link" data-action="change-team:${p.id}" style="font-size:11px;">Cambiar equipo</button>
    </div>
    <h2 id="modal-title" style="font-size: 19px; margin: 6px 0 10px;">${esc(p.title)}</h2>
    ${coverBanner}

    <div style="background: #f8f9fc; border: 1px solid var(--line); border-radius: 10px; padding: 11px 14px; margin-bottom: 14px;">
      <div style="display:flex; justify-content:space-between; font-size:11.5px; margin-bottom:6px;">
        <strong style="color:#202a3d;">Avance de entregables</strong>
        <span style="color:var(--blue); font-weight:700;">${doneCount} / ${p.activities.length}</span>
      </div>
      <div class="bar" style="height: 7px;">
        <span style="width: ${(doneCount / p.activities.length) * 100}%; background: ${allChecked ? '#2e7d47' : 'var(--blue)'}; transition: width 0.25s ease;"></span>
      </div>
    </div>

    <div style="display: grid; gap: 8px; margin-bottom: 18px;">
      ${p.activities.map((act, idx) => {
        const checked = !!checks[idx];
        return `
          <label data-action="toggle-activity:${p.id}:${idx}" style="margin:0; display:flex; align-items:center; gap:10px; padding:11px 13px; border-radius:10px; border:1.5px solid ${checked ? '#9fc8ac' : '#e2e7f1'}; background:${checked ? '#eef8f0' : 'white'}; cursor:pointer; font-weight:500;">
            <input type="checkbox" ${checked ? 'checked' : ''} style="width:17px; height:17px; margin:0; accent-color:#2e7d47; pointer-events:none;">
            <span style="font-size:12px; color:${checked ? '#1f5432' : '#26334d'}; text-decoration:${checked ? 'line-through' : 'none'}; flex:1;">
              ${esc(act)}
            </span>
          </label>
        `;
      }).join('')}
    </div>

    <button type="button" class="btn primary full" data-action="finish-project:${p.id}" ${allChecked ? '' : 'disabled'} style="margin:0; padding:12px 18px; font-size:12.5px; background:${allChecked ? '#2e7d47' : 'var(--blue)'};">
      🏆 Proyecto terminado · Obtener insignia ${icon('check')}
    </button>
  `, true);
}

function showBadgeCelebration(projectId) {
  const p = PROJECTS_DATA.find(x => x.id === projectId);
  if (!p) return;
  const pState = getProjectUserState(projectId);
  playSound('badge');

  openModal(`
    <style>
      .badge-celebration { text-align: center; padding: 10px 8px 4px; }
      .medal-ring {
        width: 92px;
        height: 92px;
        border-radius: 50%;
        margin: 0 auto 14px;
        background: ${p.badge.bg};
        border: 3px solid ${p.badge.color};
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${p.badge.color};
        box-shadow: 0 10px 28px rgba(54, 92, 245, 0.18);
        animation: popMedal 0.5s cubic-bezier(0.18, 1.25, 0.4, 1) forwards;
      }
      .medal-ring svg { width: 40px; height: 40px; }
      @keyframes popMedal {
        0% { transform: scale(0.3); opacity: 0; }
        70% { transform: scale(1.08); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
    </style>
    <div class="badge-celebration">
      <div class="medal-ring">${icon('spark')}</div>
      <span class="eyebrow" style="color:${p.badge.color}; margin-bottom:4px;">🏆 INSIGNIA DESBLOQUEADA</span>
      <h2 id="modal-title" style="font-size: 22px; color: #202a3d; margin: 4px 0 8px;">${esc(p.badge.title)}</h2>
      <p style="font-size: 12.5px; color: #535e74; max-width: 390px; margin: 0 auto 18px;">
        Otorgada a <strong>${esc(state.name)}</strong> por completar <em>${esc(p.title)}</em> con <strong>${esc(pState.teamName)}</strong>.
      </p>
      <div style="display:flex; gap:10px;">
        <button type="button" class="btn outline full" data-action="project-details:${p.id}" style="margin:0;">Ver actividades</button>
        <button type="button" class="btn primary full" data-action="close" style="margin:0;">Listo ${icon('check')}</button>
      </div>
    </div>
  `);
}

// 12. ENRUTADOR PRINCIPAL
const views = { home, mentor: viewMentorSync, skills: viewSoftSkills, projects: viewProjects };

function navigate() {
  stopAllVoices();
  if (!state.name) {
    renderLogin();
    return;
  }
  page = location.hash.slice(1);
  if (!views[page]) page = 'home';
  shell();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', navigate);

// 13. MANEJO DE CLICS Y ACCIONES
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const parts = el.dataset.action.split(':');
  const action = parts[0];
  const arg1 = parts[1];
  const arg2 = parts[2];
  const arg3 = parts[3];
  const arg4 = parts[4];
  const rest = parts.slice(3).join(':');

  if (action === 'close') {
    stopAllVoices();
    $('#modal').close();
  } else if (action === 'auth-tab') {
    authTab = arg1;
    registerStep = 1;
    renderLogin();
  } else if (action === 'pick-career') {
    registerDraft.career = arg1;
    registerStep = 2;
    playSound('tick');
    renderLogin();
  } else if (action === 'quiz-step') {
    registerDraft.quizAnswers[arg1] = arg2;
    registerStep = Math.min(5, registerStep + 1);
    playSound('tick');
    renderLogin();
  } else if (action === 'wiz-back') {
    registerStep = Math.max(1, registerStep - 1);
    renderLogin();
  } else if (action === 'finish-onboarding') {
    const aiProfile = buildAiProfile(registerDraft.quizAnswers);
    const mode = registerDraft.mode || 'register';
    state.name = registerDraft.name;
    state.university = mode === 'guest' ? 'Invitado' : (registerDraft.university || 'ESPOL');
    state.career = registerDraft.career || 'Ingeniería Mecatrónica';
    state.isGuest = mode === 'guest';
    state.aiProfile = aiProfile;
    saveLocal();
    fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: mode === 'guest' ? 'guest' : 'register',
        name: state.name,
        university: state.university,
        career: state.career,
        password: registerDraft.password || 'i3labDT',
        aiProfile
      })
    }).catch(() => {});
    playSound('step');
    toast(`Bienvenido, ${state.name}.`);
    navigate();
  } else if (action === 'quick-user') {
    const acc = serverAccounts.find(a => a.name === arg1);
    if (acc) {
      state.name = acc.name;
      state.university = acc.university || 'ESPOL';
      state.career = acc.career || 'Ingeniería Mecatrónica';
      state.isGuest = !!acc.isGuest;
      state.aiProfile = acc.aiProfile || null;
      saveLocal();
      fetchInitialServerStore().then(() => {
        toast(`Hola de nuevo, ${state.name}`);
        navigate();
      });
    }
  } else if (action === 'profile') {
    profile();
  } else if (action === 'demo-chat') {
    const sc = MENTOR_SCENARIOS.find(s => s.id === Number(arg1));
    if (sc) {
      demoChat.push(structuredClone(sc));
      playSound('step');
      shell();
    }
  } else if (action === 'verify-amber') {
    const idx = Number(arg1);
    if (demoChat[idx]) {
      demoChat[idx].color = 'green';
      demoChat[idx].statusLabel = `VERDE · Fuente contrastada por ${state.name}.`;
      playSound('tick');
      toast('Semáforo actualizado a Verde.');
      shell();
    }
  } else if (action === 'clear-chat') {
    demoChat = [];
    shell();
  } else if (action === 'open-skill') {
    openSkillModal(Number(arg1), 0, 'default', null);
  } else if (action === 'skill-act-choice') {
    const cid = Number(arg1);
    const currentActIdx = Number(arg2);
    const choiceId = arg3 || 'default';
    const endingKey = arg4 || null;
    if (endingKey) {
      openSkillModal(cid, currentActIdx, choiceId, endingKey);
    } else {
      openSkillModal(cid, currentActIdx + 1, choiceId, null);
    }
  } else if (action === 'skill-retry') {
    openSkillModal(Number(arg1), 0, 'default', null);
  } else if (action === 'replay-scene') {
    const ch = SOFT_SKILLS_CHALLENGES.find(c => c.id === Number(arg1));
    if (ch) playChallengeSceneAudio(ch, Number(arg2 || 0), arg3 || 'default', arg4 || null);
  } else if (action === 'toggle-voice') {
    voiceMuted = !voiceMuted;
    if (voiceMuted) stopAllVoices();
    openSkillModal(Number(arg1), Number(arg2 || 0), arg3 || 'default', arg4 || null);
  } else if (action === 'speak-single') {
    stopAllVoices();
    const runId = speechRunId;
    const bubbleEl = arg2 === 'left' ? document.getElementById('SimBubbleLeft') : document.getElementById('SimBubbleRight');
    if (bubbleEl) bubbleEl.classList.add('active-bubble');
    setTimeout(() => {
      speakLine(arg1, rest, `.actor-${arg2}`, () => {
        if (bubbleEl) bubbleEl.classList.remove('active-bubble');
      }, runId);
    }, 60);
  } else if (action === 'skill-complete') {
    stopAllVoices();
    const cid = Number(arg1);
    if (!state.completedSkills) state.completedSkills = {};
    state.completedSkills[cid] = true;
    syncWithServer();
    playSound('badge');
    $('#modal').close();
    shell();
    toast('Reto completado.');
  } else if (action === 'project-details') {
    showProjectDetails(Number(arg1), false);
  } else if (action === 'change-team') {
    showProjectDetails(Number(arg1), true);
  } else if (action === 'join-team') {
    const pid = Number(arg1);
    const tid = arg2;
    const list = teamsByProject[pid] || [];
    const team = list.find(t => t.id === tid);
    if (team) {
      const pState = getProjectUserState(pid);
      if (pState.teamId !== team.id) {
        if (team.spots > 0) team.spots -= 1;
        if (!team.members.includes(state.name)) team.members.push(state.name);
        pState.teamId = team.id;
        pState.teamName = team.name;
      }
      syncWithServer();
      playSound('step');
      toast(`Unido a ${team.name}.`);
      if (page === 'projects') shell();
      showProjectDetails(pid, false);
    }
  } else if (action === 'toggle-activity') {
    const pid = Number(arg1);
    const idx = Number(arg2);
    const pState = getProjectUserState(pid);
    pState.checks[idx] = !pState.checks[idx];
    syncWithServer();
    playSound('tick');
    if (page === 'projects') shell();
    showProjectDetails(pid, false);
  } else if (action === 'finish-project') {
    const pid = Number(arg1);
    const p = PROJECTS_DATA.find(x => x.id === pid);
    const pState = getProjectUserState(pid);
    if (p && pState.checks.every(Boolean)) {
      pState.completed = true;
      if (!Array.isArray(state.badges)) state.badges = [];
      if (!state.badges.includes(p.badge.id)) {
        state.badges.push(p.badge.id);
      }
      syncWithServer();
      if (page === 'projects') shell();
      showBadgeCelebration(pid);
    }
  } else if (action === 'logout') {
    stopAllVoices();
    state.name = '';
    state.university = '';
    state.isGuest = false;
    saveLocal();
    $('#modal').close();
    navigate();
  } else if (action === 'edit-profile') {
    openModal(`
      <span class="eyebrow">EDITAR DATOS</span>
      <h2 id="modal-title">Actualiza tu perfil</h2>
      <form id="profile-form">
        <label for="profile-name">Nombre</label>
        <input id="profile-name" name="name" maxlength="40" value="${esc(state.name)}" required>
        <label for="profile-uni">Universidad</label>
        <input id="profile-uni" name="university" value="${esc(state.university || 'ESPOL')}" required>
        <label for="career">Carrera</label>
        <select name="career" id="career">
          ${CAREERS.map(c => `<option ${state.career === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}
        </select>
        <button class="btn primary full" type="submit">Guardar cambios ${icon('check')}</button>
      </form>
    `);
  }
});

// 14. MANEJO DE FORMULARIOS
document.addEventListener('submit', async e => {
  const form = e.target;
  e.preventDefault();
  const data = new FormData(form);

  if (form.id === 'login-form') {
    const name = String(data.get('name') || '').trim();
    const password = String(data.get('password') || '');
    const errEl = document.getElementById('login-error');
    try {
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', name, password })
      });
      const body = await res.json();
      if (!res.ok) {
        if (errEl) {
          errEl.textContent = body.error || 'Contraseña incorrecta.';
          errEl.style.display = 'block';
        }
        return;
      }
      if (body.user) {
        state = { ...state, ...body.user, name: '' };
        registerDraft.career = body.user.career || registerDraft.career;
        registerDraft.university = body.user.university || 'ESPOL';
      }
      if (body.teamsByProject) teamsByProject = body.teamsByProject;
      playSound('step');
      startOnboardingWizard('login', name, password);
    } catch {
      if (password !== 'i3labDT') {
        if (errEl) {
          errEl.textContent = 'Contraseña incorrecta.';
          errEl.style.display = 'block';
        }
        return;
      }
      playSound('step');
      startOnboardingWizard('login', name, password);
    }
  }

  if (form.id === 'guest-form') {
    const name = String(data.get('name') || 'Invitado').trim() || 'Invitado';
    playSound('step');
    startOnboardingWizard('guest', name, '');
  }

  if (form.id === 'register-step1-form') {
    const name = String(data.get('name') || '').trim();
    const password = String(data.get('password') || '').trim();
    playSound('step');
    startOnboardingWizard('register', name, password);
  }

  if (form.id === 'create-team-form') {
    const pid = Number(form.dataset.project);
    const teamName = String(data.get('teamName') || '').trim();
    const spots = Number(data.get('spots') || 2);
    if (!teamName) return;
    if (!teamsByProject[pid]) teamsByProject[pid] = [];
    const newTeam = {
      id: `custom-${Date.now()}`,
      name: teamName,
      spots,
      members: [state.name]
    };
    teamsByProject[pid].push(newTeam);
    const pState = getProjectUserState(pid);
    pState.teamId = newTeam.id;
    pState.teamName = newTeam.name;
    syncWithServer();
    playSound('step');
    toast(`Equipo «${teamName}» creado.`);
    if (page === 'projects') shell();
    showProjectDetails(pid, false);
  }

  if (form.id === 'profile-form') {
    state.name = String(data.get('name')).trim();
    state.university = String(data.get('university')).trim();
    state.career = String(data.get('career'));
    syncWithServer();
    $('#modal').close();
    shell();
    toast('Perfil actualizado.');
  }
});

// 15. INICIO DE LA APLICACIÓN
if (new URLSearchParams(location.search).get('mobile') === '1') {
  document.body.style.background = '#0f172a';
  document.body.style.padding = '12px 0';
  $('#app').innerHTML = `
    <div style="text-align:center; margin-bottom:8px;">
      <a href="/" style="color:#93c5fd; font-size:12px; font-weight:600; text-decoration:none;">← Volver a vista de escritorio completa</a>
    </div>
    <iframe id="mob" src="/#home" title="Vista móvil Sync (390x800)" style="width:390px; height:800px; border:6px solid #334155; border-radius:28px; display:block; margin:0 auto; background:#ffffff; box-shadow:0 24px 60px rgba(0,0,0,0.5);"></iframe>
  `;
} else {
  navigate();
  fetchInitialServerStore();
}
