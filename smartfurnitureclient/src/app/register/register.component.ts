import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material";
import {ApiService} from "../api.service";
import {AppRoutingModule} from "../app-routing.module";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public username: string;
  public email: string;
  public password1: string;
  public password2: string;
  public error: object;

  constructor(private dialogRef: MatDialogRef<RegisterComponent>,
              private api: ApiService,
              private router: AppRoutingModule) {
  }

  ngOnInit() {
  }

  login(): void {
    this.api.register({
      'username': this.username,
      'email': this.email,
      'password1': this.password1,
      'password2': this.password2,
    }).subscribe((response: any) => {
      console.log(response);
      if (response) {
        document.cookie = `auth_token=Token ${response.key};path=/`;
        this.dialogRef.close(true);
        this.error = null;
        this.api.getCurrentUser().subscribe((response: any) => {
          console.log(response);
          if (response) {
            this.api.currentUser = response;
            // this.router.navigateByUrl(`/profile/${response.id}`);
          }
        });
      } else
        this.error = this.api.errorLog.pop();
    });
  }

}

