import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketserviceService {
  private socket: Socket;

  constructor() {
    this.socket = io('https://socket-backend-tbtq.onrender.com'); // Replace with your backend URL
  }

  // Emit events to the server
  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  // Listen to events from the server
  onMessage(callback: (message: string) => void): void {
    this.socket.on('message', callback);
  }

  // Disconnect the socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
