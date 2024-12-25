import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketserviceService {

  private socket: any;
  private messageSubject = new Subject<string>();

  constructor() {
    // Connect to the Socket.IO server
    this.socket = io('https://socket-backend-tbtq.onrender.com/'); // Replace with your actual server URL
  }

  sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  onMessage(p0: (msg: any) => void): Observable<string> {
    return this.messageSubject.asObservable();
  }

  private emitMessage(msg: string) {
    this.messageSubject.next(msg);
  }

  initListeners() {
    // Listen to incoming messages and broadcast them using the subject
    this.socket.on('message', (msg: string) => {
      this.emitMessage(msg);
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

  disconnect() {
    this.socket.disconnect();
  }
}
