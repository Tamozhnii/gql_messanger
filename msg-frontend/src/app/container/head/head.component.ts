import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss'],
})
export class HeadComponent implements OnInit {
  constructor() {}
  editMode: boolean = false;

  ngOnInit(): void {}

  editProfile = (e: any) => {
    e.stopPropagation();
    this.editMode = !this.editMode;
  };

  onFormClick = (e: any) => {
    e.stopPropagation();
  };
}
