import { Component, OnInit } from '@angular/core';
import { getUsers, newUser } from 'src/app/graphql';
import * as T from 'Types';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: Array<T.IUser> = [
    // {
    //   id: 1,
    //   name: 'Jack',
    //   email: 'jack@msg.com',
    //   color: '#ADADAD',
    // },
    // {
    //   id: 2,
    //   name: 'Pit',
    //   email: 'pit@msg.com',
    //   color: '#AF0E0E',
    // },
    // {
    //   id: 3,
    //   name: 'Smith',
    //   email: 'smith@msg.com',
    //   color: '#296907',
    // },
  ];
  subscribe: { unsubscribe: () => void } = { unsubscribe: () => {} };

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.apollo
      .watchQuery({
        query: getUsers,
      })
      .valueChanges.subscribe((result: any) => {
        this.users = result.data.users;
      });

    // this.apollo
    //   .query({
    //     query: newUser,
    //   })
    //   .subscribe((result: any) => {
    //     console.log(result);
    //   });
  }

  ngOnDestroy() {
    // this.subscribe.unsubscribe();
  }
}
