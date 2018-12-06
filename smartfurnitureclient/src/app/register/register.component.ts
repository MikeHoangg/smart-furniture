import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material";
import {ApiService} from "../api.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    username: new FormControl(),
    email: new FormControl(),
    password1: new FormControl(),
    password2: new FormControl(),
  });
  error: any;

  constructor(private dialogRef: MatDialogRef<RegisterComponent>,
              private api: ApiService,
              private router: Router) {
  }

  ngOnInit() {
  }

  register(): void {
    this.api.authorize('register', this.registerForm.value).subscribe((response: any) => {
      console.log(response);
      if (response) {
        document.cookie = `auth_token=Token ${response.key};path=/`;
        this.error = null;
        this.api.getCurrentUser().subscribe((response: any) => {
          console.log(response);
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

