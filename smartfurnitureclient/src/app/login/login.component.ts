import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {ApiService} from "../api.service";
import {AppRoutingModule} from "../app-routing.module";

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
              private router: AppRoutingModule) {
  }

  ngOnInit() {
  }

  login(): void {
    this.api.login({'username': this.username, 'password': this.password}).subscribe((response: object) => {
      console.log(response);
      if (response) {
        this.dialogRef.close();
        this.error = null;
      } else
        this.error = this.api.errorLog.pop();
    });
  }
}
