import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NotifierModule } from 'angular-notifier';
import { InMemoryCache } from '@apollo/client/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

import { AppComponent } from './app.component';
import { ContainerComponent } from './container/container.component';
import { AuthComponent } from './auth/auth.component';
import { MessagesComponent } from './container/messages/messages.component';
import { UsersComponent } from './container/users/users.component';
import { HeadComponent } from './container/head/head.component';
import { MessageComponent } from './container/messages/message/message.component';
import { UserComponent } from './container/users/user/user.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { LoginComponent } from './auth/login/login.component';

const getToken = () => {
  const token = sessionStorage.getItem('token');
  if (token) return `Barear ${token}`;
  return '';
};

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    AuthComponent,
    MessagesComponent,
    UsersComponent,
    HeadComponent,
    MessageComponent,
    UserComponent,
    RegistrationComponent,
    LoginComponent,
  ],
  imports: [
    ApolloModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NotifierModule.withConfig({
      position: {
        vertical: {
          position: 'top',
          distance: 10,
          gap: 10,
        },
        horizontal: {
          position: 'middle',
        },
      },
      behaviour: {
        autoHide: 3000,
        stacking: 3,
      },
    }),
    HttpClientModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'http://localhost:8002/graphql',
            headers: {
              authorization: getToken(),
            } as any,
          }),
          defaultOptions: {
            mode: 'no-cors',
            watchQuery: {
              errorPolicy: 'all',
            },
          },
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class AppModule {}
