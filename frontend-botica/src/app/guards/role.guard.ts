import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // 1. Miramos qué rol tiene el usuario guardado en su navegador
  const rolUsuario = localStorage.getItem('usuario_rol'); 

  // 2. Miramos qué rol exige la ruta a la que intenta entrar
 const rolesPermitidos = route.data['rolesPermitidos'] as Array<string>;

  // 3. Comparamos
 // Comparamos si el rol del usuario está dentro de la lista permitida
  if (rolUsuario && rolesPermitidos && rolesPermitidos.includes(rolUsuario)) {
    return true; // ¡Pase libre!
  } else {
    // Redirecciones si está bloqueado
    if (rolUsuario === 'ADMIN') {
      router.navigate(['/dashboard']);
    } else if (rolUsuario === 'VENDEDOR') {
      router.navigate(['/caja']);
    } else {
      router.navigate(['/login']); 
    }
    return false; // ¡Bloqueado!
  }
};