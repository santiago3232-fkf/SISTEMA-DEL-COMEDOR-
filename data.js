// Base de datos inicial y almacenamiento persistente en LocalStorage para "Comedor Inteligente"

export const INITIAL_COURSES = [
  'Transición',
  '1° Primaria',
  '2° Primaria',
  '3° Primaria',
  '4° Primaria',
  '5° Primaria',
  '6° Bachillerato',
  '7° Bachillerato',
  '8° Bachillerato',
  '9° Bachillerato',
  '10° Bachillerato',
  '11° Bachillerato'
];

export const INITIAL_STUDENTS = [
  {
    id: '001',
    nombre: 'Santiago Gutiérrez',
    documento: '1023456789',
    curso: '10° Bachillerato',
    email: 'santiago.gutierrez@colegio.edu.co',
    estado: 'Activo',
    desayunoConfirmado: true,
    almuerzoConfirmado: false,
    asisteHoy: true,
    recibioDesayuno: true,
    recibioAlmuerzo: false,
    horaLlegada: '07:45 a.m.',
    horaEntregaDesayuno: '07:55 a.m.',
    horaEntregaAlmuerzo: null,
    observaciones: 'Menú regular - Sin restricciones'
  },
  {
    id: '002',
    nombre: 'María López',
    documento: '1034567890',
    curso: '7° Bachillerato',
    email: 'maria.lopez@colegio.edu.co',
    estado: 'Activo',
    desayunoConfirmado: true,
    almuerzoConfirmado: true,
    asisteHoy: true,
    recibioDesayuno: true,
    recibioAlmuerzo: false,
    horaLlegada: '07:30 a.m.',
    horaEntregaDesayuno: '07:40 a.m.',
    horaEntregaAlmuerzo: null,
    observaciones: 'Vegetariana'
  },
  {
    id: '003',
    nombre: 'Carlos Rodríguez',
    documento: '1045678901',
    curso: '8° Bachillerato',
    email: 'carlos.rodriguez@colegio.edu.co',
    estado: 'Activo',
    desayunoConfirmado: false,
    almuerzoConfirmado: true,
    asisteHoy: false,
    recibioDesayuno: false,
    recibioAlmuerzo: false,
    horaLlegada: null,
    horaEntregaDesayuno: null,
    horaEntregaAlmuerzo: null,
    observaciones: 'Alergia a mariscos'
  },
  {
    id: '004',
    nombre: 'Valentina Gómez',
    documento: '1056789012',
    curso: '9° Bachillerato',
    email: 'valentina.gomez@colegio.edu.co',
    estado: 'Activo',
    desayunoConfirmado: true,
    almuerzoConfirmado: true,
    asisteHoy: true,
    recibioDesayuno: true,
    recibioAlmuerzo: true,
    horaLlegada: '07:15 a.m.',
    horaEntregaDesayuno: '07:25 a.m.',
    horaEntregaAlmuerzo: '12:30 p.m.',
    observaciones: 'Intolerante a la lactosa'
  },
  {
    id: '005',
    nombre: 'Daniel Martínez',
    documento: '1067890123',
    curso: '10° Bachillerato',
    email: 'daniel.martinez@colegio.edu.co',
    estado: 'Activo',
    desayunoConfirmado: true,
    almuerzoConfirmado: true,
    asisteHoy: true,
    recibioDesayuno: true,
    recibioAlmuerzo: false,
    horaLlegada: '08:00 a.m.',
    horaEntregaDesayuno: '08:10 a.m.',
    horaEntregaAlmuerzo: null,
    observaciones: 'Menú regular'
  },
  {
    id: '006',
    nombre: 'Laura Sánchez',
    documento: '1078901234',
    curso: '11° Bachillerato',
    email: 'laura.sanchez@colegio.edu.co',
    estado: 'Activo',
    desayunoConfirmado: false,
    almuerzoConfirmado: false,
    asisteHoy: false,
    recibioDesayuno: false,
    recibioAlmuerzo: false,
    horaLlegada: null,
    horaEntregaDesayuno: null,
    horaEntregaAlmuerzo: null,
    observaciones: 'Sin novedades'
  },
  {
    id: '007',
    nombre: 'Daniel Páez',
    documento: '1089012345',
    curso: '10° Bachillerato',
    email: 'daniel.paez@colegio.edu.co',
    estado: 'Activo',
    desayunoConfirmado: true,
    almuerzoConfirmado: true,
    asisteHoy: true,
    recibioDesayuno: true,
    recibioAlmuerzo: true,
    horaLlegada: '07:20 a.m.',
    horaEntregaDesayuno: '07:35 a.m.',
    horaEntregaAlmuerzo: '12:45 p.m.',
    observaciones: 'Menú regular'
  },
  {
    id: '008',
    nombre: 'Evelyn Gutiérrez',
    documento: '1090123456',
    curso: '10° Bachillerato',
    email: 'evelyn.gutierrez@colegio.edu.co',
    estado: 'Activo',
    desayunoConfirmado: true,
    almuerzoConfirmado: true,
    asisteHoy: true,
    recibioDesayuno: true,
    recibioAlmuerzo: false,
    horaLlegada: '07:50 a.m.',
    horaEntregaDesayuno: '08:05 a.m.',
    horaEntregaAlmuerzo: null,
    observaciones: 'Menú regular'
  },
  {
    id: '009',
    nombre: 'Alison Páez',
    documento: '1011223344',
    curso: '10° Bachillerato',
    email: 'alison.paez@colegio.edu.co',
    estado: 'Activo',
    desayunoConfirmado: true,
    almuerzoConfirmado: false,
    asisteHoy: true,
    recibioDesayuno: true,
    recibioAlmuerzo: false,
    horaLlegada: '07:40 a.m.',
    horaEntregaDesayuno: '07:50 a.m.',
    horaEntregaAlmuerzo: null,
    observaciones: 'Menú regular'
  },
  {
    id: '010',
    nombre: 'Andrés Camargo',
    documento: '1022334455',
    curso: 'Transición',
    email: 'andres.camargo@colegio.edu.co',
    estado: 'Activo',
    desayunoConfirmado: true,
    almuerzoConfirmado: true,
    asisteHoy: true,
    recibioDesayuno: true,
    recibioAlmuerzo: true,
    horaLlegada: '07:10 a.m.',
    horaEntregaDesayuno: '07:30 a.m.',
    horaEntregaAlmuerzo: '12:15 p.m.',
    observaciones: 'Ración infantil supervisada'
  },
  {
    id: '011',
    nombre: 'Sofía Herrera',
    documento: '1033445566',
    curso: '3° Primaria',
    email: 'sofia.herrera@colegio.edu.co',
    estado: 'Activo',
    desayunoConfirmado: true,
    almuerzoConfirmado: true,
    asisteHoy: true,
    recibioDesayuno: true,
    recibioAlmuerzo: false,
    horaLlegada: '07:25 a.m.',
    horaEntregaDesayuno: '07:45 a.m.',
    horaEntregaAlmuerzo: null,
    observaciones: 'Sin maní ni nueces'
  },
  {
    id: '012',
    nombre: 'Mateo Morales',
    documento: '1044556677',
    curso: '5° Primaria',
    email: 'mateo.morales@colegio.edu.co',
    estado: 'Inactivo',
    desayunoConfirmado: false,
    almuerzoConfirmado: false,
    asisteHoy: false,
    recibioDesayuno: false,
    recibioAlmuerzo: false,
    horaLlegada: null,
    horaEntregaDesayuno: null,
    horaEntregaAlmuerzo: null,
    observaciones: 'Incapacidad médica'
  }
];

export const INITIAL_USERS = [
  {
    id: 'u1',
    usuario: 'superadmin',
    nombre: 'Superadministrador Compensar / Directivo',
    email: 'admin@comedorinteligente.edu.co',
    rol: 'superadmin', // Superadmin: control total, base de datos, trazabilidad blockchain, reportes globales
    password: 'admin'
  },
  {
    id: 'u2',
    usuario: 'profesor',
    nombre: 'Prof. Carlos Mendoza (Coordinador)',
    email: 'profesor@comedorinteligente.edu.co',
    rol: 'profesor', // Profesor/Coordinador: registro diario de llegadas y entrega de raciones
    password: 'profe'
  },
  {
    id: 'u3',
    usuario: '1023456789',
    nombre: 'Santiago Gutiérrez',
    email: 'santiago.gutierrez@colegio.edu.co',
    documento: '1023456789',
    curso: '10° Bachillerato',
    rol: 'estudiante', // Estudiante: solo ve su propio registro, confirma comida, acepta compromiso
    password: '123'
  },
  {
    id: 'u4',
    usuario: '1089012345',
    nombre: 'Daniel Páez',
    email: 'daniel.paez@colegio.edu.co',
    documento: '1089012345',
    curso: '10° Bachillerato',
    rol: 'estudiante',
    password: '123'
  }
];

export const MEAL_HOURS = {
  desayuno: {
    nombre: 'Desayuno',
    horario: '6:00 a.m. – 12:00 m.',
    icono: 'sun',
    color: '#F59E0B'
  },
  almuerzo: {
    nombre: 'Almuerzo',
    horario: '12:00 m. – 2:00 p.m.',
    icono: 'utensils',
    color: '#2563EB'
  }
};
