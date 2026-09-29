import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignalrService } from '../Services/signalr-service.service';
import { ChatMessage } from '../Models/chat-message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  userName = '';

  message = '';

  messages: ChatMessage[] = [];

  private apiUrl =
    'https://localhost:7151/api/Chat';

  constructor(
    private signalrService: SignalrService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {

    this.loadOldMessages();

    this.signalrService.startConnection();

    this.signalrService.message$
      .subscribe((message: ChatMessage) => {

        this.messages.push(message);

      });
  }

  loadOldMessages(): void {

    this.http
      .get<ChatMessage[]>(this.apiUrl)
      .subscribe({
        next: (data) => {

          this.messages = data;

        },
        error: (error) => {

          console.error(
            'Error loading messages:',
            error
          );

        }
      });
  }

  sendMessage(): void {

    if (
      !this.userName.trim() ||
      !this.message.trim()
    ) {
      return;
    }

    this.signalrService.sendMessage(
      this.userName,
      this.message
    );

    this.message = '';
  }
}