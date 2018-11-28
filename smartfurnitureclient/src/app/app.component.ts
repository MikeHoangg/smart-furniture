import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material";
import {LoginComponent} from "./login/login.component";
import {ApiService} from "./api.service";
import {RegisterComponent} from "./register/register.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loggedIn: boolean;
  currentUserId: number;

  constructor(private dialog: MatDialog,
              private api: ApiService) {
  }

  ngOnInit() {
    if (document.cookie.match(/auth_token=(Token \w+)/)) {
      this.api.getCurrentUser().subscribe((response: any) => {
        console.log(response);
        if (response) {
          this.loggedIn = true;
          this.api.currentUser = response;
          this.currentUserId = this.api.currentUser.pk;
        }
      });
    }
  }

  openDialog(name: string): void {
    let dialogRef;
    if (name === 'login')
      dialogRef = this.dialog.open(LoginComponent);
    else if (name === 'register')
      dialogRef = this.dialog.open(RegisterComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.loggedIn = result;
      if (this.loggedIn)
        this.currentUserId = this.api.currentUser.pk;
    });
  }

  logout(): void {
    this.api.logout().subscribe((response: object) => {
      console.log(response);
      if (response) {
        document.cookie = "auth_token=;path=/";
        this.api.currentUser = null;
        this.loggedIn = false;
      }
    });
  }
}
