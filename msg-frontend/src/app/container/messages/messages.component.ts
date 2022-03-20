import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { getMessages, sendMessage } from 'src/app/graphql';
import * as T from 'Types';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  messages: Array<T.IMessage> = [
    // {
    //   id: 1,
    //   text: 'qwe',
    //   createdAt: '00:00',
    //   postedBy: {
    //     id: 1,
    //     name: 'Jack William Don Je Badiack',
    //     email: 'jack@msg.com',
    //     color: '#ADADAD',
    //   },
    // },
    // {
    //   id: 2,
    //   text: '2 message',
    //   createdAt: '01:00',
    //   postedBy: {
    //     id: 2,
    //     name: 'Pit',
    //     email: 'pit@msg.com',
    //     color: '#AF0E0E',
    //   },
    // },
    // {
    //   id: 3,
    //   text: '3 message',
    //   createdAt: '03:00',
    //   postedBy: {
    //     id: 3,
    //     name: 'Smith',
    //     email: 'smith@msg.com',
    //     color: '#296907',
    //   },
    // },
  ];
  total = 0;
  next = 0;
  text = '';
  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .watchQuery({
        query: getMessages,
      })
      .valueChanges.subscribe((result: any) => {
        this.messages = result.data.messages.messages;
        this.next = result.data.next;
        this.total = result.data.total;
      });
  }

  onChange(event: any) {
    this.text = event.target.value;
  }

  onSend() {
    this.apollo
      .mutate({
        mutation: sendMessage,
        variables: { text: this.text },
      })
      .subscribe(
        ({ data }) => {
          console.log(data);
        },
        (error) => {
          console.error(error);
        }
      );

    this.text = '';
  }
}
