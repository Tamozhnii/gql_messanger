import { IUser } from './../../users/users.component';
import { Component, Input, OnInit } from '@angular/core';

export interface IMessage {
  id: number;
  text: string;
  createdAt: string;
  postedBy: IUser;
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message!: IMessage;

  isMyPost = false;
  constructor() {}

  ngOnInit(): void {
    this.isMyPost = this.message.id === 2;
  }
}
