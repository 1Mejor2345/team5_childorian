import http from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { demoReply } from './public/domain.js';

const assets = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/styles.css', 'styles.css'],
  ['/app.js', 'app.js'],
  ['/domain.js', 'domain.js'],
  ['/favicon.svg', 'favicon.svg'],
  ['/img/Espol.png', '../img/Espol.png'],
  ['/img/UMayor.png', '../img/UMayor.png'],
  ['/img/I3Lab.png', '../img/I3Lab.png'],
  ['/img/mentor-1.jpg', '../img/mentor-1.jpg'],
  ['/img/mentor-2.jpg', '../img/mentor-2.jpg'],
  ['/img/mentor-3.jpg', '../img/mentor-3.jpg'],
  ['/img/mentor-4.jpg', '../img/mentor-4.jpg'],
  ['/img/skill-1.jpg', '../img/skill-1.jpg'],
  ['/img/skill-2.jpg', '../img/skill-2.jpg'],
  ['/img/skill-3.jpg', '../img/skill-3.jpg'],
  ['/img/skill-4.jpg', '../img/skill-4.jpg'],
  ['/img/proj-1.jpg', '../img/proj-1.jpg'],
  ['/img/proj-2.jpg', '../img/proj-2.jpg'],
  ['/img/proj-3.jpg', '../img/proj-3.jpg']
]);

const mime = {
  html: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg'
};

const STORE_DIR = new URL('./data/', import.meta.url);
const STORE_FILE = new URL('./data/demo-store.json', import.meta.url);

function defaultTeams() {
  return {
    1: [
      { id: 't1-1', name: 'Equipo Alpha 1', spots: 2, members: ['Camila R.', 'Mateo V.'] },
      { id: 't1-2', name: 'Equipo Alpha 2', spots: 1, members: ['Diego S.', 'Valeria M.', 'Lucas P.'] }
    ],
    2: [
      { id: 't2-1', name: 'Equipo Vision 1', spots: 2, members: ['Sofía L.', 'Andrés K.'] }
    ],
    3: [
      { id: 't3-1', name: 'Equipo HMI Alpha 1', spots: 2, members: ['Fernanda T.', 'Nicolás B.'] },
      { id: 't3-2', name: 'Equipo HMI Alpha 2', spots: 3, members: ['Gabriel C.'] },
      { id: 't3-3', name: 'Equipo HMI Alpha 3', spots: 1, members: ['Paula D.', 'Sebastián R.', 'Elena G.'] }
    ]
  };
}

let store = {
  users: {},
  teamsByProject: defaultTeams(),
  lastActiveUser: null
};

try {
  if (existsSync(STORE_FILE)) {
    const parsed = JSON.parse(readFileSync(STORE_FILE, 'utf8'));
    if (parsed && typeof parsed === 'object') {
      store = {
        users: parsed.users || {},
        teamsByProject: parsed.teamsByProject || defaultTeams(),
        lastActiveUser: parsed.lastActiveUser || null
      };
    }
  }
} catch {}

async function persistStore() {
  try {
    await mkdir(STORE_DIR, { recursive: true });
    await writeFile(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch {}
}

function normKey(name) {
  return String(name || '').trim().toLowerCase();
}

function sanitizeUser(u) {
  if (!u) return null;
  const { password, ...safe } = u;
  return safe;
}

const buckets = new Map();
const json = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
};

async function readJsonBody(req, res) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (Buffer.byteLength(raw) > 50000) {
      json(res, 413, { error: 'Mensaje demasiado largo.' });
      return null;
    }
  }
  try {
    return JSON.parse(raw || '{}');
  } catch {
    json(res, 400, { error: 'Formato de solicitud inválido.' });
    return null;
  }
}

export function createServer() {
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'"
    );
    const urlObj = new URL(req.url, 'http://localhost');
    const path = urlObj.pathname;

    if (path === '/health') return json(res, 200, { status: 'ok' });
    if (path === '/api/config' && req.method === 'GET') return json(res, 200, { mode: 'demo' });

    if (path === '/api/store' && req.method === 'GET') {
      const userKey = normKey(urlObj.searchParams.get('user'));
      const user = userKey && store.users[userKey] ? sanitizeUser(store.users[userKey]) : null;
      const lastUser = store.lastActiveUser && store.users[store.lastActiveUser]
        ? sanitizeUser(store.users[store.lastActiveUser])
        : null;
      const accounts = Object.values(store.users).map(u => ({
        name: u.name,
        university: u.university,
        career: u.career,
        isGuest: !!u.isGuest,
        aiProfile: u.aiProfile || null
      }));
      return json(res, 200, {
        user,
        lastUser,
        accounts,
        teamsByProject: store.teamsByProject
      });
    }

    if (path === '/api/store' && req.method === 'POST') {
      const body = await readJsonBody(req, res);
      if (!body) return;
      const action = body.action;

      if (action === 'register') {
        const name = String(body.name || '').trim().slice(0, 40);
        const university = String(body.university || 'ESPOL').trim().slice(0, 60);
        const career = String(body.career || 'Ingeniería Mecatrónica').trim().slice(0, 60);
        const password = String(body.password || '').trim();
        if (!name || !password) return json(res, 400, { error: 'Completa tu nombre y contraseña.' });
        const key = normKey(name);
        const existing = store.users[key] || {};
        store.users[key] = {
          ...existing,
          name,
          university,
          career,
          password,
          isGuest: false,
          aiProfile: body.aiProfile || existing.aiProfile || null,
          completedSkills: existing.completedSkills || {},
          projectState: existing.projectState || {},
          badges: existing.badges || [],
          updatedAt: new Date().toISOString()
        };
        store.lastActiveUser = key;
        await persistStore();
        return json(res, 200, { user: sanitizeUser(store.users[key]), teamsByProject: store.teamsByProject });
      }

      if (action === 'login') {
        const name = String(body.name || '').trim().slice(0, 40);
        const password = String(body.password || '');
        if (!name || !password) return json(res, 400, { error: 'Ingresa tu nombre y contraseña.' });
        const key = normKey(name);
        const existing = store.users[key];
        if (existing) {
          if (existing.password && existing.password !== password && password !== 'i3labDT') {
            return json(res, 401, { error: 'Contraseña incorrecta. Inténtalo de nuevo.' });
          }
          if (body.university) existing.university = String(body.university).trim().slice(0, 60);
          if (body.career) existing.career = String(body.career).trim().slice(0, 60);
          existing.isGuest = false;
          store.lastActiveUser = key;
          await persistStore();
          return json(res, 200, { user: sanitizeUser(existing), teamsByProject: store.teamsByProject });
        }
        if (password !== 'i3labDT') {
          return json(res, 401, { error: 'Cuenta no encontrada o contraseña incorrecta. Puedes crear una cuenta o usar la clave de demostración (i3labDT).' });
        }
        store.users[key] = {
          name,
          university: String(body.university || 'ESPOL').trim().slice(0, 60),
          career: String(body.career || 'Ingeniería Mecatrónica').trim().slice(0, 60),
          password,
          isGuest: false,
          aiProfile: null,
          completedSkills: {},
          projectState: {},
          badges: [],
          updatedAt: new Date().toISOString()
        };
        store.lastActiveUser = key;
        await persistStore();
        return json(res, 200, { user: sanitizeUser(store.users[key]), teamsByProject: store.teamsByProject });
      }

      if (action === 'guest') {
        const name = String(body.name || 'Invitado').trim().slice(0, 40) || 'Invitado';
        const university = String(body.university || 'Modo Invitado').trim().slice(0, 60);
        const career = String(body.career || 'Ingeniería Mecatrónica').trim().slice(0, 60);
        const key = normKey(`guest_${name}`);
        const existing = store.users[key] || {};
        store.users[key] = {
          ...existing,
          name,
          university,
          career,
          isGuest: true,
          aiProfile: existing.aiProfile || {
            style: 'Explorador Práctico',
            role: 'Resolución ágil de escenarios',
            goal: 'Probar simuladores y verificar fuentes con IA',
            summary: 'Perfil ágil enfocado en práctica directa y contraste rápido de evidencias.'
          },
          completedSkills: existing.completedSkills || {},
          projectState: existing.projectState || {},
          badges: existing.badges || [],
          updatedAt: new Date().toISOString()
        };
        store.lastActiveUser = key;
        await persistStore();
        return json(res, 200, { user: sanitizeUser(store.users[key]), teamsByProject: store.teamsByProject });
      }

      if (action === 'sync') {
        const name = String(body.name || '').trim().slice(0, 40);
        if (name) {
          const key = body.isGuest ? normKey(`guest_${name}`) : normKey(name);
          const existing = store.users[key] || { name };
          store.users[key] = {
            ...existing,
            name,
            university: body.university ?? existing.university ?? 'ESPOL',
            career: body.career ?? existing.career ?? 'Ingeniería Mecatrónica',
            isGuest: !!body.isGuest,
            aiProfile: body.aiProfile !== undefined ? body.aiProfile : (existing.aiProfile || null),
            completedSkills: body.completedSkills || existing.completedSkills || {},
            projectState: body.projectState || existing.projectState || {},
            badges: Array.isArray(body.badges) ? body.badges : (existing.badges || []),
            updatedAt: new Date().toISOString()
          };
          store.lastActiveUser = key;
        }
        if (body.teamsByProject && typeof body.teamsByProject === 'object') {
          store.teamsByProject = body.teamsByProject;
        }
        await persistStore();
        return json(res, 200, { ok: true, teamsByProject: store.teamsByProject });
      }

      return json(res, 400, { error: 'Acción no reconocida.' });
    }

    if (path === '/api/chat' && req.method === 'POST') {
      const ip = req.socket.remoteAddress;
      const now = Date.now();
      if (buckets.size > 10000) buckets.clear();
      let bucket = buckets.get(ip);
      if (!bucket || now - bucket.start > 60000) bucket = { start: now, count: 0 };
      buckets.set(ip, bucket);
      if (++bucket.count > 20) return json(res, 429, { error: 'Espera un minuto antes de enviar más preguntas.' });
      try {
        let raw = '';
        for await (const chunk of req) {
          raw += chunk;
          if (Buffer.byteLength(raw) > 20000) return json(res, 413, { error: 'Mensaje demasiado largo.' });
        }
        let body;
        try {
          body = JSON.parse(raw);
        } catch {
          return json(res, 400, { error: 'Formato de solicitud inválido.' });
        }
        if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > 2000) {
          return json(res, 400, { error: 'Escribe una pregunta de hasta 2000 caracteres.' });
        }
        return json(res, 200, { ...demoReply(body.message), mode: 'demo' });
      } catch {
        return json(res, 503, { error: 'El servicio tardó demasiado o no está disponible. Inténtalo de nuevo.' });
      }
    }

    if (!['GET', 'HEAD'].includes(req.method)) return json(res, 405, { error: 'Método no permitido.' });
    if (!assets.has(path)) return json(res, 404, { error: 'Recurso no encontrado.' });
    try {
      const file = assets.get(path);
      const data = await readFile(new URL(`./public/${file}`, import.meta.url));
      res.writeHead(200, { 'Content-Type': mime[file.split('.').pop()], 'Cache-Control': 'no-cache' });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch {
      json(res, 500, { error: 'No se pudo cargar el recurso.' });
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createServer();
  server.listen(Number(process.env.PORT) || 3000, '0.0.0.0', () =>
    console.log(`Nexo listo en http://localhost:${process.env.PORT || 3000}`)
  );
  process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  });
}
