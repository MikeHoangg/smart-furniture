import {Component, OnInit} from '@angular/core';
import {StripeToken} from "stripe-angular"
import {ApiService} from "../api.service";
import {MatDialogRef, MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css']
})
export class StripeComponent implements OnInit {
  error: any;
  price: number = 3.99;

  constructor(private api: ApiService, public snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<StripeComponent>) {
  }

  ngOnInit() {
  }

  setStripeToken(token: StripeToken) {
    this.api.createObj('set-prime', {
      "user": this.api.currentUser.id,
      "stripe_token": token.id,
      "price": this.price * 100
    }).subscribe((response: any) => {
      if (response) {
        this.dialogRef.close(true);
        this.error = null;
        this.snackBar.open('Successfully upgraded to a prime account.', 'Ok', {
          duration: 2000,
        });
      } else
        this.error = this.api.errorLog.pop()
    });
  }

  onStripeError(error: Error) {
    this.error = Error;
    console.log(error)
  }
}
