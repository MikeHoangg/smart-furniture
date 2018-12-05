import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";
import {FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: any;
  loginForm = new FormGroup({
    username: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
  });

  constructor(private dialogRef: MatDialogRef<LoginComponent>,
              private api: ApiService,
              private router: Router) {
  }

  ngOnInit() {
  }

  login(): void {
    this.loginForm.value['email'] = this.loginForm.value['username'];
    this.api.authorize('login', this.loginForm.value).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.error = null;
        document.cookie = `auth_token=Token ${response.key};path=/`;
        this.api.getCurrentUser().subscribe((response: any) => {
          console.log(response);
          if (response) {
            this.api.currentUser = response;
            this.dialogRef.close(true);
            this.router.navigateByUrl(`/profile/${this.api.currentUser.pk}`);
          }
        });
      } else
        this.error = this.api.errorLog.pop();
    });
  }
}
