const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const KEY = 'nexo-prototype-v1';

// 1. ESTADO DE LA APLICACIÓN
let state = { name: '', career: 'Ingeniería Mecatrónica', university: '', completed: {}, visits: [] };
try { 
  const saved = JSON.parse(localStorage.getItem(KEY)); 
  if (saved && typeof saved === 'object') { state = { ...state, ...saved }; }
} catch {}

let saveWarning = false;
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } 
  catch { if (!saveWarning) { saveWarning = true; toast('No se puede guardar en este navegador. Tu avance durará esta sesión.'); } }
}

const today = new Date().toLocaleDateString('en-CA');
if (!state.visits.includes(today)) { state.visits.push(today); save(); }

let page = 'home';
let demoChat = []; 

// 2. ICONOS Y UI BÁSICA
const icons = {
  home: 'M3 10 12 3l9 7v11h-6v-7H9v7H3Z',
  briefcase: 'M3 7h18v14H3ZM8 7V3h8v4M3 12h18M10 12v3h4v-3',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M3 22v-3a9 9 0 0 1 18 0v3',
  arrow: 'M4 12h16M14 6l6 6-6 6',
  check: 'm5 12 4 4L20 5',
  spark: 'm12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z',
  close: 'm6 6 12 12M6 18 18 6'
};

function icon(name, cl = '') { return `<svg class="icon ${cl}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[name] || icons.spark}"/></svg>`; }
function toast(text) { $('#toast').textContent = text; $('#toast').classList.add('show'); setTimeout(() => $('#toast').classList.remove('show'), 4000); }
function illustration() {
  return `<svg class="hero-art" viewBox="0 0 480 340" role="img" aria-label="Un puente conecta la universidad con el mundo laboral"><defs><linearGradient id="bridge" x1="0" x2="1"><stop stop-color="#c8d1ff"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><circle cx="276" cy="156" r="131" fill="#5273ff"/><circle cx="276" cy="156" r="104" fill="none" stroke="#6f8aff" stroke-dasharray="4 8"/><path d="M47 279h370M81 298h299" stroke="#6682ff" stroke-width="2"/><path d="M93 250c95-132 173-132 276-26" fill="none" stroke="url(#bridge)" stroke-width="28"/><path d="M94 243c92-130 173-130 275-26" fill="none" stroke="#ecedff" stroke-width="2"/><path d="M125 210v62M164 173v99M207 149v123M252 147v125M296 165v107M337 195v77" stroke="#91a5ff" stroke-width="3"/><g transform="translate(24 154) rotate(-8)"><rect width="100" height="98" rx="14" fill="#f3e7cb"/><path d="m16 34 34-17 34 17-34 17Z" fill="#233eaa"/><path d="M29 43v20q21 15 42 0V43M83 36v29" fill="none" stroke="#233eaa" stroke-width="4"/><circle cx="83" cy="68" r="4" fill="#233eaa"/></g><g transform="translate(341 163) rotate(9)"><rect width="100" height="98" rx="14" fill="#e1f1d7"/><rect x="20" y="33" width="61" height="43" rx="6" fill="#244d45"/><path d="M40 33V22h22v11M20 49h61M45 46v8h12v-8" fill="none" stroke="#e1f1d7" stroke-width="3"/></g><g transform="translate(222 76)"><circle cx="17" cy="18" r="13" fill="#ffcca5"/><path d="M3 13q2-22 24-6l6 9-22-5Z" fill="#162655"/><path d="m5 35-10 47 34 3 3-43-14-12Z" fill="#f9b75f"/><path d="m1 80-4 39M25 82l18 29" stroke="#18294d" stroke-width="12" stroke-linecap="round"/><path d="m-7 119 13 1M42 113l12-5" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="m27 43 15 17 16-13M3 43l-16 17" stroke="#ffcca5" stroke-width="8" stroke-linecap="round"/><rect x="45" y="30" width="23" height="21" rx="3" transform="rotate(-10 45 30)" fill="#fff"/></g><g fill="#e4eaff"><path d="m134 78 6-15 6 15 15 6-15 6-6 15-6-15-15-6ZM370 101l4-10 4 10 10 4-10 4-4 10-4-10-10-4Z"/><circle cx="178" cy="38" r="4"/><circle cx="420" cy="140" r="4"/></g><g transform="translate(320 36) rotate(8)"><rect width="94" height="34" rx="17" fill="#fff"/><circle cx="19" cy="17" r="9" fill="#e0ecd7"/><path d="m14 17 4 4 7-8" fill="none" stroke="#35634c" stroke-width="2"/><text x="34" y="21" fill="#24365b" font-family="Arial" font-size="10" font-weight="700">Tú puedes.</text></g></svg>`;
}
function scrollChat() { requestAnimationFrame(() => { const el = $('#messages'); if (el) el.scrollTop = el.scrollHeight; }); }
function openModal(content) {
  const el = $('#modal');
  el.innerHTML = `<button class="modal-close" data-action="close" aria-label="Cerrar ventana">${icon('close')}</button>${content}`;
  if (!el.open) el.showModal();
}

// 3. ESTRUCTURA Y NAVEGACIÓN
function renderTopNav() {
  return `
  <style>
    /* Diseño de 3 columnas perfectas para distribuir el espacio */
    .top-nav { 
      display: grid; 
      grid-template-columns: 1fr auto 1fr; 
      align-items: center; 
      height: 75px; 
      background: white; 
      border-bottom: 1px solid var(--line); 
      padding: 0 42px; 
      position: sticky; 
      top: 0; 
      z-index: 100; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.02); 
    }
    
    .nav-brand { font-size: 24px; font-weight: 750; display: flex; align-items: center; color: var(--blue); letter-spacing: -1px; }
    .nav-brand .brand-symbol { background: var(--blue); color: white; border-radius: 8px; width: 28px; height: 28px; display: inline-flex; justify-content: center; align-items: center; font-style: italic; margin-right: 8px; font-size: 20px; }
    
    /* Pestañas centrales con más respiro y sin saltos de línea */
    .nav-tabs { display: flex; gap: 45px; height: 100%; justify-content: center; }
    .tab-btn { background: none; border: none; font-size: 14px; font-weight: 600; color: #727b8d; cursor: pointer; display: flex; align-items: center; gap: 8px; border-bottom: 3px solid transparent; padding: 0; transition: color 0.2s; white-space: nowrap; }
    .tab-btn:hover { color: var(--blue); }
    .tab-btn.active { color: var(--blue); border-bottom-color: var(--blue); }
    .tab-btn svg { width: 18px; height: 18px; }
    
    /* Contenedor derecho para empujar el perfil al final */
    .nav-profile-wrapper { display: flex; justify-content: flex-end; overflow: hidden; }
    .nav-profile { border: 1px solid var(--line); border-radius: 30px; padding: 6px 16px 6px 6px; background: white; cursor: pointer; display: flex; align-items: center; gap: 10px; max-width: 220px; transition: border-color 0.2s; }
    .nav-profile:hover { border-color: #dce3f6; }
    .nav-profile .avatar { flex-shrink: 0; }
    
    /* Truncado de texto si el nombre o carrera son muy largos */
    .nav-profile-text { display: flex; flex-direction: column; line-height: 1.2; text-align: left; overflow: hidden; }
    .nav-profile-text strong { font-size: 11px; color: var(--blue); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .nav-profile-text small { font-size: 9px; color: #727b8d; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .sim-container { max-width: 1000px; margin: 0 auto; padding: 50px 20px; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; }
  </style>
  <header class="top-nav">
    <!-- Columna Izquierda: Logo -->
    <a href="#home" class="nav-brand" style="text-decoration: none;">
      <span class="brand-symbol">s</span>sync<span class="brand-dot">.</span>
    </a>
    
    <!-- Columna Central: Navegación -->
    <nav class="nav-tabs">
      <button class="tab-btn ${page === 'mentor' ? 'active' : ''}" onclick="location.hash='mentor'">${icon('spark')} Mentor Sync</button>
      <button class="tab-btn ${page === 'skills' ? 'active' : ''}" onclick="location.hash='skills'">${icon('briefcase')} Habilidades Blandas</button>
      <button class="tab-btn ${page === 'projects' ? 'active' : ''}" onclick="location.hash='projects'">${icon('user')} Proyectos</button>
    </nav>
    
    <!-- Columna Derecha: Perfil -->
    <div class="nav-profile-wrapper">
      <button class="nav-profile" data-action="profile" title="Ver perfil">
        <span class="avatar small">${esc((state.name || 'Tú').slice(0, 2).toUpperCase())}</span>
        <div class="nav-profile-text">
          <strong>${esc(state.name)}</strong>
          <small>${esc(state.career)}</small>
        </div>
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
      <main id="main" tabindex="-1" style="padding: 0; background: #f8f9fc; min-height: calc(100vh - 75px);">
         ${views[page]()}
      </main>
    `;
    if (page === 'mentor') scrollChat();
  }
}

// 4. VISTAS DE LA APLICACIÓN
function renderLogin() {
  $('#app').innerHTML = `
    <div style="display: flex; height: 100vh; align-items: center; justify-content: center; background: #f8f9fc;">
      <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); width: 100%; max-width: 400px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <span class="brand-symbol" style="display: inline-block; margin: 0 auto 15px;">s</span>
          <h2 style="margin:0; font-size: 24px;">Inicia tu sesión</h2>
          <p style="margin-top:8px; font-size: 12px; color: #727b8d;">Ingresa tus credenciales para acceder a tu ruta de entrenamiento.</p>
        </div>
        
        <form id="login-form">
          <label for="login-name">Nombre</label>
          <input id="login-name" name="name" maxlength="40" placeholder="Tu nombre" required>
          
          <label for="login-uni">Universidad</label>
          <input id="login-uni" name="university" placeholder="Ej. ESPOL" required>
          
          <label for="login-career">Carrera</label>
          <select id="login-career" name="career" style="margin-bottom: 15px;" required>
            <option value="Ingeniería Mecatrónica">Ingeniería Mecatrónica</option>
            <option value="Otra Ingeniería">Otra Ingeniería</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Negocios">Negocios</option>
            <option value="Diseño y comunicación">Diseño y comunicación</option>
          </select>
          
          <label for="login-pass">Contraseña</label>
          <input id="login-pass" type="password" name="password" required>
          
          <div id="login-error" class="feedback retry" style="display: none; margin-top: 12px;">
            Contraseña incorrecta. Inténtalo de nuevo.
          </div>
          
          <button class="btn primary full" type="submit" style="margin-top: 25px;">Ingresar ${icon('arrow')}</button>
        </form>
      </div>
    </div>
  `;
}

function home() {
  return `
  <style>
    .landing-hero { background: #f0f4ff; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #202a3d; text-align: center; padding: 100px 20px 40px; position: relative; overflow: hidden; }
    .landing-hero .brand-symbol { background: var(--blue); color: white; }
    .landing-hero .hero-label { color: #6b7a99; }
    .landing-hero .hero-label i { background: var(--blue); }
    .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; opacity: 0; transform: translateY(30px); }
    .delay-1 { animation-delay: 0.15s; }
    .delay-2 { animation-delay: 0.3s; }
    .delay-3 { animation-delay: 0.45s; }
    @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
    .landing-btn { background: var(--blue); color: white; border: none; font-size: 14px; font-weight: 600; padding: 16px 36px; border-radius: 30px; box-shadow: 0 10px 30px rgba(54, 92, 245, 0.3); display: inline-flex; align-items: center; gap: 12px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
    .landing-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(54, 92, 245, 0.4); color: white; }
    .features-section { background: #ffffff; padding: 90px 40px; display: flex; flex-direction: column; align-items: center; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; max-width: 1100px; width: 100%; margin-top: 50px; }
    .feature-card { background: #f8f9fc; border: 1px solid var(--line); border-radius: 16px; padding: 35px 28px; text-align: left; transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .feature-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.05); background: white; }
    .feature-icon-wrapper { width: 54px; height: 54px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 22px; }
    .feature-icon-wrapper svg { width: 24px; height: 24px; }
    .icon-blue { background: #e9effc; color: var(--blue); }
    .icon-orange { background: #fbede1; color: #bb8856; }
    .icon-green { background: #eaf3eb; color: #52795d; }
    .traffic-lights { display: flex; gap: 8px; margin-top: 20px; align-items: center; font-size: 10px; color: #8a93a8; font-weight: 600; }
    .t-light { width: 12px; height: 12px; border-radius: 50%; display: inline-block;}
    .t-red { background: #dc8b85; }
    .t-yellow { background: #d8b55f; }
    .t-green { background: #85ac92; }
    .credits-section { background: #f8f9fc; padding: 80px 40px; border-top: 1px solid var(--line); display: flex; flex-direction: column; align-items: center; }
    .credits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; max-width: 900px; width: 100%; margin-top: 40px; }
    .institution-card { background: white; border: 1px solid var(--line); border-radius: 16px; padding: 30px; display: flex; flex-direction: column; align-items: center; text-align: center; }
    .institution-logo { height: 60px; object-fit: contain; margin-bottom: 20px; }
    .team-list { list-style: none; padding: 0; margin: 0; width: 100%; }
    .team-list li { font-size: 14px; color: #535e74; padding: 10px 0; border-bottom: 1px solid #e9ecf3; }
    .team-list li:last-child { border-bottom: none; }
  </style>

  <section class="landing-hero">
    <div class="fade-in-up" style="font-size: 48px; font-weight: 750; letter-spacing: -2px; margin-bottom: 30px; display: flex; align-items: center; justify-content: center; color: var(--blue);">
       <span class="brand-symbol" style="margin-right: 10px;">s</span>sync<span class="brand-dot">.</span>
    </div>
    
    <h1 class="fade-in-up delay-2" style="font-size: clamp(36px, 5vw, 64px); line-height: 1.1; margin-bottom: 24px; max-width: 900px;">
      Más allá de los apuntes.<br><em style="font-style: normal; color: var(--blue);">Más cerca de tu futuro.</em>
    </h1>
    
    <p class="fade-in-up delay-3" style="font-size: clamp(15px, 2vw, 18px); color: #535e74; max-width: 650px; line-height: 1.6; margin-bottom: 40px;">
      ${state.name ? `Hola, ${esc(state.name.split(' ')[0])}. ` : ''}Este espacio te ayudará a desarrollar un criterio propio, aprovechar la Inteligencia Artificial de forma responsable y transformar la teoría en habilidades prácticas.
    </p>
    
    <div class="fade-in-up delay-3">
       <button class="landing-btn" onclick="location.hash='mentor'">
         Iniciar simulador ${icon('arrow')}
       </button>
    </div>
  </section>
  
  <section class="features-section">
     <div class="eyebrow" style="color: var(--blue); margin-bottom: 12px;">CÓMO FUNCIONA SYNC</div>
     <h2 style="font-size: 32px; color: #202a3d; max-width: 650px; text-align: center; line-height: 1.3;">Todo lo que necesitas para tu transición al mundo laboral</h2>

     <div class="features-grid">
       <div class="feature-card">
         <div class="feature-icon-wrapper icon-blue">${icon('spark')}</div>
         <h3 style="font-size: 19px; color: #202a3d; margin-bottom: 12px;">Mentor Sync</h3>
         <p style="font-size: 13px; color: #535e74; line-height: 1.6; margin: 0;">Una Inteligencia Artificial con un sistema de semáforo que evalúa y te indica el nivel de confianza de la información que te brinda.</p>
         <div class="traffic-lights">
           <span class="t-light t-red"></span><span class="t-light t-yellow"></span><span class="t-light t-green"></span>
           <span style="margin-left: 5px;">Riesgo / Contrastar / Evidencia</span>
         </div>
       </div>

       <div class="feature-card">
         <div class="feature-icon-wrapper icon-orange">${icon('briefcase')}</div>
         <h3 style="font-size: 19px; color: #202a3d; margin-bottom: 12px;">Habilidades blandas</h3>
         <p style="font-size: 13px; color: #535e74; line-height: 1.6; margin: 0;">Simuladores que te ponen a tomar decisiones en un entorno laboral virtual. Pon en práctica cómo resolver las situaciones comunes del día a día.</p>
       </div>

       <div class="feature-card">
         <div class="feature-icon-wrapper icon-green">${icon('user')}</div>
         <h3 style="font-size: 19px; color: #202a3d; margin-bottom: 12px;">Proyectos Colaborativos</h3>
         <p style="font-size: 13px; color: #535e74; line-height: 1.6; margin: 0;">Únete a grupos de 3 a 5 estudiantes guiados por un mentor para resolver problemas interdisciplinarios. Gana insignias digitales para tu currículum.</p>
       </div>
     </div>

     <div style="margin-top: 70px; text-align: center; width: 100%; display: flex; flex-direction: column; align-items: center;">
       <span class="eyebrow" style="margin-bottom: 15px; color: #8a93a8;">CON EL RESPALDO DE</span>
       <img src="/img/I3Lab.png" alt="Logo i3lab" style="height: 55px; object-fit: contain;" onerror="this.src=''; this.alt='i3lab'">
     </div>
  </section>

  <section class="credits-section">
    <div class="eyebrow" style="margin-bottom: 10px;">DESARROLLADO EN COLABORACIÓN</div>
    <h2 style="font-size: 28px; color: #202a3d;">El Equipo Detrás de Sync</h2>
    
    <div class="credits-grid">
      <div class="institution-card">
        <img src="/img/Espol.png" alt="Logo ESPOL" class="institution-logo" onerror="this.src=''; this.alt='ESPOL'">
        <h3 style="font-size: 16px; margin-bottom: 15px; color: var(--blue);">ESPOL</h3>
        <ul class="team-list">
          <li>Santiago Gómez</li>
          <li>Mirka Velez</li>
          <li>José Paladines</li>
        </ul>
      </div>
      
      <div class="institution-card">
        <img src="/img/UMayor.png" alt="Logo Universidad Mayor" class="institution-logo" onerror="this.src=''; this.alt='Universidad Mayor'">
        <h3 style="font-size: 16px; margin-bottom: 15px; color: var(--blue);">Universidad Mayor</h3>
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

function viewMentorSync() {
  return `
  <div class="sim-container">
     <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="font-size: 26px; color: #202a3d;">Entrena tu criterio técnico</h2>
        <p style="color: #727b8d; font-size: 14px;">Selecciona una consulta para observar cómo nuestra IA categoriza la información.</p>
     </div>
     <div class="chat-panel" style="max-width: 850px; margin: 0 auto; background: white; border-radius: 16px; border: 1px solid var(--line); height: 500px; display: flex; flex-direction: column; box-shadow: 0 10px 30px rgba(0,0,0,0.03);">
        <div id="messages" style="flex: 1; padding: 30px; overflow-y: auto; scroll-behavior: smooth;">
           <div style="display: flex; gap: 12px; align-items: flex-start; margin-bottom: 20px;">
              <span style="background: #edf1ff; color: var(--blue); width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-family: italic;">s</span>
              <div style="background: #f8f9fc; padding: 16px 20px; border-radius: 0 12px 12px 12px; font-size: 13px; color: #3c4963; max-width: 85%;">
                 Bienvenido al entorno de validación de Sync. ¿Qué escenario laboral deseas consultar hoy?
              </div>
           </div>
           ${demoChat.map(m => `
             <div style="display: flex; gap: 12px; align-items: flex-start; justify-content: flex-end; margin-bottom: 20px;">
                <div style="background: var(--blue); color: white; padding: 16px 20px; border-radius: 12px 0 12px 12px; font-size: 13px; max-width: 85%;">
                   ${m.q}
                </div>
             </div>
             <div style="display: flex; gap: 12px; align-items: flex-start; margin-bottom: 20px;">
                <span style="background: #edf1ff; color: var(--blue); width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-family: italic;">s</span>
                <div style="background: #f8f9fc; padding: 16px 20px; border-radius: 0 12px 12px 12px; font-size: 13px; color: #3c4963; max-width: 85%; border: 1px solid var(--line);">
                   <p style="margin: 0 0 15px 0; line-height: 1.6;">${m.a}</p>
                   <div style="padding-top: 12px; border-top: 1px solid #e9ecf3; display: flex; align-items: center; gap: 8px;">
                      <span style="width: 12px; height: 12px; border-radius: 50%; display: inline-block; background: ${m.color === 'red' ? '#dc8b85' : m.color === 'amber' ? '#d8b55f' : '#85ac92'};"></span>
                      <span style="font-size: 11px; font-weight: 600; color: #727b8d;">${m.label}</span>
                   </div>
                </div>
             </div>
           `).join('')}
        </div>
        <div style="padding: 20px; border-top: 1px solid var(--line); background: white; border-radius: 0 0 16px 16px;">
           <p style="font-size: 10px; font-weight: 700; letter-spacing: 1px; color: #a0a7b5; margin: 0 0 15px 0; text-align: center;">OPCIONES DE CONSULTA (DEMOSTRACIÓN)</p>
           <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
              <button class="btn outline" data-action="demo-chat:1" style="font-size: 11px; padding: 12px; text-align: left; justify-content: flex-start; border-color: #fce8e6;">1. Solicitar código de control (Riesgo)</button>
              <button class="btn outline" data-action="demo-chat:2" style="font-size: 11px; padding: 12px; text-align: left; justify-content: flex-start; border-color: #fbf3d0;">2. Preguntar métricas (Contrastar)</button>
              <button class="btn outline" data-action="demo-chat:3" style="font-size: 11px; padding: 12px; text-align: left; justify-content: flex-start; border-color: #e6f4ea;">3. Validar con documentos (Seguro)</button>
           </div>
        </div>
     </div>
  </div>
  `;
}

function viewSoftSkills() {
  const retos = ['Conflicto de intereses en el equipo', 'Entrega de proyecto con retraso crítico', 'Dar feedback negativo a un supervisor', 'Negociación de alcance con el cliente'];
  return `
  <div class="sim-container">
     <div style="background: white; border: 1px solid var(--line); border-radius: 12px; padding: 25px 30px; margin-bottom: 30px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
        <div>
          <h3 style="margin: 0 0 5px 0; font-size: 20px; color: #202a3d;">Tu progreso práctico</h3>
          <p style="margin: 0; font-size: 13px; color: #727b8d;">Toma decisiones en entornos simulados para mejorar tu perfil.</p>
        </div>
        <div style="text-align: right;">
          <strong style="font-size: 32px; color: var(--blue); line-height: 1;">0 <span style="font-size: 18px; color: #8a93a8;">/ 4</span></strong>
          <p style="margin: 5px 0 0; font-size: 10px; color: #8a93a8; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">Retos completados</p>
        </div>
     </div>
     
     <div class="grid-3">
        ${retos.map((titulo, i) => `
        <div style="background: white; border: 1px solid var(--line); border-radius: 14px; padding: 25px; display: flex; flex-direction: column; transition: transform 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'" onclick="toast('Abriendo simulador de reto...')">
           <span class="eyebrow" style="color: var(--blue);">RETO 0${i+1}</span>
           <h4 style="font-size: 17px; margin: 10px 0; color: #202a3d;">${titulo}</h4>
           <p style="font-size: 12px; line-height: 1.6; color: #727b8d; flex: 1; margin: 0 0 20px 0;">Simulador interactivo. Evalúa opciones y decide el mejor curso de acción corporativa.</p>
           <button class="btn outline full" style="margin-top: 0; pointer-events: none;">Iniciar escenario ${icon('arrow')}</button>
        </div>
        `).join('')}
     </div>
  </div>
  `;
}

function viewProjects() {
  const projects = [
    { id: 1, title: 'Optimización de Consumo Energético en Planta Industrial', desc: 'Diseño de un sistema IoT (Internet de las Cosas) para monitorear, predecir y reducir el uso de energía en líneas de producción automatizadas.', mentor: 'Ing. Carlos Mendoza (Experto IoT)', weeks: '8 semanas', teams: 2, tags: ['Mecatrónica', 'Software'] },
    { id: 2, title: 'Automatización de Inventario con Visión Artificial', desc: 'Implementación de cámaras y redes neuronales para el conteo automático de stock en almacenes de gran escala, reduciendo el error humano.', mentor: 'Dra. Elena Ruiz (Computer Vision)', weeks: '10 semanas', teams: 1, tags: ['IA', 'Logística'] },
    { id: 3, title: 'Interfaz UX para Control de Maquinaria Pesada', desc: 'Desarrollo de un panel de control intuitivo y seguro en web para operadores de maquinaria industrial, minimizando la curva de aprendizaje.', mentor: 'Dis. Martín Torres (Product Designer)', weeks: '9 semanas', teams: 3, tags: ['UX/UI', 'Ingeniería'] }
  ];
  return `
  <div class="sim-container">
     <div style="text-align: center; margin-bottom: 40px;">
        <h2 style="font-size: 26px; color: #202a3d; margin-bottom: 10px;">Proyectos Reales</h2>
        <p style="color: #727b8d; font-size: 14px;">Únete a un equipo guiado por mentores, resuelve problemáticas y gana insignias certificadas.</p>
     </div>
     
     <div class="grid-3">
        ${projects.map(p => `
        <div style="background: white; border: 1px solid var(--line); border-radius: 16px; padding: 30px; display: flex; flex-direction: column;">
           <div style="display: flex; gap: 8px; margin-bottom: 15px;">
             ${p.tags.map(t => `<span style="font-size: 9px; background: #f0f4ff; color: var(--blue); padding: 4px 8px; border-radius: 4px; font-weight: 600;">${t}</span>`).join('')}
           </div>
           <h4 style="font-size: 19px; margin: 0 0 12px 0; color: #202a3d; line-height: 1.3;">${p.title}</h4>
           <p style="font-size: 13px; line-height: 1.6; color: #727b8d; flex: 1; margin: 0;">${p.desc}</p>
           <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--line);">
              <p style="font-size: 11px; margin: 0 0 6px 0; color: #535e74;"><strong>Mentor:</strong> ${p.mentor}</p>
              <p style="font-size: 11px; margin: 0 0 20px 0; color: #535e74;"><strong>Duración:</strong> ${p.weeks}</p>
              <button class="btn primary full" data-action="project-details:${p.id}" style="margin-top: 0;">Ver detalles y equipos</button>
           </div>
        </div>
        `).join('')}
     </div>
  </div>
  `;
}

// 5. MANEJO DE MODALES
function profile() {
  openModal(`
    <span class="eyebrow">TU CUENTA</span>
    <h2 id="modal-title">Información de Perfil</h2>
    <div style="background: #f6f8fc; padding: 20px; border-radius: 12px; margin-bottom: 20px; font-size: 13px; color: #3c4963;">
      <p style="margin: 0 0 10px 0;"><strong>Nombre:</strong> ${esc(state.name)}</p>
      <p style="margin: 0 0 10px 0;"><strong>Universidad:</strong> ${esc(state.university)}</p>
      <p style="margin: 0;"><strong>Carrera:</strong> ${esc(state.career)}</p>
    </div>
    <div style="display: flex; gap: 15px;">
      <button class="btn outline full" data-action="edit-profile" style="margin-top: 0;">Editar perfil</button>
      <button class="btn primary full" data-action="logout" style="margin-top: 0; background: #dc8b85; border-color: #dc8b85;">Cerrar Sesión</button>
    </div>
  `);
}

function showProjectDetails(id) {
  const projects = [
    { id: 1, title: 'Optimización de Consumo Energético en Planta Industrial', desc: 'Diseño de un sistema IoT (Internet de las Cosas) para monitorear, predecir y reducir el uso de energía en líneas de producción automatizadas.', mentor: 'Ing. Carlos Mendoza (Experto IoT)', weeks: '8 semanas', teams: 2 },
    { id: 2, title: 'Automatización de Inventario con Visión Artificial', desc: 'Implementación de cámaras y redes neuronales para el conteo automático de stock en almacenes de gran escala, reduciendo el error humano.', mentor: 'Dra. Elena Ruiz (Computer Vision)', weeks: '10 semanas', teams: 1 },
    { id: 3, title: 'Interfaz UX para Control de Maquinaria Pesada', desc: 'Desarrollo de un panel de control intuitivo y seguro en web para operadores de maquinaria industrial, minimizando la curva de aprendizaje.', mentor: 'Dis. Martín Torres (Product Designer)', weeks: '9 semanas', teams: 3 }
  ];
  const p = projects[id-1];
  openModal(`
    <span class="eyebrow">DETALLES DEL PROYECTO</span>
    <h2 id="modal-title" style="font-size: 22px; margin-bottom: 15px;">${p.title}</h2>
    <p style="font-size: 13px; line-height: 1.6; color: #535e74;">${p.desc}</p>
    <div style="background: #f8f9fc; padding: 18px; border-radius: 10px; margin: 20px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; border: 1px solid var(--line);">
       <div><strong style="font-size: 10px; color: #8a93a8; display: block; margin-bottom: 3px;">MENTOR A CARGO</strong><span style="font-size: 13px; color: #202a3d; font-weight: 600;">${p.mentor}</span></div>
       <div><strong style="font-size: 10px; color: #8a93a8; display: block; margin-bottom: 3px;">TIEMPO ESTIMADO</strong><span style="font-size: 13px; color: #202a3d; font-weight: 600;">${p.weeks}</span></div>
    </div>
    <h4 style="font-size: 14px; margin-bottom: 12px; color: #202a3d;">Equipos actuales reclutando (${p.teams})</h4>
    <ul style="list-style: none; padding: 0; margin: 0 0 25px 0; font-size: 13px; border: 1px solid var(--line); border-radius: 8px; overflow: hidden;">
       ${Array.from({length: p.teams}).map((_, i) => `<li style="padding: 14px 18px; border-bottom: 1px solid var(--line); background: white; display: flex; justify-content: space-between; align-items: center;"><strong>Equipo Alpha ${i+1}</strong> <span style="background: #eaf3eb; color: #52795d; font-size: 10px; padding: 3px 8px; border-radius: 10px; font-weight: 600;">2 vacantes abiertas</span></li>`).join('')}
    </ul>
    <div style="display: flex; gap: 15px;">
       <button class="btn outline full" style="margin-top: 0;" onclick="toast('Solicitud para unirse enviada al mentor.')">Unirse a un equipo</button>
       <button class="btn primary full" style="margin-top: 0;" onclick="toast('Formulario de creación de equipo abierto.')">Crear nuevo equipo</button>
    </div>
  `);
}

function triggerDemoChat(type) {
  const queries = [
     { q: "Genera el código de control del brazo robótico para la línea 4.", a: "Aquí tienes una propuesta de código para el controlador del brazo robótico. Ten en cuenta que los parámetros de torque y velocidad están en valores genéricos.", color: "red", label: "ROJO - Riesgo detectado / No validado en entorno industrial" },
     { q: "¿Qué protocolo de comunicación debo usar para un PLC Siemens?", a: "Los protocolos más comunes para PLC Siemens son PROFINET y MPI. Recomiendo PROFINET por su velocidad y estandarización en Ethernet industrial.", color: "amber", label: "AMARILLO - Requiere contrastar con requerimientos de tu planta" },
     { q: "Revisa este código con la hoja de datos técnica que adjunto.", a: "He analizado el código contra la hoja de datos. Los rangos de voltaje configurados (0-10V) coinciden exactamente con las especificaciones del sensor de presión de la página 4.", color: "green", label: "VERDE - Evidencia registrada y verificada con éxito" }
  ];
  demoChat.push(queries[type - 1]);
  shell(); 
}

// 6. ENRUTADOR PRINCIPAL
const views = { home, mentor: viewMentorSync, skills: viewSoftSkills, projects: viewProjects };

function navigate() {
  if (!state.name || !state.university) {
    renderLogin();
    return;
  }
  page = location.hash.slice(1);
  if (!views[page]) page = 'home';
  shell();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', navigate);

// 7. EVENTOS GENERALES (CLICS Y FORMULARIOS)
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const [action, id] = el.dataset.action.split(':');
  
  if (action === 'close') { $('#modal').close(); }
  else if (action === 'profile') { profile(); }
  else if (action === 'demo-chat') { triggerDemoChat(Number(id)); }
  else if (action === 'project-details') { showProjectDetails(Number(id)); }
  else if (action === 'logout') {
     state.name = '';
     state.university = '';
     save();
     $('#modal').close();
     navigate();
  }
  else if (action === 'edit-profile') {
     openModal(`
       <span class="eyebrow">EDITAR DATOS</span>
       <h2 id="modal-title">Actualiza tu perfil</h2>
       <form id="profile-form">
         <label for="profile-name">Nombre</label>
         <input id="profile-name" name="name" maxlength="40" value="${esc(state.name)}" required>
         <label for="profile-uni">Universidad</label>
         <input id="profile-uni" name="university" value="${esc(state.university)}" required>
         <label for="career">Carrera</label>
         <select name="career" id="career">
           ${['Ingeniería Mecatrónica','Otra Ingeniería','Tecnología','Negocios','Ciencias','Diseño y comunicación'].map(c=>`<option ${state.career===c?'selected':''}>${c}</option>`).join('')}
         </select>
         <button class="btn primary full" type="submit">Guardar cambios ${icon('check')}</button>
       </form>
     `);
  }
});

document.addEventListener('submit', e => {
  const form = e.target;
  e.preventDefault();
  const data = new FormData(form);
  
  if (form.id === 'login-form') {
     if (String(data.get('password')) !== 'i3labDT') {
       document.getElementById('login-error').style.display = 'block';
       return;
     }
     state.name = String(data.get('name')).trim();
     state.university = String(data.get('university')).trim();
     state.career = String(data.get('career'));
     save();
     toast('Sesión iniciada correctamente.');
     navigate();
  }
  
  if (form.id === 'profile-form') {
     state.name = String(data.get('name')).trim();
     state.university = String(data.get('university')).trim();
     state.career = String(data.get('career'));
     save();
     $('#modal').close();
     shell();
     toast('Perfil actualizado.');
  }
});

// 8. INICIO DE LA APLICACIÓN
navigate();