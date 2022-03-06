import { IMessage } from './message/message.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  messages: Array<IMessage> = [
    {
      id: 1,
      text: 'qwe',
      createdAt: '00:00',
      postedBy: {
        id: 1,
        name: 'Jack William Don Je Badiack',
        email: 'jack@msg.com',
        color: '#ADADAD',
      },
    },
    {
      id: 2,
      text: '2 message',
      createdAt: '01:00',
      postedBy: {
        id: 2,
        name: 'Pit',
        email: 'pit@msg.com',
        color: '#AF0E0E',
      },
    },
    {
      id: 3,
      text: '3 message',
      createdAt: '03:00',
      postedBy: {
        id: 3,
        name: 'Smith',
        email: 'smith@msg.com',
        color: '#296907',
      },
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
