import { Component, Input, OnInit } from '@angular/core';
import * as T from 'Types';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message!: T.IMessage;

  isMyPost = false;
  constructor() {}

  ngOnInit(): void {
    this.isMyPost = Number(this.message.postedBy.id) === 1;
  }
}
