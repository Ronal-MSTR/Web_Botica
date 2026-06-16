import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Buscamos el token en la memoria del navegador (donde el Login lo guardó)
  const token = localStorage.getItem('token');

  // 2. Si existe un token, clonamos la petición original y le inyectamos la cabecera de seguridad
  if (token) {
    const peticionClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // Enviamos la petición modificada a Java
    return next(peticionClonada);
  }

  // Si no hay token (ej. está en la pantalla de login), la enviamos normal
  return next(req);
};