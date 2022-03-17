import { Component, Input, OnInit } from '@angular/core';
import * as T from 'Types';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @Input() user!: T.IUser;

  constructor() {}

  ngOnInit(): void {}
}
