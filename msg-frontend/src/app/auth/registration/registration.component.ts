import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { NotifierService } from 'angular-notifier';
import { signup } from 'src/app/graphql';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  @Input() routeToLogin: Function = () => {};
  private readonly notifier: NotifierService;

  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  form: any = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  hidePassword = true;

  getErrorMessage(field: any) {
    if (field.errors?.required) {
      return 'You must enter a value';
    } else if (field.errors?.email) {
      return 'Not a valid email';
    } else if (field.errors?.minlength) {
      return `Min lenght - ${field.errors?.minlength.requiredLength}`;
    } else {
      return '';
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.apollo
        .mutate({
          mutation: signup,
          variables: this.form.value,
        })
        .subscribe(
          ({ data, loading }) => {
            if (data) this.notifier.notify('success', 'Registation success!');
            this.routeToLogin();
          },
          (error) => {
            this.notifier.notify('error', error.message);
          }
        );
    }
  }

  ngOnInit(): void {}
}
