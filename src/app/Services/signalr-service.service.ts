import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { ChatMessage } from '../Models/chat-message';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection!: signalR.HubConnection;

  private messageSubject =
    new Subject<ChatMessage>();

  message$ =
    this.messageSubject.asObservable();

  startConnection(): void {

    this.hubConnection =
      new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:7151/chatHub')
        .withAutomaticReconnect()
        .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
        this.registerReceiveMessage();
      })
      .catch(error => {
        console.error(
          'SignalR connection error:',
          error
        );
      });
  }

  private registerReceiveMessage(): void {

    this.hubConnection.on(
      'ReceiveMessage',
      (message: ChatMessage) => {

        console.log(
          'Message received:',
          message
        );

        this.messageSubject.next(message);
      }
    );
  }

  sendMessage(
    userName: string,
    message: string
  ): void {

    this.hubConnection
      .invoke(
        'SendMessage',
        userName,
        message
      )
      .catch(error => {
        console.error(
          'Send message error:',
          error
        );
      });
  }
}