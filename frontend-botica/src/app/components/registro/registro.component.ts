import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // <--- Importaciones necesarias

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.component.html'
})
export class RegistroComponent implements OnInit {
  // Estructura limpia del usuario
  usuario = {
    nombre_completo: '',
    email: '',
    password_hash: '',
    rol: { rol_id: 2 } // Vendedor por defecto
  };

  esEdicion: boolean = false; // Variable para saber si estamos registrando o editando
  usuarioId!: number;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute, // Para leer el ID de la URL
    private router: Router          // Para redireccionar páginas
  ) {}

  ngOnInit(): void {
    // Revisamos si en la URL viene el parámetro 'id'
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.esEdicion = true;
      this.usuarioId = +idParam; // El "+" convierte el texto de la URL a número
      this.cargarUsuario(this.usuarioId);
    }
  }

  // Si es edición, buscamos los datos actuales del usuario para llenar el formulario
  cargarUsuario(id: number) {
    // Usamos el endpoint de listar para buscar al usuario específico (luego podemos optimizar esto)
    this.http.get<any[]>('https://web-botica.onrender.com/api/usuarios/listar').subscribe(usuarios => {
      const userFound = usuarios.find(u => u.usuario_id === id);
      if (userFound) {
        this.usuario.nombre_completo = userFound.nombre_completo;
        this.usuario.email = userFound.email;
        this.usuario.rol.rol_id = userFound.rol.rol_id;
        // La contraseña la dejamos en blanco por seguridad
      }
    });
  }

  // Esta función ahora decidirá si guarda uno nuevo o actualiza el existente
  registrar() {
    if (this.esEdicion) {
      // Si estamos editando, enviamos los datos al endpoint @PutMapping de Java
      this.http.put(`https://web-botica.onrender.com/api/usuarios/actualizar/${this.usuarioId}`, this.usuario)
        .subscribe(() => {
          alert('¡Usuario actualizado con éxito!');
          this.router.navigate(['/usuarios']); // Nos regresa automáticamente a la tabla
        });
    } else {
      // Si no es edición, se comporta exactamente como antes (Crea un nuevo registro)
      this.http.post('https://web-botica.onrender.com/api/usuarios/registro', this.usuario)
        .subscribe(() => {
          alert('¡Usuario registrado con éxito!');
          this.router.navigate(['/usuarios']);
        });
    }
  }
}
