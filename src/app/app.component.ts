import { Component, OnInit } from '@angular/core';
import { SocketserviceService } from './socketservice.service';

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
  chatMessages: { sender: 'user' | 'friend'; text: string; timestamp: string }[] =
    [];

  userPic = 'https://images.pexels.com/photos/29879483/pexels-photo-29879483/free-photo-of-festive-christmas-ornament-on-pine-tree-branch.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load';
  friendPic = 'https://via.placeholder.com/40x40?text=F';

  constructor(private socketService: SocketserviceService) {}

  ngOnInit() {
    // Simulate receiving messages from the friend
    this.socketService.onMessage((msg) => {
      this.addMessage('friend', msg);
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      this.addMessage('user', this.message);
      this.socketService.sendMessage(this.message);

      // Simulate friend's reply (for demo purposes)
      setTimeout(() => {
        this.addMessage('friend', `Reply to: "${this.message}"`);
      }, 1000);

      this.message = '';
    }
  }

  addMessage(sender: 'user' | 'friend', text: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.chatMessages.push({ sender, text, timestamp });
  }
}
