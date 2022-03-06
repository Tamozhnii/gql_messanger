import { Component, OnInit } from '@angular/core';

export interface IUser {
  id: number;
  name: string;
  email: string;
  color?: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: Array<IUser> = [
    {
      id: 1,
      name: 'Jack',
      email: 'jack@msg.com',
      color: '#ADADAD',
    },
    {
      id: 2,
      name: 'Pit',
      email: 'pit@msg.com',
      color: '#AF0E0E',
    },
    {
      id: 3,
      name: 'Smith',
      email: 'smith@msg.com',
      color: '#296907',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
