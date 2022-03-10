import { Apollo, gql } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  constructor(private apollo: Apollo) {}

  isLogin = true;

  ngOnInit(): void {
    //   this.apollo
    //     .watchQuery({
    //       query: gql`
    //         {
    //           rates(currency: "USD") {
    //             currency
    //             rate
    //           }
    //         }
    //       `,
    //     })
    //     .valueChanges.subscribe((result: any) => {
    //       // this.rates = result?.data?.rates;
    //       // this.loading = result.loading;
    //       // this.error = result.error;
    //     });
  }
}
