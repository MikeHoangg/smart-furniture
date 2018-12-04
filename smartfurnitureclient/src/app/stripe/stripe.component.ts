import {Component, OnInit} from '@angular/core';
import {StripeScriptTag} from "stripe-angular";
import {StripeToken} from "stripe-angular"
import {ApiService} from "../api.service";
import {MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css']
})
export class StripeComponent implements OnInit {
  private publishableKey: string = "pk_test_0iZ2ciCzQWinzLyvzEzkuWiE";
  error: any;
  price: number = 3.99;

  constructor(public StripeScriptTag: StripeScriptTag,
              private api: ApiService,
              private dialogRef: MatDialogRef<StripeComponent>) {
    this.StripeScriptTag.setPublishableKey(this.publishableKey)
  }

  ngOnInit() {
  }

  setStripeToken(token: StripeToken) {
    console.log(token);

    this.api.createObj('set-prime', {
      "user": this.api.currentUser.pk,
      "stripe_token": token,
      "price": this.price * 100
    }).subscribe((response: any) => {
      console.log(token);
      if (response) {
        this.dialogRef.close(true);
        this.error = null;
      } else
        this.error = this.api.errorLog.pop()
    });
  }

  onStripeError(error: Error) {
    this.error = Error;
    console.log(error)
  }
}
