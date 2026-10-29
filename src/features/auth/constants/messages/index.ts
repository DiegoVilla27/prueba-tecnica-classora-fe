/** Microcopy of the login, literal from the Figma frame (docs/03-ux-ui.md §6). */
export const LOGIN_COPY = {
  brandOverline: 'Puesto de caja',
  brandHeadline: 'Todo listo. Vamos con la siguiente venta.',
  brandDescription: 'Tu venta abierta te espera al volver a iniciar sesión.',
  brandFooter: 'Una herramienta para el ritmo de tu caja.',
  title: 'Entra en tu caja',
  subtitle: 'Introduce tus credenciales de cajero.',
  emailLabel: 'Email',
  emailPlaceholder: 'nombre@supermercado.es',
  passwordLabel: 'Contraseña',
  passwordPlaceholder: 'Tu contraseña',
  submit: 'Entrar en la caja',
  submitting: 'Entrando…',
  footnote: 'Acceso exclusivo para personal de caja',
} as const;

/** Validation and error messages of the login (docs/03-ux-ui.md §6). */
export const AUTH_MESSAGES = {
  emailRequired: 'Introduce tu email.',
  emailInvalid: 'Introduce un email válido.',
  passwordRequired: 'Introduce tu contraseña.',
  invalidCredentials: 'Email o contraseña incorrectos.',
  sessionExpired: 'Tu sesión ha caducado. Vuelve a entrar.',
  tooManyAttempts: 'Demasiados intentos. Espera un minuto y vuelve a probar.',
  serverUnavailable:
    'No se pudo conectar con el servidor. Puede tardar hasta un minuto en arrancar: vuelve a intentarlo.',
  unexpected: 'No se pudo iniciar sesión. Vuelve a intentarlo.',
} as const;
