import { Component, OnInit } from '@angular/core';
import { SocketService } from './socketservice.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="chat-container">
      <header>
        <h1>Chat App</h1>
      </header>
      <div class="chat-box">
        <ul class="messages">
          <li
            *ngFor="let msg of messages; let i = index"
            [class.outgoing]="i % 2 === 0"
            [class.incoming]="i % 2 !== 0"
          >
            <div class="bubble">{{ msg }}</div>
            <div class="timestamp">10:{{ i + 10 }}</div>
          </li>
        </ul>
      </div>
      <footer>
        <input
          [(ngModel)]="message"
          placeholder="Type a message..."
          class="message-input"
        />
        <button (click)="sendMessage()" class="send-button">
          <i class="material-icons">send</i>
        </button>
      </footer>
    </div>
  `,
  styles: [
    `
      /* Chat Container */
      .chat-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        max-width: 600px;
        margin: auto;
        border: 1px solid #ddd;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        font-family: 'Arial', sans-serif;
      }

      /* Header */
      header {
        background-color: #075e54;
        color: white;
        text-align: center;
        padding: 10px 0;
        font-size: 1.5rem;
        font-weight: bold;
      }

      /* Chat Box */
      .chat-box {
        flex: 1;
        background-color: #ece5dd;
        overflow-y: auto;
        padding: 10px;
      }

      /* Messages */
      .messages {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
      }

      .messages li {
        display: flex;
        flex-direction: column;
        margin: 5px 0;
        max-width: 70%;
      }

      .messages li.incoming {
        align-self: flex-start;
      }

      .messages li.outgoing {
        align-self: flex-end;
      }

      .bubble {
        padding: 10px 15px;
        border-radius: 15px;
        position: relative;
        word-wrap: break-word;
        background-color: #dcf8c6;
      }

      .messages li.incoming .bubble {
        background-color: #fff;
        border: 1px solid #ddd;
      }

      .timestamp {
        font-size: 0.8rem;
        color: gray;
        margin-top: 5px;
        text-align: right;
      }

      /* Footer */
      footer {
        display: flex;
        align-items: center;
        padding: 10px;
        background-color: #fff;
        border-top: 1px solid #ddd;
      }

      .message-input {
        flex: 1;
        padding: 10px;
        font-size: 1rem;
        border: 1px solid #ddd;
        border-radius: 20px;
        margin-right: 10px;
      }

      .send-button {
        background-color: #075e54;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .send-button i {
        font-size: 1.2rem;
      }

      .send-button:hover {
        background-color: #128c7e;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  message = '';
  messages: string[] = [];

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.onMessage().subscribe((msg) => {
      this.messages.push(msg);
    });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.socketService.sendMessage(this.message);
      this.message = '';
    }
  }
}
