import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;
  public error: object;

  constructor(private dialogRef: MatDialogRef<LoginComponent>,
              private api: ApiService,
              private router: Router) {
  }

  ngOnInit() {
  }

  login(): void {
    this.api.login({
      'username': this.username,
      'password': this.password
    }).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.dialogRef.close(true);
        this.error = null;
        document.cookie = `auth_token=Token ${response.key};path=/`;
        this.api.getCurrentUser().subscribe((response: any) => {
          console.log(response);
          if (response) {
            this.api.currentUser = response;
            this.router.navigateByUrl(`/profile/${this.api.currentUser.pk}`);
          }
        });
      } else
        this.error = this.api.errorLog.pop();
    });
  }
}
