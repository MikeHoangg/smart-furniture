import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {ApiService} from "../api.service";
import {Router} from "@angular/router";
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: any;
  loginForm = new FormGroup({
    username: new FormControl(null,[Validators.required]),
    password: new FormControl(null,[Validators.required]),
  });

  constructor(private dialogRef: MatDialogRef<LoginComponent>,
              private api: ApiService,
              private router: Router) {
  }

  ngOnInit() {
  }

  login(): void {
    this.api.authorize('login', this.loginForm.value).subscribe((response: any) => {
      if (response) {
        this.error = null;
        document.cookie = `auth_token=Token ${response.key};path=/`;
        this.api.getCurrentUser().subscribe((response: any) => {
          if (response) {
            this.api.currentUser = response;
            this.dialogRef.close(true);
            this.router.navigateByUrl(`/profile`);
          }
        });
      } else
        this.error = this.api.errorLog.pop();
    });
  }
}
