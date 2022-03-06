import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'msg-frontend';
  token: string | null = null;

  ngOnInit(): void {
    this.token = window.localStorage.getItem('token');
  }
}
