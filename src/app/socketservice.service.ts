import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketserviceService {

  private socket = io('https://socket-backend-tbtq.onrender.com/'); // Backend URL

  // Emit events to the server
  sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  // Listen to events from the server
  onMessage(callback: (message: string) => void) {
    this.socket.on('message', callback);
  }

  // Disconnect the socket
  disconnect() {
    this.socket.disconnect();
  }
}
