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
    // Connect to the Socket.IO server
    this.socket = io('https://socket-backend-tbtq.onrender.com/'); // Replace with your actual server URL
    this.initListeners();
  }

  // Send a message to the server
  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  // Observable to subscribe to incoming messages
  onMessage(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  // Emit messages using the Subject
  private emitMessage(msg: string): void {
    this.messageSubject.next(msg);
  }

  // Initialize listeners for incoming events
  private initListeners(): void {
    // Listen for 'message' events from the server
    this.socket.on('message', (msg: string) => {
      this.emitMessage(msg); // Emit the received message to the Subject
    });

    // Listen for connection errors
    this.socket.on('connect_error', (error: any) => {
      console.error('Connection error:', error);
    });

    // Listen for connection timeout events
    this.socket.on('connect_timeout', () => {
      console.error('Connection timeout');
    });

    // Listen for disconnection events
    this.socket.on('disconnect', (reason: any) => {
      console.warn('Disconnected from server:', reason);
    });
  }

  // Disconnect the socket connection
  disconnect(): void {
    this.socket.disconnect();
  }
}
