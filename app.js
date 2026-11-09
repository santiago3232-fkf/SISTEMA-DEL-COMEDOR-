import { INITIAL_COURSES, INITIAL_STUDENTS, INITIAL_USERS, MEAL_HOURS } from './data.js';
import { blockchain } from './blockchain.js';

// Estado global de la aplicación
class AppState {
  constructor() {
    this.storageKeyStudents = 'ci_students_db_v1';
    this.storageKeyUsers = 'ci_users_db_v1';
    this.storageKeyAuth = 'ci_current_user_v1';
    this.storageKeyCommitment = 'ci_commitment_accepted_v1';

    this.students = this.loadStudents();
    this.users = this.loadUsers();
    this.currentUser = this.loadAuthUser();
    this.activeView = this.currentUser ? this.getDefaultViewForRole(this.currentUser.rol) : 'auth';
    this.activeAuthTab = 'login'; // 'login' | 'register'
    this.activeMealFilter = 'desayuno'; // 'desayuno' | 'almuerzo'
    this.searchTerm = '';
    this.courseFilter = 'all';
    this.mobileModalOpen = false;
    this.qrScannerModalOpen = false;
    this.scannerActiveTab = 'doc'; // 'doc' | 'qr'
    this.scannerDocInput = '';
    this.scannerSearchResult = null;
    this.studentProfileModal = null;
    this.newStudentModalOpen = false;
    this.editingStudent = null;
    this.lastConfirmedMeal = null;
  }

  loadStudents() {
    const saved = localStorage.getItem(this.storageKeyStudents);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    localStorage.setItem(this.storageKeyStudents, JSON.stringify(INITIAL_STUDENTS));
    return [...INITIAL_STUDENTS];
  }

  saveStudents() {
    localStorage.setItem(this.storageKeyStudents, JSON.stringify(this.students));
  }

  loadUsers() {
    const saved = localStorage.getItem(this.storageKeyUsers);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    localStorage.setItem(this.storageKeyUsers, JSON.stringify(INITIAL_USERS));
    return [...INITIAL_USERS];
  }

  saveUsers() {
    localStorage.setItem(this.storageKeyUsers, JSON.stringify(this.users));
  }

  loadAuthUser() {
    const saved = localStorage.getItem(this.storageKeyAuth);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
  }

  setAuthUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(this.storageKeyAuth, JSON.stringify(user));
      this.activeView = this.getDefaultViewForRole(user.rol);
    } else {
      localStorage.removeItem(this.storageKeyAuth);
      this.activeView = 'auth';
    }
  }

  getDefaultViewForRole(rol) {
    if (rol === 'estudiante') {
      const commitmentAccepted = localStorage.getItem(this.storageKeyCommitment + '_' + (this.currentUser?.usuario || ''));
      return commitmentAccepted ? 'student_menu' : 'commitment';
    }
    return 'dashboard';
  }
}

export const state = new AppState();

// Iconos SVG en línea de alta resolución
export const ICONS = {
  utensils: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M14 2v20"/><path d="M6 2v6a3 3 0 0 0 3 3 3 3 0 0 0 3-3V2"/><path d="M10 2v20"/></svg>`,
  sun: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  checkCircle: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  user: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  users: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  home: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  clipboard: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>`,
  chart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
  database: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>`,
  bell: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
  lock: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  logout: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  plus: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  download: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  edit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
  trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  phone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>`,
  shield: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>`,
  qr: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>`,
  alert: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
  close: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
};

// Notificaciones Toast flotantes
export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
    <div>${message}</div>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

// Renderizador principal de vistas
export function renderApp() {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  // Si no hay usuario autenticado, mostramos Pantalla 1: Auth (Login / Registro)
  if (!state.currentUser || state.activeView === 'auth') {
    appRoot.innerHTML = renderAuthScreen();
    attachAuthEvents();
    return;
  }

  // Si es estudiante y aún no acepta el compromiso, mostramos Pantalla 3
  if (state.currentUser.rol === 'estudiante' && state.activeView === 'commitment') {
    appRoot.innerHTML = renderCommitmentScreen();
    attachCommitmentEvents();
    return;
  }

  // Si es estudiante y acaba de confirmar asistencia, mostramos Pantalla 8
  if (state.currentUser.rol === 'estudiante' && state.activeView === 'student_confirmation') {
    appRoot.innerHTML = renderConfirmationScreen();
    attachConfirmationEvents();
    return;
  }

  // Layout con Sidebar y Topbar
  appRoot.innerHTML = `
    <div class="app-container">
      ${renderSidebar()}
      <div class="main-wrapper">
        ${renderTopNavbar()}
        <main class="content-body" id="main-content">
          ${renderCurrentViewContent()}
        </main>
      </div>
    </div>
    ${renderModals()}
    <div class="toast-container" id="toast-container"></div>
  `;

  attachGlobalEvents();
}

// =========================================================
// 1. PANTALLA 1: INICIO DE SESIÓN Y REGISTRO (MOCKUP 1)
// =========================================================
function renderAuthScreen() {
  const isLogin = state.activeAuthTab === 'login';

  return `
    <div class="auth-page-wrapper">
      <!-- Columna izquierda: Branding Comedor Inteligente y Compensar -->
      <div class="auth-brand-side">
        <div class="brand-header">
          <div class="brand-icon-box">
            ${ICONS.utensils}
          </div>
          <div class="brand-title">Comedor Inteligente</div>
        </div>

        <div class="brand-hero-content">
          <h1 class="brand-hero-title">Tecnología para un mejor futuro</h1>
          <p class="brand-hero-subtitle">Mejor organización. Menos desperdicio.</p>
          
          <div class="brand-features-list">
            <div class="brand-feature-item">
              <span class="feature-check-icon">${ICONS.check}</span>
              <span>Organiza raciones en tiempo real</span>
            </div>
            <div class="brand-feature-item">
              <span class="feature-check-icon">${ICONS.check}</span>
              <span>Controla llegadas y entregas exactas</span>
            </div>
            <div class="brand-feature-item">
              <span class="feature-check-icon">${ICONS.check}</span>
              <span>Evita el desperdicio de alimentos</span>
            </div>
          </div>
        </div>

        <div class="brand-partner-footer">
          <span class="compensar-badge">compensar</span>
          <span class="partner-text">Juntos por una mejor alimentación escolar</span>
        </div>
      </div>

      <!-- Columna derecha: Formulario interactivo Login / Registro -->
      <div class="auth-form-side">
        <div class="auth-card">
          <div class="auth-header-text">
            <h2>${isLogin ? 'Iniciar sesión' : 'Crear cuenta de estudiante'}</h2>
            <p>${isLogin ? 'Ingresa tus datos para acceder al sistema' : 'Regístrate para confirmar tus comidas escolares'}</p>
          </div>

          <div class="auth-tabs">
            <button class="auth-tab-btn ${isLogin ? 'active' : ''}" id="tab-login-btn">Iniciar sesión</button>
            <button class="auth-tab-btn ${!isLogin ? 'active' : ''}" id="tab-register-btn">Registrar estudiante</button>
          </div>

          ${isLogin ? renderLoginForm() : renderRegisterForm()}

          <!-- Selector de credenciales demo para pruebas rápidas -->
          <div class="demo-credentials-box">
            <strong>⚡ Cuentas de demostración inmediata:</strong>
            <div class="demo-pills">
              <button class="demo-chip" data-user="superadmin" data-pass="admin">👑 Superadmin (Compensar / Directivos)</button>
              <button class="demo-chip" data-user="profesor" data-pass="profe">👨‍🏫 Profesor Coordinador</button>
              <button class="demo-chip" data-user="1023456789" data-pass="123">🎓 Estudiante: Santiago Gutiérrez (10°)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="toast-container" id="toast-container"></div>
  `;
}

function renderLoginForm() {
  return `
    <form id="login-form">
      <div class="form-group">
        <label for="login-username">Usuario o Documento de Identidad</label>
        <div class="input-with-icon">
          <span class="input-icon">${ICONS.user}</span>
          <input type="text" id="login-username" placeholder="Ej: superadmin o 1023456789" required autocomplete="username">
        </div>
      </div>

      <div class="form-group">
        <label for="login-password">Contraseña</label>
        <div class="input-with-icon">
          <span class="input-icon">${ICONS.lock}</span>
          <input type="password" id="login-password" placeholder="••••••••" required autocomplete="current-password">
        </div>
      </div>

      <div class="form-options-row">
        <label style="display:flex; align-items:center; gap:0.4rem; cursor:pointer;">
          <input type="checkbox" checked style="accent-color: var(--primary);"> Recordar sesión
        </label>
        <a href="javascript:void(0)" id="btn-forgot-password">¿Olvidaste tu contraseña?</a>
      </div>

      <button type="submit" class="btn-primary-auth">
        Entrar
      </button>
    </form>
  `;
}

function renderRegisterForm() {
  return `
    <form id="register-form">
      <div class="form-group">
        <label for="reg-nombre">Nombre y Apellido completo</label>
        <div class="input-with-icon">
          <span class="input-icon">${ICONS.user}</span>
          <input type="text" id="reg-nombre" placeholder="Ej: Evelyn Gutiérrez" required>
        </div>
      </div>

      <div class="form-group">
        <label for="reg-documento">Documento de identidad (Tarjeta de identidad)</label>
        <div class="input-with-icon">
          <span class="input-icon">${ICONS.shield}</span>
          <input type="text" id="reg-documento" placeholder="Ej: 1090123456" required>
        </div>
      </div>

      <div class="form-group">
        <label for="reg-curso">Curso escolar</label>
        <div class="input-with-icon">
          <span class="input-icon">${ICONS.clipboard}</span>
          <select id="reg-curso" required>
            <option value="">Selecciona tu curso...</option>
            ${INITIAL_COURSES.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="reg-password">Crea una contraseña</label>
        <div class="input-with-icon">
          <span class="input-icon">${ICONS.lock}</span>
          <input type="password" id="reg-password" placeholder="Mínimo 4 caracteres" required>
        </div>
      </div>

      <div class="form-group">
        <label for="reg-diet">Restricción alimentaria u observación (Opcional)</label>
        <input type="text" id="reg-diet" placeholder="Ej: Vegetariano, alérgico al maní..." style="width:100%; padding:0.75rem 1rem; border:1.5px solid var(--border-color); border-radius:var(--radius-md);">
      </div>

      <button type="submit" class="btn-primary-auth">
        Registrarme y acceder
      </button>
    </form>
  `;
}

function attachAuthEvents() {
  const tabLogin = document.getElementById('tab-login-btn');
  const tabRegister = document.getElementById('tab-register-btn');

  if (tabLogin) {
    tabLogin.addEventListener('click', () => {
      state.activeAuthTab = 'login';
      renderApp();
    });
  }

  if (tabRegister) {
    tabRegister.addEventListener('click', () => {
      state.activeAuthTab = 'register';
      renderApp();
    });
  }

  // Demo chips
  document.querySelectorAll('.demo-chip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const user = e.target.getAttribute('data-user');
      const pass = e.target.getAttribute('data-pass');
      const userObj = state.users.find(u => u.usuario.toLowerCase() === user.toLowerCase());
      if (userObj) {
        state.setAuthUser(userObj);
        showToast(`Bienvenido(a), ${userObj.nombre} (${userObj.rol})`, 'success');
        renderApp();
      }
    });
  });

  // Login submit
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('login-username').value.trim();
      const p = document.getElementById('login-password').value.trim();

      const foundUser = state.users.find(user => 
        (user.usuario.toLowerCase() === u.toLowerCase() || (user.documento && user.documento === u)) &&
        user.password === p
      );

      if (foundUser) {
        state.setAuthUser(foundUser);
        showToast(`Sesión iniciada como ${foundUser.nombre}`, 'success');
        renderApp();
      } else {
        showToast('Credenciales incorrectas. Verifica usuario y contraseña.', 'danger');
      }
    });
  }

  // Register submit
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = document.getElementById('reg-nombre').value.trim();
      const documento = document.getElementById('reg-documento').value.trim();
      const curso = document.getElementById('reg-curso').value;
      const password = document.getElementById('reg-password').value.trim();
      const diet = document.getElementById('reg-diet').value.trim() || 'Menú regular';

      if (state.students.some(s => s.documento === documento)) {
        showToast('Ya existe un estudiante registrado con este documento.', 'warning');
        return;
      }

      const nextId = String(state.students.length + 1).padStart(3, '0');
      const newStudent = {
        id: nextId,
        nombre,
        documento,
        curso,
        email: `${nombre.toLowerCase().replace(/\s+/g, '.')}@colegio.edu.co`,
        estado: 'Activo',
        desayunoConfirmado: false,
        almuerzoConfirmado: false,
        asisteHoy: false,
        recibioDesayuno: false,
        recibioAlmuerzo: false,
        horaLlegada: null,
        horaEntregaDesayuno: null,
        horaEntregaAlmuerzo: null,
        observaciones: diet
      };

      const newUser = {
        id: 'u_' + Date.now(),
        usuario: documento,
        nombre,
        email: newStudent.email,
        documento,
        curso,
        rol: 'estudiante',
        password
      };

      state.students.push(newStudent);
      state.saveStudents();

      state.users.push(newUser);
      state.saveUsers();

      // Registro en Blockchain del alta del nuevo estudiante
      await blockchain.addBlock(
        'REGISTRO_ESTUDIANTE',
        newStudent,
        `Nuevo estudiante auto-registrado en grado ${curso}`,
        'Auto-registro Estudiante'
      );

      state.setAuthUser(newUser);
      showToast('¡Registro exitoso! Por favor revisa y acepta tu compromiso con el comedor.', 'success');
      renderApp();
    });
  }

  const forgotBtn = document.getElementById('btn-forgot-password');
  if (forgotBtn) {
    forgotBtn.addEventListener('click', () => {
      alert('Para restablecer tu contraseña, contacta al Administrador de Compensar o a tu coordinador de curso.');
    });
  }
}

// =========================================================
// SIDEBAR Y NAVEGACIÓN PRINCIPAL
// =========================================================
function renderSidebar() {
  const isSuperadmin = state.currentUser.rol === 'superadmin';
  const isProfesor = state.currentUser.rol === 'profesor';
  const isEstudiante = state.currentUser.rol === 'estudiante';

  return `
    <aside class="sidebar" id="app-sidebar">
      <div class="sidebar-logo">
        <div class="brand-icon-box" style="width:36px; height:36px;">
          ${ICONS.utensils}
        </div>
        <div>
          <div style="font-weight:800; font-size:1.05rem; letter-spacing:-0.02em;">Comedor</div>
          <div style="font-size:0.75rem; color:#93C5FD; font-weight:600;">Inteligente</div>
        </div>
      </div>

      <nav class="sidebar-menu">
        ${!isEstudiante ? `
          <button class="nav-item ${state.activeView === 'dashboard' ? 'active' : ''}" data-view="dashboard">
            ${ICONS.home} <span>Inicio</span>
          </button>
          <button class="nav-item ${state.activeView === 'students_db' ? 'active' : ''}" data-view="students_db">
            ${ICONS.database} <span>Estudiantes</span>
          </button>
          <button class="nav-item ${state.activeView === 'daily_register' ? 'active' : ''}" data-view="daily_register">
            ${ICONS.clipboard} <span>Registro de comedor</span>
          </button>
          <button class="nav-item ${state.activeView === 'reports' ? 'active' : ''}" data-view="reports">
            ${ICONS.chart} <span>Reportes</span>
          </button>
          ${isSuperadmin ? `
            <button class="nav-item ${state.activeView === 'blockchain_audit' ? 'active' : ''}" data-view="blockchain_audit">
              ${ICONS.shield} <span>Blockchain & Auditoría</span>
            </button>
          ` : ''}
        ` : `
          <button class="nav-item ${state.activeView === 'student_menu' ? 'active' : ''}" data-view="student_menu">
            ${ICONS.home} <span>Mi Comedor</span>
          </button>
          <button class="nav-item ${state.activeView === 'commitment' ? 'active' : ''}" data-view="commitment">
            ${ICONS.checkCircle} <span>Mi Compromiso</span>
          </button>
        `}
      </nav>

      <div class="sidebar-bottom">
        <div class="user-quick-profile">
          <div class="avatar">
            ${state.currentUser.nombre.charAt(0)}
          </div>
          <div class="user-info-text">
            <div class="user-name">${state.currentUser.nombre}</div>
            <div class="user-role-badge">${state.currentUser.rol}</div>
          </div>
          <button id="btn-logout" class="table-action-btn" title="Cerrar sesión" style="color:#94A3B8;">
            ${ICONS.logout}
          </button>
        </div>
      </div>
    </aside>
  `;
}

function renderTopNavbar() {
  return `
    <header class="top-navbar">
      <div class="top-nav-left">
        <!-- Selector rápido de rol para evaluación del proyecto -->
        <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.82rem; background:var(--bg-page); padding:0.35rem 0.75rem; border-radius:var(--radius-full); border:1px solid var(--border-color);">
          <span style="font-weight:700; color:var(--primary);">⚡ Rol activo:</span>
          <select id="role-quick-switch" style="border:none; background:transparent; font-weight:600; color:var(--text-main); cursor:pointer;">
            <option value="superadmin" ${state.currentUser.rol === 'superadmin' ? 'selected' : ''}>Superadmin (Compensar / Directivos)</option>
            <option value="profesor" ${state.currentUser.rol === 'profesor' ? 'selected' : ''}>Profesor (Coordinador)</option>
            <option value="estudiante" ${state.currentUser.rol === 'estudiante' ? 'selected' : ''}>Estudiante (${state.currentUser.nombre})</option>
          </select>
        </div>
      </div>

      <div class="top-nav-right">
        ${state.currentUser.rol !== 'estudiante' ? `
          <button id="btn-navbar-scanner" class="btn-secondary" style="color:var(--primary); border-color:var(--primary-subtle); background:var(--primary-light); font-weight:600;" title="Registrar llegada por documento o carnet">
            ${ICONS.qr} <span>Escanear / Buscar Doc</span>
          </button>
        ` : ''}

        <!-- Botón para abrir Mockup 9: Vista móvil en marco de smartphone -->
        <button id="btn-open-mobile-sim" class="btn-secondary" title="Ver en simulador de pantalla de celular (Mockup 9)">
          ${ICONS.phone} <span>Vista Móvil (Mockup 9)</span>
        </button>

        <button class="btn-icon-nav" title="Notificaciones" id="btn-notif">
          ${ICONS.bell}
          <span class="badge-dot"></span>
        </button>

        <div style="display:flex; align-items:center; gap:0.5rem;">
          <div class="avatar" style="width:34px; height:34px; font-size:0.85rem;">
            ${state.currentUser.nombre.charAt(0)}
          </div>
          <span style="font-size:0.88rem; font-weight:600; color:var(--brand-navy);">${state.currentUser.nombre.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  `;
}

function renderCurrentViewContent() {
  switch (state.activeView) {
    case 'dashboard':
      return renderDashboardScreen();
    case 'students_db':
      return renderStudentsDbScreen();
    case 'daily_register':
      return renderDailyRegisterScreen();
    case 'reports':
      return renderReportsScreen();
    case 'blockchain_audit':
      return renderBlockchainScreen();
    case 'student_menu':
      return renderStudentMenuScreen();
    case 'commitment':
      return renderCommitmentScreen();
    case 'student_confirmation':
      return renderConfirmationScreen();
    default:
      return renderDashboardScreen();
  }
}

// =========================================================
// 2. PANTALLA 2: PANTALLA PRINCIPAL / INICIO (MOCKUP 2)
// =========================================================
function renderDashboardScreen() {
  const totalStudents = state.students.length;
  const breakfastServed = state.students.filter(s => s.recibioDesayuno).length;
  const lunchServed = state.students.filter(s => s.recibioAlmuerzo).length;
  const attendedToday = state.students.filter(s => s.asisteHoy).length;

  return `
    <div>
      <div class="greeting-header">
        <h1>¡Hola, ${state.currentUser.rol === 'profesor' ? 'profe' : state.currentUser.nombre.split(' ')[0]}!</h1>
        <p>Aquí puedes ver el resumen del día y evitar el desperdicio de comida</p>
      </div>

      <!-- Banner "No desperdiciemos comida" (Mockup 2) -->
      <div class="banner-zero-waste">
        <div class="banner-salad-circle">
          <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80" alt="Plato saludable" onerror="this.onerror=null; this.parentElement.innerHTML='<span style=\'font-size:3.2rem;\'>🥗</span>';">
        </div>
        <div class="banner-text-box">
          <h3>No desperdiciemos comida</h3>
          <p>Cada plato cuenta. Registra, controla y ayuda a que la comida llegue a quienes la necesitan.</p>
          <span class="banner-pill-tag">¡Juntos hacemos la diferencia!</span>
        </div>
      </div>

      <!-- Grid de las 4 Tarjetas de Acción Rápida (Mockup 2) -->
      <div class="quick-actions-grid">
        <div class="action-card action-blue" data-action-view="daily_register">
          <div class="action-card-icon-wrapper">
            ${ICONS.clipboard}
          </div>
          <h4>Registrar asistencia</h4>
          <p>Llegada al comedor y entrega real de alimentos</p>
        </div>

        <div class="action-card action-orange" data-action-view="daily_register" data-meal="almuerzo">
          <div class="action-card-icon-wrapper">
            ${ICONS.utensils}
          </div>
          <h4>Confirmar menú</h4>
          <p>Control de turnos: Desayuno y Almuerzo</p>
        </div>

        <div class="action-card action-purple" data-action-view="students_db">
          <div class="action-card-icon-wrapper">
            ${ICONS.database}
          </div>
          <h4>Ver base de datos</h4>
          <p>Alumnos de Transición a 11° y estados</p>
        </div>

        <div class="action-card action-green" data-action-view="reports">
          <div class="action-card-icon-wrapper">
            ${ICONS.chart}
          </div>
          <h4>Reportes</h4>
          <p>Control de desperdicio y métricas en tiempo real</p>
        </div>
      </div>

      <!-- Métricas rápidas de la jornada de hoy -->
      <h3 style="font-size:1.15rem; margin-bottom:1rem; color:var(--brand-navy);">Estado de la jornada escolar (Hoy)</h3>
      <div class="daily-stats-row">
        <div class="stat-metric-card">
          <div>
            <div class="metric-number">${attendedToday}</div>
            <div class="metric-label">Estudiantes en el comedor hoy</div>
          </div>
          <div style="color:var(--primary);">${ICONS.users}</div>
        </div>

        <div class="stat-metric-card">
          <div>
            <div class="metric-number" style="color:#D97706;">${breakfastServed}</div>
            <div class="metric-label">Desayunos entregados (6am-12m)</div>
          </div>
          <div style="color:#D97706;">${ICONS.sun}</div>
        </div>

        <div class="stat-metric-card">
          <div>
            <div class="metric-number" style="color:var(--primary);">${lunchServed}</div>
            <div class="metric-label">Almuerzos entregados (12m-2pm)</div>
          </div>
          <div style="color:var(--primary);">${ICONS.utensils}</div>
        </div>

        <div class="stat-metric-card">
          <div>
            <div class="metric-number" style="color:var(--success);">${totalStudents}</div>
            <div class="metric-label">Total matrícula registrada</div>
          </div>
          <div style="color:var(--success);">${ICONS.database}</div>
        </div>
      </div>
    </div>
  `;
}

// =========================================================
// 3. PANTALLA 3: COMPROMISO ESTUDIANTIL (MOCKUP 3)
// =========================================================
function renderCommitmentScreen() {
  return `
    <div class="modal-overlay" style="position:fixed;">
      <div class="modal-card">
        <div class="modal-icon-circle-lg modal-icon-commitment">
          ${ICONS.checkCircle}
        </div>

        <h2>Tu compromiso con el comedor</h2>

        <p>
          Usted autoriza y se compromete a <strong>desayunar y almorzar completamente</strong> en las horas estimadas, 
          para evitar el desperdicio de comida y apoyar la buena organización del comedor escolar.
        </p>

        <div style="display:flex; justify-content:center; gap:0.75rem; margin-bottom:1.75rem;">
          <span style="background:var(--warning-bg); color:var(--warning-text); border:1px solid var(--warning-border); padding:0.35rem 0.75rem; border-radius:var(--radius-full); font-size:0.8rem; font-weight:700;">
            ☀️ Desayuno: 6:00 a.m. – 12:00 m.
          </span>
          <span style="background:var(--primary-light); color:var(--primary-dark); border:1px solid var(--primary-subtle); padding:0.35rem 0.75rem; border-radius:var(--radius-full); font-size:0.8rem; font-weight:700;">
            🍽️ Almuerzo: 12:00 m. – 2:00 p.m.
          </span>
        </div>

        <button id="btn-accept-commitment" class="btn-primary-auth" style="background:var(--success);">
          Entiendo y acepto
        </button>
      </div>
    </div>
  `;
}

function attachCommitmentEvents() {
  const btn = document.getElementById('btn-accept-commitment');
  if (btn) {
    btn.addEventListener('click', () => {
      localStorage.setItem(state.storageKeyCommitment + '_' + (state.currentUser?.usuario || ''), 'true');
      state.activeView = 'student_menu';
      showToast('¡Compromiso aceptado! Ya puedes confirmar tus comidas.', 'success');
      renderApp();
    });
  }
}

// =========================================================
// 4. PANTALLA 4: BASE DE DATOS DE ESTUDIANTES (MOCKUP 4)
// =========================================================
function renderStudentsDbScreen() {
  let filtered = state.students;

  if (state.courseFilter !== 'all') {
    filtered = filtered.filter(s => s.curso === state.courseFilter);
  }

  if (state.searchTerm) {
    const q = state.searchTerm.toLowerCase();
    filtered = filtered.filter(s => 
      s.nombre.toLowerCase().includes(q) || 
      s.documento.includes(q) ||
      s.id.includes(q)
    );
  }

  const isSuperadmin = state.currentUser.rol === 'superadmin';

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <div>
          <h1 style="font-size:1.75rem; color:var(--brand-navy);">Base de datos de estudiantes</h1>
          <p style="color:var(--text-muted); font-size:0.95rem;">Gestión de matrícula desde Transición hasta grado 11°</p>
        </div>
        <div style="display:flex; gap:0.75rem;">
          <button id="btn-export-students" class="btn-secondary">
            ${ICONS.download} <span>Exportar Excel / CSV</span>
          </button>
          ${isSuperadmin ? `
            <button id="btn-new-student" class="btn-primary">
              ${ICONS.plus} <span>+ Nuevo estudiante</span>
            </button>
          ` : ''}
        </div>
      </div>

      <div class="table-container-card">
        <div class="table-header-controls">
          <div class="table-search-box">
            <span class="input-icon">${ICONS.search}</span>
            <input type="text" id="students-search-input" placeholder="Buscar por nombre, documento o ID..." value="${state.searchTerm}">
          </div>

          <div class="table-filter-group">
            <label style="font-size:0.85rem; font-weight:600; color:var(--brand-gray);">Curso:</label>
            <select id="course-filter-select">
              <option value="all">Todos los cursos (Transición a 11°)</option>
              ${INITIAL_COURSES.map(c => `
                <option value="${c}" ${state.courseFilter === c ? 'selected' : ''}>${c}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div style="overflow-x:auto;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del Estudiante</th>
                <th>Documento</th>
                <th>Curso</th>
                <th>Asiste Hoy</th>
                <th>Recibió Desayuno</th>
                <th>Recibió Almuerzo</th>
                <th>Estado</th>
                ${isSuperadmin ? '<th style="text-align:right;">Acciones</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${filtered.length === 0 ? `
                <tr>
                  <td colspan="9" style="text-align:center; padding:3rem; color:var(--text-muted);">
                    No se encontraron estudiantes con los filtros seleccionados.
                  </td>
                </tr>
              ` : filtered.map(student => `
                <tr>
                  <td style="font-weight:700; color:var(--brand-navy);">${student.id}</td>
                  <td>
                    <div style="font-weight:600;">${student.nombre}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${student.email}</div>
                  </td>
                  <td>${student.documento}</td>
                  <td><span style="font-weight:600; color:var(--brand-navy);">${student.curso}</span></td>
                  <td>
                    <span class="badge-status ${student.asisteHoy ? 'badge-yes' : 'badge-no'}">
                      ${student.asisteHoy ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td>
                    <span class="badge-status ${student.recibioDesayuno ? 'badge-yes' : 'badge-no'}">
                      ${student.recibioDesayuno ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td>
                    <span class="badge-status ${student.recibioAlmuerzo ? 'badge-yes' : 'badge-no'}">
                      ${student.recibioAlmuerzo ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td>
                    <span class="badge-status ${student.estado === 'Activo' ? 'badge-active' : 'badge-inactive'}">
                      ${student.estado}
                    </span>
                  </td>
                  ${isSuperadmin ? `
                    <td style="text-align:right;">
                      <button class="table-action-btn btn-edit-student" data-id="${student.id}" title="Editar">
                        ${ICONS.edit}
                      </button>
                      <button class="table-action-btn btn-delete btn-delete-student" data-id="${student.id}" title="Eliminar">
                        ${ICONS.trash}
                      </button>
                    </td>
                  ` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="padding:1rem 1.5rem; background:#F8FAFC; border-top:1px solid var(--border-color); font-size:0.85rem; color:var(--text-muted); display:flex; justify-content:space-between; align-items:center;">
          <span>Mostrando <strong>${filtered.length}</strong> de <strong>${state.students.length}</strong> estudiantes</span>
          <span>Cursos: Transición → 11° Bachillerato</span>
        </div>
      </div>
    </div>
  `;
}

// =========================================================
// 5. PANTALLA 5: GESTIÓN DIARIA / REGISTRO DE COMEDOR (MOCKUP 5)
// =========================================================
function renderDailyRegisterScreen() {
  const isBreakfast = state.activeMealFilter === 'desayuno';
  const currentService = isBreakfast ? 'Desayuno (6:00 a.m. – 12:00 m.)' : 'Almuerzo (12:00 m. – 2:00 p.m.)';

  let filtered = state.students;
  if (state.courseFilter !== 'all') {
    filtered = filtered.filter(s => s.curso === state.courseFilter);
  }
  if (state.searchTerm) {
    const q = state.searchTerm.toLowerCase();
    filtered = filtered.filter(s => s.nombre.toLowerCase().includes(q) || s.documento.includes(q));
  }

  const confirmedCount = isBreakfast 
    ? state.students.filter(s => s.desayunoConfirmado).length 
    : state.students.filter(s => s.almuerzoConfirmado).length;

  const arrivedCount = state.students.filter(s => s.asisteHoy).length;

  const deliveredCount = isBreakfast 
    ? state.students.filter(s => s.recibioDesayuno).length 
    : state.students.filter(s => s.recibioAlmuerzo).length;

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h1 style="font-size:1.75rem; color:var(--brand-navy);">Registro de comedor - Hoy</h1>
          <p style="color:var(--text-muted); font-size:0.95rem;">Lunes, 9 de Noviembre 2026 · Control de llegada y entrega real de raciones</p>
        </div>

        <div style="display:flex; gap:0.75rem;">
          <button id="btn-quick-qr" class="btn-secondary" style="color:var(--primary); border-color:var(--primary);">
            ${ICONS.qr} <span>Escáner de Credencial / QR</span>
          </button>
        </div>
      </div>

      <!-- Selector Desayuno / Almuerzo -->
      <div class="meal-switch-tabs">
        <button class="meal-tab-button ${isBreakfast ? 'active' : ''}" id="tab-meal-desayuno">
          ${ICONS.sun}
          <span>Desayuno (6:00 a.m. – 12:00 m.)</span>
        </button>
        <button class="meal-tab-button ${!isBreakfast ? 'active' : ''}" id="tab-meal-almuerzo">
          ${ICONS.utensils}
          <span>Almuerzo (12:00 m. – 2:00 p.m.)</span>
        </button>
      </div>

      <!-- KPIs del servicio actual -->
      <div class="daily-stats-row">
        <div class="stat-metric-card">
          <div>
            <div class="metric-number">${confirmedCount}</div>
            <div class="metric-label">Raciones confirmadas por alumnos</div>
          </div>
          <div style="color:var(--primary);">${ICONS.clipboard}</div>
        </div>

        <div class="stat-metric-card">
          <div>
            <div class="metric-number" style="color:#2563EB;">${arrivedCount}</div>
            <div class="metric-label">Llegaron al comedor</div>
          </div>
          <div style="color:#2563EB;">${ICONS.user}</div>
        </div>

        <div class="stat-metric-card">
          <div>
            <div class="metric-number" style="color:var(--success);">${deliveredCount}</div>
            <div class="metric-label">Platos entregados efectivamente</div>
          </div>
          <div style="color:var(--success);">${ICONS.checkCircle}</div>
        </div>

        <div class="stat-metric-card">
          <div>
            <div class="metric-number" style="color:var(--danger);">${Math.max(0, confirmedCount - deliveredCount)}</div>
            <div class="metric-label">Pendientes por reclamar</div>
          </div>
          <div style="color:var(--danger);">${ICONS.alert}</div>
        </div>
      </div>

      <!-- Controles y Tabla de Registro de Llegada / Entrega -->
      <div class="table-container-card">
        <div class="table-header-controls">
          <div class="table-search-box">
            <span class="input-icon">${ICONS.search}</span>
            <input type="text" id="daily-search-input" placeholder="Buscar alumno por nombre o documento..." value="${state.searchTerm}">
          </div>

          <div class="table-filter-group">
            <label style="font-size:0.85rem; font-weight:600; color:var(--brand-gray);">Filtrar Curso:</label>
            <select id="daily-course-filter">
              <option value="all">Todos los cursos</option>
              ${INITIAL_COURSES.map(c => `
                <option value="${c}" ${state.courseFilter === c ? 'selected' : ''}>${c}</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div style="overflow-x:auto;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Estudiante</th>
                <th>Documento</th>
                <th>Curso</th>
                <th>Confirmó Servicio</th>
                <th>Llegada al Comedor</th>
                <th>Entrega Real de Alimento</th>
                <th>Hora Registro</th>
                <th>Observaciones / Menú</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map((s, idx) => {
                const confirmed = isBreakfast ? s.desayunoConfirmado : s.almuerzoConfirmado;
                const delivered = isBreakfast ? s.recibioDesayuno : s.recibioAlmuerzo;
                const time = isBreakfast ? (s.horaEntregaDesayuno || s.horaLlegada || '-') : (s.horaEntregaAlmuerzo || s.horaLlegada || '-');

                return `
                  <tr>
                    <td style="font-weight:700;">${s.id}</td>
                    <td>
                      <div style="font-weight:600;">${s.nombre}</div>
                    </td>
                    <td>${s.documento}</td>
                    <td><span style="font-weight:600;">${s.curso}</span></td>
                    <td>
                      <span class="badge-status ${confirmed ? 'badge-yes' : 'badge-pending'}">
                        ${confirmed ? 'Confirmado' : 'No confirmó'}
                      </span>
                    </td>
                    <td>
                      <label class="toggle-switch" title="Marcar llegada al comedor">
                        <input type="checkbox" class="toggle-attendance" data-id="${s.id}" ${s.asisteHoy ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                      </label>
                      <span style="font-size:0.75rem; margin-left:0.5rem; font-weight:600; color:${s.asisteHoy ? 'var(--success)' : 'var(--text-light)'}">
                        ${s.asisteHoy ? 'Presente' : 'Ausente'}
                      </span>
                    </td>
                    <td>
                      <label class="toggle-switch" title="Entregar plato de comida">
                        <input type="checkbox" class="toggle-food-delivery" data-id="${s.id}" ${delivered ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                      </label>
                      <span style="font-size:0.75rem; margin-left:0.5rem; font-weight:600; color:${delivered ? 'var(--success)' : 'var(--danger)'}">
                        ${delivered ? 'Servido' : 'No servido'}
                      </span>
                    </td>
                    <td style="font-size:0.8rem; color:var(--text-muted);">${time}</td>
                    <td>
                      <span style="font-size:0.8rem; background:var(--bg-page); padding:0.25rem 0.5rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                        ${s.observaciones}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// =========================================================
// 6. PANTALLA 6: REPORTES Y CONTROL DE DESPERDICIO (MOCKUP 6)
// =========================================================
function renderReportsScreen() {
  const totalRationsServed = 326;
  const totalAttendances = 278;
  const totalWasted = 48; // Sobrantes / no consumidos estimados
  const utilizationRate = Math.round((totalRationsServed / (totalRationsServed + totalWasted)) * 100);

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h1 style="font-size:1.75rem; color:var(--brand-navy);">Reportes y control de desperdicio</h1>
          <p style="color:var(--text-muted); font-size:0.95rem;">Estimación y trazabilidad de raciones para directivos y Compensar</p>
        </div>

        <button id="btn-generate-report" class="btn-primary">
          ${ICONS.download} <span>Generar reporte oficial</span>
        </button>
      </div>

      <!-- KPIs según Mockup 6 -->
      <div class="reports-kpis-grid">
        <div class="kpi-card">
          <div class="kpi-icon-circle" style="background:#DCFCE7; color:#16A34A;">
            ${ICONS.utensils}
          </div>
          <div class="kpi-card-content">
            <h3>${totalRationsServed}</h3>
            <p>Consumo total de alimentos (Raciones servidas)</p>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-circle" style="background:#DBEAFE; color:#2563EB;">
            ${ICONS.users}
          </div>
          <div class="kpi-card-content">
            <h3>${totalAttendances}</h3>
            <p>Asistencias al comedor</p>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-circle" style="background:#FEF3C7; color:#D97706;">
            ${ICONS.alert}
          </div>
          <div class="kpi-card-content">
            <h3 style="color:#D97706;">${totalWasted}</h3>
            <p>Sobrantes y desperdicio evitable</p>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-circle" style="background:#F5F3FF; color:#7C3AED;">
            ${ICONS.shield}
          </div>
          <div class="kpi-card-content">
            <h3 style="color:#7C3AED;">${utilizationRate}%</h3>
            <p>Tasa de aprovechamiento</p>
          </div>
        </div>
      </div>

      <!-- Gráficos de Reporte (Mockup 6) -->
      <div class="reports-charts-split">
        <!-- Gráfico Donut de Uso de Alimentos -->
        <div class="chart-card">
          <div class="chart-card-header">
            <h3 style="font-size:1.15rem; color:var(--brand-navy);">Uso de alimentos</h3>
            <span style="font-size:0.8rem; color:var(--text-muted);">Periodo actual</span>
          </div>

          <div class="donut-chart-container">
            <svg width="180" height="180" viewBox="0 0 42 42">
              <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#E2E8F0" stroke-width="6"></circle>
              <!-- Segmento 85% Consumido (Verde) -->
              <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10B981" stroke-width="6" stroke-dasharray="85 15" stroke-dashoffset="25"></circle>
              <!-- Segmento 15% Sobrante (Naranja) -->
              <circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#F59E0B" stroke-width="6" stroke-dasharray="15 85" stroke-dashoffset="40"></circle>
              <g class="chart-text">
                <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" font-size="0.45rem" font-weight="800" fill="#0F172A">85%</text>
                <text x="50%" y="62%" dominant-baseline="middle" text-anchor="middle" font-size="0.22rem" font-weight="600" fill="#64748B">Consumido</text>
              </g>
            </svg>

            <div class="donut-legend">
              <div class="legend-item">
                <span class="legend-color-dot" style="background:#10B981;"></span>
                <span>85% Alimento consumido</span>
              </div>
              <div class="legend-item">
                <span class="legend-color-dot" style="background:#F59E0B;"></span>
                <span>15% Sobrante / Desperdicio</span>
              </div>
              <div class="legend-item">
                <span class="legend-color-dot" style="background:#3B82F6;"></span>
                <span>0% Descuadre en inventario</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Barras de Consumo por Curso -->
        <div class="chart-card">
          <div class="chart-card-header">
            <h3 style="font-size:1.15rem; color:var(--brand-navy);">Asistencia y consumo por grado</h3>
            <span style="font-size:0.8rem; color:var(--text-muted);">Transición a 11°</span>
          </div>

          <div class="course-bars-list">
            <div class="course-bar-row">
              <div class="course-bar-header">
                <span>Transición a 3° Primaria</span>
                <span>94% raciones servidas</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: 94%; background: #10B981;"></div>
              </div>
            </div>

            <div class="course-bar-row">
              <div class="course-bar-header">
                <span>4° y 5° Primaria</span>
                <span>88% raciones servidas</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: 88%; background: #2563EB;"></div>
              </div>
            </div>

            <div class="course-bar-row">
              <div class="course-bar-header">
                <span>6° a 8° Bachillerato</span>
                <span>82% raciones servidas</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: 82%; background: #3B82F6;"></div>
              </div>
            </div>

            <div class="course-bar-row">
              <div class="course-bar-header">
                <span>9° a 11° Bachillerato</span>
                <span>79% raciones servidas</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: 79%; background: #F59E0B;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Movimientos Recientes / Historial (Mockup 6) -->
      <div class="table-container-card">
        <div style="padding:1.25rem 1.5rem; border-bottom:1px solid var(--border-color);">
          <h3 style="font-size:1.1rem; color:var(--brand-navy);">Movimientos recientes en tiempo real</h3>
        </div>

        <div style="overflow-x:auto;">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Estudiante</th>
                <th>Curso</th>
                <th>Acción / Movimiento</th>
                <th>Ración</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>09/11/2026 07:55 a.m.</td>
                <td style="font-weight:600;">Santiago Gutiérrez</td>
                <td>10° Bachillerato</td>
                <td>Entrega de alimento servido</td>
                <td>Desayuno</td>
                <td><span class="badge-status badge-yes">Completado</span></td>
              </tr>
              <tr>
                <td>09/11/2026 07:45 a.m.</td>
                <td style="font-weight:600;">Santiago Gutiérrez</td>
                <td>10° Bachillerato</td>
                <td>Registro de llegada al comedor</td>
                <td>General</td>
                <td><span class="badge-status badge-active">Asistió</span></td>
              </tr>
              <tr>
                <td>09/11/2026 07:40 a.m.</td>
                <td style="font-weight:600;">María López</td>
                <td>7° Bachillerato</td>
                <td>Entrega de alimento servido</td>
                <td>Desayuno</td>
                <td><span class="badge-status badge-yes">Completado</span></td>
              </tr>
              <tr>
                <td>09/11/2026 07:30 a.m.</td>
                <td style="font-weight:600;">Valentina Gómez</td>
                <td>9° Bachillerato</td>
                <td>Entrega de alimento servido</td>
                <td>Desayuno</td>
                <td><span class="badge-status badge-yes">Completado</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// =========================================================
// 7. PANTALLA 7: VISTA ESTUDIANTE - MENÚ PRINCIPAL (MOCKUP 7)
// =========================================================
function renderStudentMenuScreen() {
  const student = state.students.find(s => s.documento === state.currentUser.usuario || s.id === state.currentUser.id) || {
    nombre: state.currentUser.nombre,
    curso: state.currentUser.curso || '10° Bachillerato',
    desayunoConfirmado: true,
    almuerzoConfirmado: false,
    asisteHoy: true,
    recibioDesayuno: true,
    recibioAlmuerzo: false,
    horaLlegada: '07:45 a.m.',
    horaEntregaDesayuno: '07:55 a.m.',
    horaEntregaAlmuerzo: null
  };

  return `
    <div>
      <!-- Saludo personalizado al estudiante (Mockup 7) -->
      <div class="student-greeting-box">
        <h1>¡Hola, ${student.nombre.split(' ')[0]}!</h1>
        <p>Tu compromiso hace la diferencia. Confirma con anticipación las raciones que consumirás hoy para evitar el desperdicio.</p>
        <div style="margin-top:1rem; font-size:0.85rem; background:rgba(255,255,255,0.15); display:inline-block; padding:0.35rem 0.85rem; border-radius:var(--radius-full);">
          Curso: <strong>${student.curso}</strong> · Doc: <strong>${student.documento || state.currentUser.usuario}</strong>
        </div>
      </div>

      <!-- Tarjetas duales Desayuno y Almuerzo (Mockup 7) -->
      <div class="meal-cards-duo">
        <!-- Tarjeta Desayuno -->
        <div class="meal-card meal-breakfast ${student.desayunoConfirmado ? 'highlighted' : ''}">
          <div>
            <div class="meal-card-top">
              <div class="meal-icon-badge">
                ${ICONS.sun}
              </div>
              <span class="badge-status ${student.desayunoConfirmado ? 'badge-yes' : 'badge-pending'}">
                ${student.desayunoConfirmado ? 'Confirmado' : 'Pendiente'}
              </span>
            </div>

            <div class="meal-info">
              <h3>Desayuno</h3>
              <div class="meal-time-tag">⏰ 6:00 a.m. – 12:00 m.</div>
            </div>

            <div class="meal-status-box">
              <div class="status-line">
                <span class="status-label">Llegada al comedor:</span>
                <strong style="color:${student.asisteHoy ? 'var(--success)' : 'var(--text-muted)'};">
                  ${student.asisteHoy ? `Registrada (${student.horaLlegada || '07:45 a.m.'})` : 'Pendiente por registrar'}
                </strong>
              </div>
              <div class="status-line">
                <span class="status-label">Plato servido:</span>
                <strong style="color:${student.recibioDesayuno ? 'var(--success)' : 'var(--warning-text)'};">
                  ${student.recibioDesayuno ? '¡Recibido con éxito! 🥗' : 'Pendiente en ventanilla'}
                </strong>
              </div>
            </div>
          </div>

          <button class="btn-confirm-meal btn-confirm-breakfast" id="btn-student-confirm-breakfast">
            ${student.desayunoConfirmado ? '✓ Asistencia Confirmada' : 'Confirmar Asistencia a Desayuno'}
          </button>
        </div>

        <!-- Tarjeta Almuerzo -->
        <div class="meal-card meal-lunch ${student.almuerzoConfirmado ? 'highlighted' : ''}">
          <div>
            <div class="meal-card-top">
              <div class="meal-icon-badge">
                ${ICONS.utensils}
              </div>
              <span class="badge-status ${student.almuerzoConfirmado ? 'badge-yes' : 'badge-pending'}">
                ${student.almuerzoConfirmado ? 'Confirmado' : 'Pendiente'}
              </span>
            </div>

            <div class="meal-info">
              <h3>Almuerzo</h3>
              <div class="meal-time-tag">⏰ 12:00 m. – 2:00 p.m.</div>
            </div>

            <div class="meal-status-box">
              <div class="status-line">
                <span class="status-label">Llegada al comedor:</span>
                <strong style="color:${student.asisteHoy ? 'var(--success)' : 'var(--text-muted)'};">
                  ${student.asisteHoy ? `Presente en sede` : 'No registrada aún'}
                </strong>
              </div>
              <div class="status-line">
                <span class="status-label">Plato servido:</span>
                <strong style="color:${student.recibioAlmuerzo ? 'var(--success)' : 'var(--warning-text)'};">
                  ${student.recibioAlmuerzo ? '¡Recibido con éxito! 🍲' : 'Disponible a partir de las 12:00 m.'}
                </strong>
              </div>
            </div>
          </div>

          <button class="btn-confirm-meal btn-confirm-lunch" id="btn-student-confirm-lunch">
            ${student.almuerzoConfirmado ? '✓ Asistencia Confirmada' : 'Confirmar Asistencia a Almuerzo'}
          </button>
        </div>
      </div>

      <!-- Garantía de Privacidad del Estudiante -->
      <div style="background:#FFFFFF; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1.25rem 1.5rem; display:flex; align-items:center; gap:1rem;">
        <div style="color:var(--primary); font-size:1.5rem;">🔒</div>
        <div style="font-size:0.85rem; color:var(--text-muted);">
          <strong>Privacidad garantizada:</strong> Como estudiante, tienes acceso exclusivamente a tu propio registro de alimentos y asistencia. No es posible visualizar la información de otros compañeros.
        </div>
      </div>
    </div>
  `;
}

// =========================================================
// 8. PANTALLA 8: VISTA ESTUDIANTE - CONFIRMACIÓN (MOCKUP 8)
// =========================================================
function renderConfirmationScreen() {
  const mealType = state.lastConfirmedMeal || 'Desayuno';
  const hours = mealType === 'Desayuno' ? '6:00 a.m. – 12:00 m.' : '12:00 m. – 2:00 p.m.';

  return `
    <div class="modal-overlay" style="position:fixed;">
      <div class="modal-card">
        <div class="modal-icon-circle-lg modal-icon-success">
          ${ICONS.check}
        </div>

        <h2>¡Listo, ${state.currentUser.nombre.split(' ')[0]}!</h2>
        <p>Tu asistencia ha sido registrada correctamente en el sistema de Comedor Inteligente.</p>

        <div style="background:var(--bg-page); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:1.75rem; text-align:left;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.9rem;">
            <span style="color:var(--text-muted);">Servicio:</span>
            <strong>${mealType}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.9rem;">
            <span style="color:var(--text-muted);">Horario:</span>
            <strong>${hours}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
            <span style="color:var(--text-muted);">Estado:</span>
            <span class="badge-status badge-yes">Confirmado para Hoy</span>
          </div>
        </div>

        <button id="btn-back-to-home" class="btn-primary-auth">
          Volver al inicio
        </button>
      </div>
    </div>
  `;
}

function attachConfirmationEvents() {
  const btn = document.getElementById('btn-back-to-home');
  if (btn) {
    btn.addEventListener('click', () => {
      state.activeView = 'student_menu';
      renderApp();
    });
  }
}

// =========================================================
// BLOCKCHAIN & AUDITORÍA DE RACIONES (SLIDE 9)
// =========================================================
function renderBlockchainScreen() {
  const blocks = blockchain.getAllBlocks();

  return `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h1 style="font-size:1.75rem; color:var(--brand-navy);">Cadena de bloques & Auditoría de Raciones</h1>
          <p style="color:var(--text-muted); font-size:0.95rem;">Trazabilidad criptográfica SHA-256 e inmutabilidad de cada entrega para Compensar (Slide 9)</p>
        </div>

        <button id="btn-verify-blockchain" class="btn-primary" style="background:#0F172A;">
          ${ICONS.shield} <span>Verificar integridad de la cadena</span>
        </button>
      </div>

      <div class="blockchain-chain-view">
        ${blocks.map(block => `
          <div class="blockchain-block-item">
            <div class="block-header-row">
              <div style="display:flex; align-items:center; gap:0.65rem;">
                <span class="block-number-badge">Bloque #${block.index}</span>
                <strong style="color:var(--primary); font-size:0.9rem;">${block.data.tipoEvento}</strong>
              </div>
              <span style="font-size:0.75rem; color:var(--text-muted);">
                ${new Date(block.timestamp).toLocaleString('es-CO')}
              </span>
            </div>

            <div style="font-size:0.88rem; margin-bottom:0.5rem;">
              <strong>Detalle:</strong> ${block.data.detalles}
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.5rem; font-size:0.8rem; color:var(--brand-gray); margin-bottom:0.5rem;">
              <div>👤 Estudiante: <strong>${block.data.estudianteNombre}</strong></div>
              <div>🏫 Curso: <strong>${block.data.curso}</strong></div>
              <div>🔒 Doc Hash: <code>${block.data.docHash || 'N/A'}</code></div>
              <div>✍️ Operador: <strong>${block.data.operador}</strong></div>
            </div>

            <div class="block-hash-box">
              <div><strong>Hash previo:</strong> ${block.previousHash}</div>
              <div style="color:var(--primary-dark); margin-top:2px;"><strong>Hash bloque (SHA-256):</strong> ${block.hash}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// =========================================================
// 9. PANTALLA 9: MODAL SIMULADOR VISTA MÓVIL (MOCKUP 9)
// =========================================================
function renderModals() {
  let modalsHtml = '';

  // Modal Vista Móvil (Mockup 9)
  if (state.mobileModalOpen) {
    const student = state.students.find(s => s.documento === state.currentUser.usuario) || state.students[0];

    modalsHtml += `
      <div class="modal-overlay mobile-simulator-modal" id="mobile-modal-overlay">
        <div class="mobile-phone-frame">
          <div class="mobile-notch">
            <div class="camera-dot"></div>
          </div>

          <div class="mobile-screen-content">
            <div class="mobile-status-bar">
              <span>9:41</span>
              <span>📶 5G 🔋</span>
            </div>

            <div class="mobile-top-bar">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <div style="color:var(--primary);">${ICONS.utensils}</div>
                <strong style="font-size:0.95rem;">Comedor Inteligente</strong>
              </div>
              <button id="btn-close-mobile-sim" style="background:transparent; color:var(--text-muted);">
                ${ICONS.close}
              </button>
            </div>

            <div class="mobile-body">
              <div style="font-weight:800; font-size:1.15rem; margin-bottom:0.25rem;">¡Hola, ${student.nombre.split(' ')[0]}!</div>
              <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">Curso ${student.curso}</div>

              <!-- Mi resumen (Mockup 9) -->
              <div style="background:#FFFFFF; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1rem; margin-bottom:1rem;">
                <div style="font-weight:700; font-size:0.88rem; margin-bottom:0.75rem;">Mi resumen de hoy</div>
                
                <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0; border-bottom:1px solid var(--border-color);">
                  <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem;">
                    <span>☀️ Desayuno</span>
                  </div>
                  <span class="badge-status ${student.desayunoConfirmado ? 'badge-yes' : 'badge-pending'}">
                    ${student.desayunoConfirmado ? 'Confirmado' : 'Pendiente'}
                  </span>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0;">
                  <div style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem;">
                    <span>🍽️ Almuerzo</span>
                  </div>
                  <span class="badge-status ${student.almuerzoConfirmado ? 'badge-yes' : 'badge-pending'}">
                    ${student.almuerzoConfirmado ? 'Confirmado' : 'Pendiente'}
                  </span>
                </div>
              </div>

              <!-- Horarios (Mockup 9) -->
              <div style="background:#FFFFFF; border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:1rem; margin-bottom:1rem;">
                <div style="font-weight:700; font-size:0.88rem; margin-bottom:0.75rem;">Horarios de comida</div>
                <div style="font-size:0.8rem; margin-bottom:0.4rem;">
                  <strong>Desayuno:</strong> 6:00 a.m. – 12:00 m.
                </div>
                <div style="font-size:0.8rem;">
                  <strong>Almuerzo:</strong> 12:00 m. – 2:00 p.m.
                </div>
              </div>

              <!-- Estado de entrega -->
              <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:var(--radius-lg); padding:0.85rem; font-size:0.8rem; color:#065F46;">
                ✓ <strong>Compromiso activo:</strong> Desayunar y almorzar completamente evita el desperdicio.
              </div>
            </div>

            <!-- Bottom navigation bar (Mockup 9) -->
            <div class="mobile-bottom-nav">
              <button class="mobile-nav-btn active">
                ${ICONS.home}
                <span>Inicio</span>
              </button>
              <button class="mobile-nav-btn">
                ${ICONS.clipboard}
                <span>Horario</span>
              </button>
              <button class="mobile-nav-btn">
                ${ICONS.user}
                <span>Mi perfil</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Modal Nuevo Estudiante (Superadmin)
  if (state.newStudentModalOpen) {
    modalsHtml += `
      <div class="modal-overlay" id="new-student-modal-overlay">
        <div class="modal-card" style="max-width:520px; text-align:left;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h2 style="font-size:1.4rem; color:var(--brand-navy); margin:0;">+ Registrar nuevo estudiante</h2>
            <button id="btn-close-new-student" style="background:transparent; color:var(--text-muted);">${ICONS.close}</button>
          </div>

          <form id="form-create-student">
            <div class="form-group">
              <label>Nombre completo</label>
              <input type="text" id="modal-student-name" required placeholder="Ej: Camilo Andrés Rojas" style="width:100%; padding:0.65rem 0.85rem; border:1.5px solid var(--border-color); border-radius:var(--radius-md);">
            </div>

            <div class="form-group">
              <label>Documento de identidad</label>
              <input type="text" id="modal-student-doc" required placeholder="Ej: 1099887766" style="width:100%; padding:0.65rem 0.85rem; border:1.5px solid var(--border-color); border-radius:var(--radius-md);">
            </div>

            <div class="form-group">
              <label>Curso</label>
              <select id="modal-student-course" required style="width:100%; padding:0.65rem 0.85rem; border:1.5px solid var(--border-color); border-radius:var(--radius-md); background:#fff;">
                ${INITIAL_COURSES.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label>Observaciones de dieta / Alergias</label>
              <input type="text" id="modal-student-obs" placeholder="Ej: Sin restricciones o intolerancia" style="width:100%; padding:0.65rem 0.85rem; border:1.5px solid var(--border-color); border-radius:var(--radius-md);">
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem;">
              <button type="button" id="btn-cancel-new-student" class="btn-secondary">Cancelar</button>
              <button type="submit" class="btn-primary">Guardar estudiante</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // Modal Escáner QR y Registro por Número de Identidad
  if (state.qrScannerModalOpen) {
    const isDocTab = state.scannerActiveTab === 'doc';
    const isBreakfast = state.activeMealFilter === 'desayuno';
    const currentService = isBreakfast ? 'Desayuno' : 'Almuerzo';

    modalsHtml += `
      <div class="modal-overlay" id="qr-modal-overlay">
        <div class="modal-card" style="max-width:540px; text-align:left;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <div>
              <h2 style="font-size:1.35rem; color:var(--brand-navy); margin:0;">Registro de Ingreso al Comedor</h2>
              <p style="font-size:0.82rem; color:var(--text-muted); margin:0.2rem 0 0 0;">
                Turno activo: <strong>${currentService}</strong> · Servicio escolar oficial
              </p>
            </div>
            <button id="btn-close-qr" style="background:transparent; color:var(--text-muted); font-size:1.2rem; cursor:pointer;">${ICONS.close}</button>
          </div>

          <!-- Selector de Modo: Por Documento (si perdió el carnet) vs Lector QR -->
          <div class="auth-tabs" style="margin-bottom:1.25rem;">
            <button class="auth-tab-btn ${isDocTab ? 'active' : ''}" id="tab-scanner-doc-mode">
              💳 Por Número de Identidad (Sin carnet)
            </button>
            <button class="auth-tab-btn ${!isDocTab ? 'active' : ''}" id="tab-scanner-qr-mode">
              📷 Escanear Carnet / QR
            </button>
          </div>

          ${isDocTab ? `
            <!-- MODO 1: Búsqueda por número de documento de identidad -->
            <div>
              <div class="form-group" style="margin-bottom:0.85rem;">
                <label style="font-weight:700; color:var(--brand-navy); font-size:0.9rem;">
                  Ingresa el número de documento de identidad (TI / CC):
                </label>
                <div style="display:flex; gap:0.5rem; margin-top:0.4rem;">
                  <div class="input-with-icon" style="flex:1;">
                    <span class="input-icon">${ICONS.search}</span>
                    <input type="text" id="scanner-doc-input" placeholder="Ej: 1023456789 o 1089012345..." value="${state.scannerDocInput || ''}" autocomplete="off" autofocus>
                  </div>
                  <button type="button" id="btn-submit-scanner-doc" class="btn-primary" style="white-space:nowrap; padding:0.65rem 1.15rem;">
                    Buscar y Registrar
                  </button>
                </div>
                <span style="font-size:0.75rem; color:var(--text-muted); display:block; margin-top:0.35rem;">
                  ℹ️ Si el estudiante olvidó o extravió su carnet físico, digita su documento para registrar su llegada de inmediato.
                </span>
              </div>

              <!-- Resultado de la Búsqueda y Registro -->
              ${state.scannerSearchResult ? `
                ${state.scannerSearchResult.found ? `
                  <div style="background:#ECFDF5; border:1.5px solid #10B981; border-radius:var(--radius-lg); padding:1.25rem; margin-top:1rem; animation:modalPop 0.2s ease;">
                    <div style="display:flex; align-items:center; gap:0.5rem; color:#065F46; font-weight:800; font-size:1.05rem; margin-bottom:0.75rem;">
                      <span style="font-size:1.3rem;">✅</span>
                      <span>${state.scannerSearchResult.alreadyArrived ? 'Asistencia registrada previamente' : '¡Asistencia y llegada registrada con éxito!'}</span>
                    </div>

                    <!-- Ficha del estudiante encontrado -->
                    <div style="background:#FFFFFF; border:1px solid #A7F3D0; border-radius:var(--radius-md); padding:1rem; display:flex; align-items:center; gap:1rem; margin-bottom:0.85rem;">
                      <div class="avatar" style="width:52px; height:52px; font-size:1.3rem; background:#DBEAFE; color:#1D4ED8; flex-shrink:0;">
                        ${state.scannerSearchResult.student.nombre.charAt(0)}
                      </div>
                      <div style="flex:1;">
                        <div style="font-weight:800; font-size:1.1rem; color:var(--brand-navy);">
                          ${state.scannerSearchResult.student.nombre}
                        </div>
                        <div style="font-size:0.84rem; color:var(--text-muted);">
                          Documento: <strong>${state.scannerSearchResult.student.documento}</strong> · Curso: <strong style="color:var(--primary);">${state.scannerSearchResult.student.curso}</strong>
                        </div>
                        <div style="font-size:0.8rem; color:#065F46; margin-top:0.25rem;">
                          🥗 <strong>Dieta:</strong> ${state.scannerSearchResult.student.observaciones || 'Menú regular'}
                        </div>
                      </div>
                    </div>

                    <!-- Tiempos de registro -->
                    <div style="font-size:0.85rem; color:#065F46; background:rgba(16, 185, 129, 0.1); padding:0.6rem 0.85rem; border-radius:var(--radius-sm); margin-bottom:1rem; display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
                      <span>🕒 <strong>Hora llegada:</strong> ${state.scannerSearchResult.student.horaLlegada || 'Registrada'}</span>
                      <span>🍲 <strong>Plato servido:</strong> ${isBreakfast ? (state.scannerSearchResult.student.recibioDesayuno ? '¡Sí, recibido! ✓' : 'Pendiente en fila') : (state.scannerSearchResult.student.recibioAlmuerzo ? '¡Sí, recibido! ✓' : 'Pendiente en fila')}</span>
                    </div>

                    <!-- Botones de Acción Inmediata solicitados por el usuario -->
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                      <button type="button" class="btn-primary btn-view-profile-from-scanner" data-id="${state.scannerSearchResult.student.id}" style="flex:1; justify-content:center; font-size:0.85rem;">
                        👤 Ver perfil / Ficha
                      </button>

                      <button type="button" class="btn-secondary btn-quick-deliver-from-scanner" data-id="${state.scannerSearchResult.student.id}" style="flex:1.2; justify-content:center; font-size:0.85rem; background:#10B981; color:#fff; border-color:#10B981; font-weight:700;">
                        🍲 Entregar ración ahora
                      </button>

                      <button type="button" id="btn-reset-scanner-search" class="btn-secondary" style="padding:0.5rem 0.85rem; font-size:0.85rem;" title="Registrar a otro alumno">
                        Otro alumno
                      </button>
                    </div>
                  </div>
                ` : `
                  <!-- No encontrado -->
                  <div style="background:#FEF2F2; border:1.5px solid #EF4444; border-radius:var(--radius-lg); padding:1.25rem; margin-top:1rem; color:#991B1B;">
                    <div style="font-weight:800; font-size:1rem; display:flex; align-items:center; gap:0.5rem;">
                      <span>❌</span> Estudiante no encontrado
                    </div>
                    <p style="font-size:0.85rem; margin-top:0.4rem; color:#B91C1C;">
                      No existe ningún estudiante registrado en el sistema con el documento: <strong>"${state.scannerSearchResult.query}"</strong>.
                    </p>
                    <div style="margin-top:0.75rem; display:flex; gap:0.5rem;">
                      <button type="button" id="btn-retry-scanner-doc" class="btn-secondary" style="font-size:0.82rem;">
                        Intentar de nuevo
                      </button>
                      ${state.currentUser.rol === 'superadmin' ? `
                        <button type="button" id="btn-open-create-from-scanner" class="btn-primary" style="font-size:0.82rem; background:#B91C1C;">
                          + Registrar a este estudiante
                        </button>
                      ` : ''}
                    </div>
                  </div>
                `}
              ` : ''}
            </div>
          ` : `
            <!-- MODO 2: Escáner óptico de credencial / QR -->
            <div>
              <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
                Simula la lectura del código QR o código de barras de la credencial física del alumno:
              </p>

              <div style="background:#0F172A; border-radius:var(--radius-lg); padding:1.75rem; color:#fff; display:flex; flex-direction:column; align-items:center; gap:0.75rem; margin-bottom:1.25rem;">
                <div style="width:110px; height:110px; border:2px dashed #3B82F6; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; color:#3B82F6;">
                  ${ICONS.qr}
                </div>
                <span style="font-size:0.8rem; color:#94A3B8;">Lector óptico activo y sincronizado</span>
              </div>

              <div class="form-group" style="text-align:left;">
                <label style="font-size:0.88rem; font-weight:600; color:var(--brand-navy);">Selecciona la credencial del estudiante:</label>
                <select id="select-scanner-student" style="width:100%; padding:0.65rem 0.85rem; border:1.5px solid var(--border-color); border-radius:var(--radius-md); background:#fff; margin-top:0.35rem;">
                  ${state.students.map(s => `
                    <option value="${s.id}">${s.nombre} (${s.curso}) - Doc: ${s.documento}</option>
                  `).join('')}
                </select>
              </div>

              <button id="btn-simulate-scan-pass" class="btn-primary-auth" style="margin-top:1rem;">
                Escanear Credencial y Registrar Entrega
              </button>
            </div>
          `}
        </div>
      </div>
    `;
  }

  // Modal Perfil Completo del Estudiante
  if (state.studentProfileModal) {
    const st = state.studentProfileModal;
    const isBreakfast = state.activeMealFilter === 'desayuno';

    modalsHtml += `
      <div class="modal-overlay" id="profile-modal-overlay">
        <div class="modal-card" style="max-width:540px; text-align:left; position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; border-bottom:1px solid var(--border-color); padding-bottom:1rem;">
            <div>
              <span class="compensar-badge" style="font-size:0.75rem;">compensar escolar</span>
              <h2 style="font-size:1.45rem; color:var(--brand-navy); margin-top:0.4rem;">Ficha y Perfil del Estudiante</h2>
            </div>
            <button id="btn-close-student-profile" style="background:transparent; color:var(--text-muted); font-size:1.2rem; cursor:pointer;">${ICONS.close}</button>
          </div>

          <!-- Tarjeta de Identificación / Carnet Digital -->
          <div style="background:linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%); color:#FFFFFF; border-radius:var(--radius-lg); padding:1.5rem; margin-bottom:1.5rem; position:relative; overflow:hidden;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <span style="font-size:0.75rem; letter-spacing:0.05em; text-transform:uppercase; color:#93C5FD; font-weight:700;">Comedor Inteligente · Carnet Estudiantil</span>
              <span class="badge-status ${st.estado === 'Activo' ? 'badge-yes' : 'badge-no'}">${st.estado}</span>
            </div>

            <div style="display:flex; align-items:center; gap:1.25rem;">
              <div class="avatar" style="width:68px; height:68px; font-size:1.8rem; background:rgba(255,255,255,0.2); color:#FFFFFF; border:2px solid rgba(255,255,255,0.4);">
                ${st.nombre.charAt(0)}
              </div>
              <div style="flex:1;">
                <div style="font-size:1.35rem; font-weight:800;">${st.nombre}</div>
                <div style="font-size:0.9rem; color:#BFDBFE; margin-top:0.2rem;">Doc: <strong>${st.documento}</strong></div>
                <div style="font-size:0.9rem; color:#E0E7FF;">Curso: <strong>${st.curso}</strong></div>
              </div>
            </div>
          </div>

          <!-- Información Nutricional y Asistencia -->
          <div style="background:var(--bg-page); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:1.5rem;">
            <h4 style="font-size:0.95rem; color:var(--brand-navy); margin-bottom:0.75rem;">📋 Registro del Comedor (Hoy)</h4>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; font-size:0.85rem;">
              <div>
                <span style="color:var(--text-muted); display:block;">Asistencia / Llegada:</span>
                <strong style="color:${st.asisteHoy ? 'var(--success)' : 'var(--danger)'};">
                  ${st.asisteHoy ? `Presente (${st.horaLlegada || 'Registrada'})` : 'No ha ingresado'}
                </strong>
              </div>
              <div>
                <span style="color:var(--text-muted); display:block;">Restricción dietaria:</span>
                <strong>${st.observaciones || 'Menú regular'}</strong>
              </div>
              <div>
                <span style="color:var(--text-muted); display:block;">Desayuno (6am-12m):</span>
                <strong style="color:${st.recibioDesayuno ? 'var(--success)' : 'var(--warning-text)'};">
                  ${st.recibioDesayuno ? `Servido (${st.horaEntregaDesayuno || 'Completado'})` : (st.desayunoConfirmado ? 'Confirmado (Pendiente)' : 'No confirmado')}
                </strong>
              </div>
              <div>
                <span style="color:var(--text-muted); display:block;">Almuerzo (12m-2pm):</span>
                <strong style="color:${st.recibioAlmuerzo ? 'var(--success)' : 'var(--warning-text)'};">
                  ${st.recibioAlmuerzo ? `Servido (${st.horaEntregaAlmuerzo || 'Completado'})` : (st.almuerzoConfirmado ? 'Confirmado (Pendiente)' : 'No confirmado')}
                </strong>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
            <button type="button" id="btn-back-to-scanner" class="btn-primary" style="padding:0.65rem 1.25rem;">
              Volver al registro
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Modal Editar Estudiante (Superadmin)
  if (state.editingStudent) {
    const s = state.editingStudent;
    modalsHtml += `
      <div class="modal-overlay" id="edit-student-modal-overlay">
        <div class="modal-card" style="max-width:520px; text-align:left;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h2 style="font-size:1.4rem; color:var(--brand-navy); margin:0;">Editar estudiante</h2>
            <button id="btn-close-edit-student" style="background:transparent; color:var(--text-muted);">${ICONS.close}</button>
          </div>

          <form id="form-edit-student">
            <div class="form-group">
              <label>Nombre completo</label>
              <input type="text" id="edit-student-name" required value="${s.nombre}" style="width:100%; padding:0.65rem 0.85rem; border:1.5px solid var(--border-color); border-radius:var(--radius-md);">
            </div>

            <div class="form-group">
              <label>Documento de identidad</label>
              <input type="text" id="edit-student-doc" required value="${s.documento}" style="width:100%; padding:0.65rem 0.85rem; border:1.5px solid var(--border-color); border-radius:var(--radius-md);">
            </div>

            <div class="form-group">
              <label>Curso</label>
              <select id="edit-student-course" required style="width:100%; padding:0.65rem 0.85rem; border:1.5px solid var(--border-color); border-radius:var(--radius-md); background:#fff;">
                ${INITIAL_COURSES.map(c => `<option value="${c}" ${s.curso === c ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label>Estado de matrícula</label>
              <select id="edit-student-status" required style="width:100%; padding:0.65rem 0.85rem; border:1.5px solid var(--border-color); border-radius:var(--radius-md); background:#fff;">
                <option value="Activo" ${s.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                <option value="Inactivo" ${s.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
              </select>
            </div>

            <div class="form-group">
              <label>Observaciones de dieta / Alergias</label>
              <input type="text" id="edit-student-obs" value="${s.observaciones || ''}" style="width:100%; padding:0.65rem 0.85rem; border:1.5px solid var(--border-color); border-radius:var(--radius-md);">
            </div>

            <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem;">
              <button type="button" id="btn-cancel-edit-student" class="btn-secondary">Cancelar</button>
              <button type="submit" class="btn-primary">Actualizar datos</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  return modalsHtml;
}

// =========================================================
// GESTOR DE EVENTOS GLOBALES DE LA APLICACIÓN
// =========================================================
function attachGlobalEvents() {
  // Navegación Sidebar
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = e.currentTarget.getAttribute('data-view');
      if (view) {
        state.activeView = view;
        renderApp();
      }
    });
  });

  // Acciones rápidas de pantalla de inicio
  document.querySelectorAll('.action-card').forEach(card => {
    card.addEventListener('click', () => {
      const targetView = card.getAttribute('data-action-view');
      const meal = card.getAttribute('data-meal');
      if (meal) state.activeMealFilter = meal;
      if (targetView) {
        state.activeView = targetView;
        renderApp();
      }
    });
  });

  // Selector rápido de rol para evaluación
  const roleSelect = document.getElementById('role-quick-switch');
  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      const chosenRol = e.target.value;
      const targetUser = state.users.find(u => u.rol === chosenRol) || state.users[0];
      state.setAuthUser(targetUser);
      showToast(`Cambiado a rol: ${targetUser.rol.toUpperCase()} (${targetUser.nombre})`, 'success');
      renderApp();
    });
  }

  // Notificaciones
  const notifBtn = document.getElementById('btn-notif');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      showToast('🔔 Notificaciones al día: Todas las confirmaciones y raciones están sincronizadas.', 'info');
    });
  }

  // Logout
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      state.setAuthUser(null);
      showToast('Sesión cerrada con éxito', 'info');
      renderApp();
    });
  }

  // Abrir Modal Vista Móvil (Mockup 9)
  const openMobileBtn = document.getElementById('btn-open-mobile-sim');
  if (openMobileBtn) {
    openMobileBtn.addEventListener('click', () => {
      state.mobileModalOpen = true;
      renderApp();
    });
  }

  const closeMobileBtn = document.getElementById('btn-close-mobile-sim');
  if (closeMobileBtn) {
    closeMobileBtn.addEventListener('click', () => {
      state.mobileModalOpen = false;
      renderApp();
    });
  }

  // Pestañas Desayuno / Almuerzo en Registro Diario
  const tabDesayuno = document.getElementById('tab-meal-desayuno');
  const tabAlmuerzo = document.getElementById('tab-meal-almuerzo');
  if (tabDesayuno) {
    tabDesayuno.addEventListener('click', () => {
      state.activeMealFilter = 'desayuno';
      renderApp();
    });
  }
  if (tabAlmuerzo) {
    tabAlmuerzo.addEventListener('click', () => {
      state.activeMealFilter = 'almuerzo';
      renderApp();
    });
  }

  // Filtros de búsqueda en Base de Datos de Estudiantes
  const searchInput = document.getElementById('students-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchTerm = e.target.value;
      renderApp();
      // Restaurar foco al input
      const el = document.getElementById('students-search-input');
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    });
  }

  const courseSelect = document.getElementById('course-filter-select');
  if (courseSelect) {
    courseSelect.addEventListener('change', (e) => {
      state.courseFilter = e.target.value;
      renderApp();
    });
  }

  // Filtro en Registro Diario
  const dailySearch = document.getElementById('daily-search-input');
  if (dailySearch) {
    dailySearch.addEventListener('input', (e) => {
      state.searchTerm = e.target.value;
      renderApp();
      const el = document.getElementById('daily-search-input');
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    });
  }

  const dailyCourse = document.getElementById('daily-course-filter');
  if (dailyCourse) {
    dailyCourse.addEventListener('change', (e) => {
      state.courseFilter = e.target.value;
      renderApp();
    });
  }

  // Toggle de Llegada / Asistencia en el Comedor (Mockup 5)
  document.querySelectorAll('.toggle-attendance').forEach(toggle => {
    toggle.addEventListener('change', async (e) => {
      const id = e.target.getAttribute('data-id');
      const student = state.students.find(s => s.id === id);
      if (student) {
        student.asisteHoy = e.target.checked;
        if (student.asisteHoy) {
          student.horaLlegada = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
          showToast(`Llegada registrada: ${student.nombre}`, 'success');
          await blockchain.addBlock(
            'LLEGADA_COMEDOR',
            student,
            `Estudiante marcó llegada al comedor a las ${student.horaLlegada}`,
            state.currentUser.nombre
          );
        } else {
          student.horaLlegada = null;
          showToast(`Llegada removida: ${student.nombre}`, 'warning');
        }
        state.saveStudents();
        renderApp();
      }
    });
  });

  // Toggle de Entrega Real de Alimento (Mockup 5 & Slide 5)
  document.querySelectorAll('.toggle-food-delivery').forEach(toggle => {
    toggle.addEventListener('change', async (e) => {
      const id = e.target.getAttribute('data-id');
      const student = state.students.find(s => s.id === id);
      const isBreakfast = state.activeMealFilter === 'desayuno';

      if (student) {
        const checked = e.target.checked;
        const nowTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });

        if (isBreakfast) {
          student.recibioDesayuno = checked;
          student.horaEntregaDesayuno = checked ? nowTime : null;
        } else {
          student.recibioAlmuerzo = checked;
          student.horaEntregaAlmuerzo = checked ? nowTime : null;
        }

        if (checked) {
          // Si recibe plato, automáticamente se garantiza que asistió al comedor
          student.asisteHoy = true;
          if (!student.horaLlegada) student.horaLlegada = nowTime;

          showToast(`Plato de ${isBreakfast ? 'Desayuno' : 'Almuerzo'} entregado a ${student.nombre}`, 'success');
          await blockchain.addBlock(
            'ENTREGA_PLATO',
            student,
            `Entrega de plato de ${isBreakfast ? 'Desayuno' : 'Almuerzo'} confirmada a las ${nowTime}`,
            state.currentUser.nombre
          );
        } else {
          showToast(`Registro de plato desmarcado para ${student.nombre}`, 'warning');
        }

        state.saveStudents();
        renderApp();
      }
    });
  });

  // Confirmación de comida por el Estudiante (Mockup 7 -> Mockup 8)
  const btnConfBreakfast = document.getElementById('btn-student-confirm-breakfast');
  if (btnConfBreakfast) {
    btnConfBreakfast.addEventListener('click', async () => {
      const student = state.students.find(s => s.documento === state.currentUser.usuario || s.id === state.currentUser.id);
      if (student) {
        student.desayunoConfirmado = true;
        state.saveStudents();
        await blockchain.addBlock(
          'CONFIRMACION_DESAYUNO',
          student,
          'Estudiante confirmó asistencia a desayuno para hoy',
          student.nombre
        );
      }
      state.lastConfirmedMeal = 'Desayuno';
      state.activeView = 'student_confirmation';
      renderApp();
    });
  }

  const btnConfLunch = document.getElementById('btn-student-confirm-lunch');
  if (btnConfLunch) {
    btnConfLunch.addEventListener('click', async () => {
      const student = state.students.find(s => s.documento === state.currentUser.usuario || s.id === state.currentUser.id);
      if (student) {
        student.almuerzoConfirmado = true;
        state.saveStudents();
        await blockchain.addBlock(
          'CONFIRMACION_ALMUERZO',
          student,
          'Estudiante confirmó asistencia a almuerzo para hoy',
          student.nombre
        );
      }
      state.lastConfirmedMeal = 'Almuerzo';
      state.activeView = 'student_confirmation';
      renderApp();
    });
  }

  // Modal Nuevo Estudiante (Superadmin)
  const btnNewStudent = document.getElementById('btn-new-student');
  if (btnNewStudent) {
    btnNewStudent.addEventListener('click', () => {
      state.newStudentModalOpen = true;
      renderApp();
    });
  }

  const btnCloseNewStudent = document.getElementById('btn-close-new-student');
  const btnCancelNewStudent = document.getElementById('btn-cancel-new-student');
  if (btnCloseNewStudent) {
    btnCloseNewStudent.addEventListener('click', () => {
      state.newStudentModalOpen = false;
      renderApp();
    });
  }
  if (btnCancelNewStudent) {
    btnCancelNewStudent.addEventListener('click', () => {
      state.newStudentModalOpen = false;
      renderApp();
    });
  }

  const formCreateStudent = document.getElementById('form-create-student');
  if (formCreateStudent) {
    formCreateStudent.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = document.getElementById('modal-student-name').value.trim();
      const doc = document.getElementById('modal-student-doc').value.trim();
      const curso = document.getElementById('modal-student-course').value;
      const obs = document.getElementById('modal-student-obs').value.trim() || 'Menú regular';

      const nextId = String(state.students.length + 1).padStart(3, '0');
      const newSt = {
        id: nextId,
        nombre,
        documento: doc,
        curso,
        email: `${nombre.toLowerCase().replace(/\s+/g, '.')}@colegio.edu.co`,
        estado: 'Activo',
        desayunoConfirmado: true,
        almuerzoConfirmado: false,
        asisteHoy: false,
        recibioDesayuno: false,
        recibioAlmuerzo: false,
        horaLlegada: null,
        horaEntregaDesayuno: null,
        horaEntregaAlmuerzo: null,
        observaciones: obs
      };

      state.students.push(newSt);
      state.saveStudents();

      await blockchain.addBlock(
        'ALTA_ESTUDIANTE_ADMIN',
        newSt,
        `Estudiante incorporado por Superadmin al grado ${curso}`,
        state.currentUser.nombre
      );

      state.newStudentModalOpen = false;
      showToast(`Estudiante ${nombre} registrado exitosamente`, 'success');
      renderApp();
    });
  }

  // Editar estudiante (Superadmin)
  document.querySelectorAll('.btn-edit-student').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const student = state.students.find(s => s.id === id);
      if (student) {
        state.editingStudent = { ...student };
        renderApp();
      }
    });
  });

  const btnCloseEdit = document.getElementById('btn-close-edit-student');
  const btnCancelEdit = document.getElementById('btn-cancel-edit-student');
  if (btnCloseEdit) btnCloseEdit.addEventListener('click', () => { state.editingStudent = null; renderApp(); });
  if (btnCancelEdit) btnCancelEdit.addEventListener('click', () => { state.editingStudent = null; renderApp(); });

  const formEdit = document.getElementById('form-edit-student');
  if (formEdit) {
    formEdit.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = state.editingStudent.id;
      const target = state.students.find(s => s.id === id);
      if (target) {
        target.nombre = document.getElementById('edit-student-name').value.trim();
        target.documento = document.getElementById('edit-student-doc').value.trim();
        target.curso = document.getElementById('edit-student-course').value;
        target.estado = document.getElementById('edit-student-status').value;
        target.observaciones = document.getElementById('edit-student-obs').value.trim();
        state.saveStudents();

        await blockchain.addBlock(
          'ACTUALIZACION_ESTUDIANTE',
          target,
          `Superadmin actualizó datos de matrícula para ${target.nombre}`,
          state.currentUser.nombre
        );

        state.editingStudent = null;
        showToast('Datos del estudiante actualizados correctamente', 'success');
        renderApp();
      }
    });
  }

  // Eliminar estudiante (Superadmin)
  document.querySelectorAll('.btn-delete-student').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const student = state.students.find(s => s.id === id);
      if (student && confirm(`¿Estás seguro de eliminar a ${student.nombre}?`)) {
        state.students = state.students.filter(s => s.id !== id);
        state.saveStudents();
        await blockchain.addBlock(
          'BAJA_ESTUDIANTE',
          student,
          `Estudiante dado de baja de la base de datos institucional`,
          state.currentUser.nombre
        );
        showToast('Estudiante eliminado', 'info');
        renderApp();
      }
    });
  });

  // Modal Escáner QR y Registro por Documento
  const openScannerModal = () => {
    state.qrScannerModalOpen = true;
    state.scannerSearchResult = null;
    state.scannerDocInput = '';
    renderApp();
  };

  const btnQuickQr = document.getElementById('btn-quick-qr');
  if (btnQuickQr) btnQuickQr.addEventListener('click', openScannerModal);

  const btnNavScanner = document.getElementById('btn-navbar-scanner');
  if (btnNavScanner) btnNavScanner.addEventListener('click', openScannerModal);

  const btnCloseQr = document.getElementById('btn-close-qr');
  if (btnCloseQr) {
    btnCloseQr.addEventListener('click', () => {
      state.qrScannerModalOpen = false;
      state.scannerSearchResult = null;
      renderApp();
    });
  }

  // Cambio de pestañas dentro del Escáner (Documento vs QR)
  const tabScannerDoc = document.getElementById('tab-scanner-doc-mode');
  const tabScannerQr = document.getElementById('tab-scanner-qr-mode');
  if (tabScannerDoc) {
    tabScannerDoc.addEventListener('click', () => {
      state.scannerActiveTab = 'doc';
      renderApp();
    });
  }
  if (tabScannerQr) {
    tabScannerQr.addEventListener('click', () => {
      state.scannerActiveTab = 'qr';
      renderApp();
    });
  }

  // Búsqueda y Registro por Número de Identidad (Sin Carnet)
  const executeDocSearch = async () => {
    const inputEl = document.getElementById('scanner-doc-input');
    const val = inputEl ? inputEl.value.trim() : '';

    if (!val) {
      showToast('Por favor digita un número de documento de identidad.', 'warning');
      return;
    }

    state.scannerDocInput = val;
    const student = state.students.find(s => 
      s.documento.trim() === val || 
      s.id.trim() === val || 
      s.documento.includes(val)
    );

    if (student) {
      const alreadyArrived = student.asisteHoy;
      const nowTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });

      // Registra llegada inmediata del estudiante
      student.asisteHoy = true;
      if (!student.horaLlegada) student.horaLlegada = nowTime;
      state.saveStudents();

      // Registro en Blockchain con hash SHA-256
      await blockchain.addBlock(
        'LLEGADA_DOCUMENTO_MANUAL',
        student,
        `Ingreso registrado por número de identidad ${student.documento} (estudiante sin carnet)`,
        state.currentUser.nombre
      );

      state.scannerSearchResult = {
        found: true,
        alreadyArrived,
        student
      };

      showToast(`✅ Llegada registrada con éxito para ${student.nombre}`, 'success');
      renderApp();
    } else {
      state.scannerSearchResult = {
        found: false,
        query: val
      };
      showToast(`No se encontró ningún estudiante con el documento ${val}`, 'danger');
      renderApp();
    }
  };

  const btnSubmitDoc = document.getElementById('btn-submit-scanner-doc');
  if (btnSubmitDoc) btnSubmitDoc.addEventListener('click', executeDocSearch);

  const inputScannerDoc = document.getElementById('scanner-doc-input');
  if (inputScannerDoc) {
    inputScannerDoc.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeDocSearch();
      }
    });
  }

  // Botón "Ver Perfil / Ficha" desde el resultado del escáner
  document.querySelectorAll('.btn-view-profile-from-scanner').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const student = state.students.find(s => s.id === id);
      if (student) {
        state.studentProfileModal = student;
        state.qrScannerModalOpen = false;
        renderApp();
      }
    });
  });

  // Botón "Entregar ración ahora" desde el resultado del escáner
  document.querySelectorAll('.btn-quick-deliver-from-scanner').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const student = state.students.find(s => s.id === id);
      const isBreakfast = state.activeMealFilter === 'desayuno';

      if (student) {
        const nowTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
        if (isBreakfast) {
          student.recibioDesayuno = true;
          student.horaEntregaDesayuno = nowTime;
        } else {
          student.recibioAlmuerzo = true;
          student.horaEntregaAlmuerzo = nowTime;
        }
        state.saveStudents();

        await blockchain.addBlock(
          'ENTREGA_PLATO_DOC',
          student,
          `Entrega de plato de ${isBreakfast ? 'Desayuno' : 'Almuerzo'} confirmada a las ${nowTime}`,
          state.currentUser.nombre
        );

        showToast(`🍲 Plato de ${isBreakfast ? 'Desayuno' : 'Almuerzo'} entregado a ${student.nombre}`, 'success');
        renderApp();
      }
    });
  });

  // Botón reiniciar búsqueda en escáner
  const btnResetSearch = document.getElementById('btn-reset-scanner-search');
  if (btnResetSearch) {
    btnResetSearch.addEventListener('click', () => {
      state.scannerSearchResult = null;
      state.scannerDocInput = '';
      renderApp();
      const inp = document.getElementById('scanner-doc-input');
      if (inp) inp.focus();
    });
  }

  const btnRetryDoc = document.getElementById('btn-retry-scanner-doc');
  if (btnRetryDoc) {
    btnRetryDoc.addEventListener('click', () => {
      state.scannerSearchResult = null;
      renderApp();
      const inp = document.getElementById('scanner-doc-input');
      if (inp) {
        inp.focus();
        inp.select();
      }
    });
  }

  // Botón registrar estudiante no encontrado directamente desde el escáner
  const btnCreateFromScanner = document.getElementById('btn-open-create-from-scanner');
  if (btnCreateFromScanner) {
    btnCreateFromScanner.addEventListener('click', () => {
      const doc = state.scannerSearchResult?.query || '';
      state.qrScannerModalOpen = false;
      state.newStudentModalOpen = true;
      renderApp();
      const docInput = document.getElementById('modal-student-doc');
      if (docInput) docInput.value = doc;
    });
  }

  // Cerrar y volver desde el perfil del estudiante
  const btnCloseProfile = document.getElementById('btn-close-student-profile');
  const btnBackScanner = document.getElementById('btn-back-to-scanner');
  if (btnCloseProfile) {
    btnCloseProfile.addEventListener('click', () => {
      state.studentProfileModal = null;
      renderApp();
    });
  }
  if (btnBackScanner) {
    btnBackScanner.addEventListener('click', () => {
      state.studentProfileModal = null;
      state.qrScannerModalOpen = true;
      renderApp();
    });
  }

  // Escaneo Simulado con credencial QR
  const btnSimulateScan = document.getElementById('btn-simulate-scan-pass');
  if (btnSimulateScan) {
    btnSimulateScan.addEventListener('click', async () => {
      const select = document.getElementById('select-scanner-student');
      const id = select.value;
      const student = state.students.find(s => s.id === id);
      const isBreakfast = state.activeMealFilter === 'desayuno';

      if (student) {
        const nowTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
        student.asisteHoy = true;
        student.horaLlegada = nowTime;
        if (isBreakfast) {
          student.recibioDesayuno = true;
          student.horaEntregaDesayuno = nowTime;
        } else {
          student.recibioAlmuerzo = true;
          student.horaEntregaAlmuerzo = nowTime;
        }
        state.saveStudents();

        await blockchain.addBlock(
          'ENTREGA_PLATO_QR',
          student,
          `Escaneo de credencial QR verificado: entrega de ${isBreakfast ? 'Desayuno' : 'Almuerzo'} efectuada`,
          'Lector Óptico Comedor'
        );

        state.qrScannerModalOpen = false;
        showToast(`⚡ Credencial validada: ¡Plato entregado a ${student.nombre}!`, 'success');
        renderApp();
      }
    });
  }

  // Exportar Excel / CSV
  const btnExport = document.getElementById('btn-export-students');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const csvRows = [
        ['ID', 'Nombre', 'Documento', 'Curso', 'Asiste Hoy', 'Recibio Desayuno', 'Recibio Almuerzo', 'Estado', 'Observaciones']
      ];
      state.students.forEach(s => {
        csvRows.push([
          s.id,
          `"${s.nombre}"`,
          s.documento,
          `"${s.curso}"`,
          s.asisteHoy ? 'SI' : 'NO',
          s.recibioDesayuno ? 'SI' : 'NO',
          s.recibioAlmuerzo ? 'SI' : 'NO',
          s.estado,
          `"${s.observaciones}"`
        ]);
      });
      const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `comedor_inteligente_estudiantes_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Descargando base de datos de estudiantes en CSV...', 'success');
    });
  }

  // Generar Reporte Oficial
  const btnGenReport = document.getElementById('btn-generate-report');
  if (btnGenReport) {
    btnGenReport.addEventListener('click', () => {
      showToast('Generando informe consolidado de raciones y desperdicio...', 'info');
      setTimeout(() => {
        window.print();
      }, 500);
    });
  }

  // Botón Verificar Blockchain
  const btnVerifyBc = document.getElementById('btn-verify-blockchain');
  if (btnVerifyBc) {
    btnVerifyBc.addEventListener('click', async () => {
      const result = await blockchain.verifyChainIntegrity();
      if (result.valid) {
        showToast(`✅ ${result.message} (${result.totalBlocks} bloques validados)`, 'success');
      } else {
        showToast(`❌ Alerta de corrupción en bloque #${result.corruptedIndex}: ${result.reason}`, 'danger');
      }
    });
  }
}

// Inicialización de la aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
