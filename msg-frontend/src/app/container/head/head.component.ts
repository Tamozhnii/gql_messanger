import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Apollo } from 'apollo-angular';
import { changeProfile } from 'src/app/graphql';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss'],
})
export class HeadComponent implements OnInit {
  @Input() callback: Function = () => {};
  private readonly notifier: NotifierService;

  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    notifierService: NotifierService
  ) {
    this.notifier = notifierService;
  }

  /**Режим редактирования профиля */
  editMode = false;
  /**Пустые поля редактирования */
  isEmptyEditRows = true;

  ngOnInit(): void {}

  //#region Настройки формы модального окна редактирования
  form: any = this.formBuilder.group({
    name: ['', [Validators.minLength(3)]],
    color: [''],
  });

  onFormClick = (e: any) => {
    e.stopPropagation();
  };

  getError = () => {
    if (this.form.invalid)
      return `Min lenght - ${this.form.controls.name.errors?.minlength.requiredLength}`;
    else return '';
  };
  //#endregion

  /**Открытие/закрытие модального окна */
  editProfileMode = (e: any) => {
    e.stopPropagation();
    this.editMode = !this.editMode;
    this.form.reset();
  };

  /**Редактировать профиль пользователя */
  handleAccept = () => {
    if (this.form.valid) {
      const variables: any = {};
      variables.name = this.form.value.name || '';
      variables.color = this.form.value.color || '';

      this.apollo
        .mutate({
          mutation: changeProfile,
          variables,
        })
        .subscribe(
          ({ data, loading }) => {
            this.editMode = false;
            this.form.reset();
          },
          (error) => {
            this.notifier.notify('error', error.message);
          }
        );
    }
  };

  /**Выход из чата */
  onExit = () => {
    sessionStorage.removeItem('token');
    this.callback();
  };

  ngDoCheck() {
    if (
      (this.form.value.name && this.form.controls.name.valid) ||
      this.form.value.color
    )
      this.isEmptyEditRows = false;
    else this.isEmptyEditRows = true;
  }
}
