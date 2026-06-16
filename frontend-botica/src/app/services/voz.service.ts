import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Esto lo hace global para toda la aplicación
})
export class VozService {

  constructor() { }

  /**
   * Recibe un texto y lo reproduce usando la API nativa del navegador.
   * @param texto El mensaje que el sistema leerá en voz alta.
   */
  hablar(texto: string): void {
    // Validamos que el navegador soporte la Web Speech API
    if ('speechSynthesis' in window) {
      // Cancelamos cualquier audio que se esté reproduciendo en este momento
      window.speechSynthesis.cancel();

      // Preparamos el nuevo mensaje
      const mensaje = new SpeechSynthesisUtterance(texto);
      
      // Configuraciones de la voz
      mensaje.lang = 'es-ES'; // Español
      mensaje.rate = 1.0;     // Velocidad (1.0 es normal, 0.8 es más lento)
      mensaje.pitch = 1.0;    // Tono de la voz

      // Reproducimos el audio
      window.speechSynthesis.speak(mensaje);
    } else {
      console.warn('Este navegador no soporta la lectura en voz alta.');
    }
  }
}
