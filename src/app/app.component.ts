import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketserviceService } from './socketservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <div class="chat-container">
      <header>
        <h1>Chat App</h1>
      </header>
      <div class="chat-box">
        <ul class="messages">
          <li *ngFor="let chat of chatMessages">
            <div
              class="message"
              [class.user]="chat.sender === 'user'"
              [class.friend]="chat.sender === 'friend'"
            >
              <img
                [src]="chat.sender === 'user' ? userPic : friendPic"
                alt="Profile"
                class="profile-pic"
              />
              <div class="bubble">
                {{ chat.text }}
              </div>
              <div class="timestamp">{{ chat.timestamp }}</div>
            </div>
          </li>
        </ul>
      </div>
      <footer>
        <input
          [(ngModel)]="message"
          placeholder="Type a message..."
          class="message-input"
        />
        <button (click)="sendMessage()" class="send-button" [disabled]="!message.trim()">
          <i class="material-icons">send</i>
        </button>
      </footer>
    </div>
  `,
  styles: [
    `
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
      header {
        background-color: #075e54;
        color: white;
        text-align: center;
        padding: 10px 0;
        font-size: 1.5rem;
        font-weight: bold;
      }
      .chat-box {
        flex: 1;
        background-color: #ece5dd;
        overflow-y: auto;
        padding: 10px;
      }
      .messages {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
      }
      .message {
        display: flex;
        align-items: flex-start;
        margin: 10px 0;
      }
      .user {
        justify-content: flex-end;
      }
      .friend {
        justify-content: flex-start;
      }
      .bubble {
        max-width: 70%;
        padding: 10px 15px;
        border-radius: 15px;
        background-color: #dcf8c6;
        word-wrap: break-word;
        position: relative;
      }
      .friend .bubble {
        background-color: #fff;
        border: 1px solid #ddd;
      }
      .profile-pic {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: 0 10px;
      }
      .timestamp {
        font-size: 0.8rem;
        color: gray;
        margin-top: 5px;
        text-align: right;
      }
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
export class AppComponent implements OnInit, OnDestroy {
  message = '';
  chatMessages: { sender: 'user' | 'friend'; text: string; timestamp: string }[] = [];
  userPic = 'https://via.placeholder.com/40x40?text=U'; // Replace with actual user image
  friendPic = 'https://via.placeholder.com/40x40?text=F'; // Replace with actual friend image

  private subscriptions: Subscription = new Subscription();

  constructor(private socketService: SocketserviceService) {}

  ngOnInit() {
    // Subscribe to messages from the backend
    const messageSubscription = this.socketService.onMessage((msg: string) => {
      this.addMessage('friend', msg);
    });

    this.subscriptions.add(messageSubscription);
  }

  sendMessage() {
    if (this.message.trim()) {
      this.addMessage('user', this.message);
      this.socketService.sendMessage(this.message);
      this.message = '';
    }
  }

  addMessage(sender: 'user' | 'friend', text: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.chatMessages.push({ sender, text, timestamp });
  }

  ngOnDestroy() {
    // Clean up subscriptions to avoid memory leaks
    this.subscriptions.unsubscribe();
    this.socketService.disconnect();
  }
}
