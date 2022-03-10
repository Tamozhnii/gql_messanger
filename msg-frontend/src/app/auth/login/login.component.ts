import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Apollo, gql } from 'apollo-angular';
import { getUsers, login } from 'src/app/graphql';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private readonly notifier: NotifierService;

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
            console.log(data);
            console.log(loading);
          },
          (error) => {
            this.notifier.notify('error', error.message);
            console.log(error);
          }
        );
      // this.apollo
      //   .watchQuery({
      //     query: getUsers,
      //   })
      //   .valueChanges.subscribe(({ data, loading, error }) => {
      //     if (data) this.notifier.notify('success', 'Registation success!');
      //     if (error) this.notifier.notify('error', error.message);
      //     console.log(error);
      //     console.log(data);
      //     console.log(loading);
      //   });
    }
  }

  ngOnInit() {
    // this.apollo
    //   .watchQuery({
    //     query: gql`
    //       {
    //         rates(currency: "USD") {
    //           currency
    //           rate
    //         }
    //       }
    //     `,
    //   })
    //   .valueChanges.subscribe((result: any) => {
    //     // this.rates = result?.data?.rates;
    //     // this.loading = result.loading;
    //     // this.error = result.error;
    //   });
  }
}
