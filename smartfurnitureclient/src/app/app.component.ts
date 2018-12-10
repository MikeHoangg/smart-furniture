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
  currentUserId: number;

  constructor(private dialog: MatDialog,
              private api: ApiService) {
    if (api.currentUser != null)
      this.currentUserId = api.currentUser.id;
  }

  ngOnInit() {
  }

  openDialog(name: string): void {
    let dialogRef;
    if (name === 'login')
      dialogRef = this.dialog.open(LoginComponent);
    else if (name === 'register')
      dialogRef = this.dialog.open(RegisterComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.currentUserId = this.api.currentUser.id;
    });
  }

  logout(): void {
    this.api.authorize('logout').subscribe((response: any) => {
      console.log(response);
      if (response) {
        document.cookie = "auth_token=;path=/";
        this.api.currentUser = null;
        this.currentUserId = null
      }
    });
  }
}
