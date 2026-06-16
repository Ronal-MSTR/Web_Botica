import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuarios';
  private userSubject = new BehaviorSubject<Usuario | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const savedUser = localStorage.getItem('botica_user');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<Usuario[]> {
    // Simularemos el login buscando en la lista de usuarios por ahora, 
    // ya que el backend no tiene un endpoint de login específico con JWT aún.
    return this.http.get<Usuario[]>(`${this.apiUrl}/listar`).pipe(
      tap(usuarios => {
        const user = usuarios.find(u => u.email === email && u.activo);
        if (user) {
          // En una app real, aquí validaríamos la contraseña contra el hash
          this.userSubject.next(user);
          localStorage.setItem('botica_user', JSON.stringify(user));
        } else {
          throw new Error('Usuario no encontrado o inactivo');
        }
      })
    );
  }

  register(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/registro`, usuario);
  }

  logout() {
    localStorage.removeItem('botica_user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  getUser() {
    return this.userSubject.value;
  }
}