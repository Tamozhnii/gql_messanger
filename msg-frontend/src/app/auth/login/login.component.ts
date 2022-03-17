import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Apollo } from 'apollo-angular';
import { login } from 'src/app/graphql';
import * as T from 'Types';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private readonly notifier: NotifierService;
  @Input() callback: Function = () => {};

  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  formLogin: any = this.formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  hidePassword = true;

  getErrorMessage(field: any) {
    if (field.errors?.required) {
      return 'You must enter a value';
    } else {
      return '';
    }
  }

  onSubmit() {
    if (this.formLogin.valid) {
      this.apollo
        .mutate({
          mutation: login,
          variables: this.formLogin.value,
        })
        .subscribe(
          ({ data, loading }) => {
            if (data) this.notifier.notify('success', 'Registation success!');
            sessionStorage.setItem(
              'token',
              (data as T.ILoginResponse).login.token
            );
            this.callback();
          },
          (error) => {
            this.notifier.notify('error', error.message);
          }
        );
    }
  }

  ngOnInit() {}
}
