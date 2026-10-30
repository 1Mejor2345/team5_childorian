# Nexo · De la U al mundo real

Prototipo interactivo de Team 5 Childorian para ayudar a universitarios y recién egresados a conectar lo aprendido en la universidad con situaciones del trabajo.

**Sitio:** https://nexo-team5-childorian.onrender.com

## La idea

El punto de partida es Jorge, un egresado de Ingeniería Mecatrónica de 23 años que aprende de forma autónoma y utiliza IA, pero siente que sus herramientas no profundizan lo suficiente en los temas. Necesita estudiar con confianza y trasladar ese conocimiento al puesto de trabajo.

Nexo propone una secuencia: **preguntar → comprender → contrastar → aplicar → reflexionar**. Complementa la formación universitaria con casos cortos y métodos de estudio. No certifica preparación profesional.

## Qué puedes probar

- **Mi espacio:** acceso a la ruta, el siguiente reto y los métodos de aprendizaje.
- **Diagnóstico:** cinco preguntas con retroalimentación sobre criterio con IA, aplicación práctica, comunicación y aprendizaje autónomo. Las habilidades con menor puntuación se priorizan en el plan.
- **Mi plan:** cuatro sesiones ordenadas por el diagnóstico, tiempo disponible de 10, 20 o 30 minutos y descarga del plan en texto.
- **Retos laborales:** conceptos, situación aplicada, pregunta de decisión y reflexión propia de al menos 30 caracteres. Completar un reto suma 50 XP una sola vez.
- **Mentor Nexo:** conversación **simulada** con respuestas prediseñadas para entrevistas, estudio, verificación, comunicación y consultas de riesgo. **No utiliza una API de IA ni necesita claves.**
- **Semáforo:** rojo invita a detenerse ante ciertas palabras de riesgo; amarillo pide contrastar; verde aparece solo después de que el usuario registra su revisión y una evidencia. El verde **no es una verificación independiente ni una garantía de seguridad**.
- **Métodos de estudio:** Feynman, recuperación activa, repaso espaciado y aprendizaje basado en problemas, con una práctica guardable.
- **Mi progreso:** retos, XP, días de visita, diagnóstico y portafolio de evidencias exportable a JSON.
- **Perfil:** nombre, área de estudio y objetivo personal. No hay registro ni autenticación real.

## Referencia BrainBox

Se revisó y descargó [BrainBox de SRGM-sys](https://github.com/SRGM-sys/BrainBox), referencia `9fb9d22890108d966ed15e4c84bec00aee4e9437`. Su organización en HTML/CSS/JavaScript, rutas de aprendizaje, retos, XP y persistencia en `localStorage` sirvieron como base conceptual y técnica de la adaptación.

La versión de Nexo implementa una interfaz y código propios para el reto universitario-laboral. No incorpora el contenido de Matemáticas, Física o Química, el acceso de profesor ni los premios escolares de BrainBox. El repositorio de referencia no presenta una licencia explícita en su árbol revisado; por eso no se redistribuyen sus archivos ni ilustraciones. La copia descargada queda en `reference-brainbox/`, excluida del control de versiones. No se reclama autoría del proyecto original.

Las notas entregadas por el equipo se traducen en dos funciones principales: el semáforo de criterio y el plan que prioriza puntos débiles. Las instrucciones internas visibles en la plantilla PDV se trataron como contexto documental.

## Diseño

Interfaz en español con azul cobalto, fondos claros, tarjetas cálidas, navegación lateral en escritorio y compacta en móvil. La ilustración del puente y los iconos son SVG propios: se mantienen nítidos a cualquier resolución, incluida Full HD. No requiere fuentes, fotos ni bibliotecas remotas.

## Ejecutar localmente

Requiere Node.js 22 o superior. No hay dependencias externas.

```sh
git clone https://github.com/1Mejor2345/team5_childorian.git
cd team5_childorian
npm start
```

Abrir http://localhost:3000. Para cambiar el puerto, establecer la variable de entorno `PORT` antes de iniciar. El archivo `.env.example` documenta esa variable; el servidor no carga archivos `.env` automáticamente.

```sh
npm run check
npm test
```

Las pruebas cubren priorización del diagnóstico, generación del plan, reglas del semáforo, archivos públicos, validación del chat y límite de solicitudes.

## Estructura

```text
public/
  index.html      Documento principal y modal accesible
  styles.css      Diseño y adaptación a pantallas pequeñas
  app.js          Navegación, perfil, diagnóstico, retos y persistencia
  domain.js       Contenido, diagnóstico, plan y respuestas de demostración
  favicon.svg     Identidad visual
server.mjs        HTTP, recursos públicos y chat simulado
tests/           Pruebas con node:test
docs/            Análisis del problema y alcance
```

## Render

Servicio web Node en plan gratuito, rama `main`:

- Build command: `npm run check && npm test`
- Start command: `npm start`
- Puerto: `process.env.PORT`, escucha en `0.0.0.0`.
- Comprobación HTTP disponible: `/health`.
- No requiere base de datos, variables secretas ni servicios de IA.

El servicio gratuito puede tardar en responder después de un periodo de inactividad. Para volver a desplegar, utilizar el panel de Render del servicio.

## Datos y límites del prototipo

El avance y la conversación se guardan en `localStorage` en este navegador y origen. No se sincronizan entre dispositivos, no representan cuentas privadas y se pierden al borrar datos del sitio. Evita introducir datos personales sensibles. La conversación tiene un máximo de 40 mensajes conservados al enviar una nueva pregunta.

El backend no persiste preguntas ni llama a un modelo externo. Solo expone una lista fija de archivos públicos, valida tamaño y formato de los mensajes y limita solicitudes en memoria. El semáforo usa palabras clave: puede omitir riesgos o producir alertas de más. Las respuestas y casos son educativos, no consejos operativos para tareas peligrosas. Las evidencias verdes proceden del propio usuario.

## Guion de demostración

1. Personaliza el perfil con tu nombre y área de estudio.
2. Abre «Descubrir mi punto de partida» y responde las cinco preguntas.
3. Revisa cómo cambia el orden de «Mi plan».
4. Completa un reto y escribe una reflexión aplicada a tu carrera.
5. Pregunta al mentor «¿Cómo verifico una respuesta de IA?» y registra tu revisión.
6. Pregunta por un «equipo energizado» para mostrar una alerta roja.
7. Abre «Mi progreso» y exporta las evidencias.

Proyecto académico · Team 5 Childorian · 2026.
