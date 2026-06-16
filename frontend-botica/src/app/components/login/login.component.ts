import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  hacerLogin() {
    if (!this.email.trim() || !this.password.trim()) {
      this.mensajeError = 'Por favor, ingresa tu correo y contraseña.';
      return;
    }

    this.mensajeError = '';
    this.cargando = true;

    const credenciales = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>('http://localhost:8080/api/auth/login', credenciales).subscribe({
      next: (response) => {
        this.cargando = false;
        
        // 1. Guardamos el Token y los datos en el navegador (Local Storage)
        localStorage.setItem('token', response.token);
        localStorage.setItem('usuario_nombre', response.usuario);
        localStorage.setItem('usuario_rol', response.rol);

        localStorage.setItem('usuario_id', response.usuarioId);

        // 2. Redirección Inteligente (Alternativa A)
        if (response.rol === 'ADMIN') {
          // El Admin va al Dashboard (o al catálogo si aún no hacemos el dashboard)
          this.router.navigate(['/dashboard']);
        } else {
          // El Vendedor va directo a la Caja/Punto de Venta
          this.router.navigate(['/caja']);
        }
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 401 || err.status === 403) {
          this.mensajeError = 'Correo o contraseña incorrectos.';
        } else {
          this.mensajeError = err.error && typeof err.error === 'string' ? err.error : 'Error al conectar con el servidor.';
        }
      }
    });
  }
}
