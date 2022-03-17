import { Component, Input, OnInit } from '@angular/core';
import * as T from 'Types';
export interface IMessage {
  id: number;
  text: string;
  createdAt: string;
  postedBy: T.IUser;
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
