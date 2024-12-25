import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private messageSubject = new Subject<string>();

  constructor() {
    // Initialize socket connection
    this.socket = io('https://socket-backend-tbtq.onrender.com/'); // Replace with your actual server URL
    this.initListeners();
  }

  // Emit the message
  sendMessage(message: string): void {
    if (this.socket.connected) {
      this.socket.emit('message', message);
    }
  }

  // Listen for incoming messages
  onMessage(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  // Initialize socket event listeners
  private initListeners(): void {
    this.socket.on('message', (msg: string) => {
      this.messageSubject.next(msg);
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Connection error:', error);
    });

    this.socket.on('connect_timeout', () => {
      console.error('Connection timeout');
    });

    this.socket.on('disconnect', (reason: any) => {
      console.warn('Disconnected from server:', reason);
    });
  }

  // Disconnect from the socket
  disconnect(): void {
    this.socket.disconnect();
  }
}
