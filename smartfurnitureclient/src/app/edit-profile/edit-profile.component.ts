import {Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  public error: object;
  public data: any;

  constructor(private api: ApiService,
              private dialogRef: MatDialogRef<EditProfileComponent>) {
    this.data = this.api.currentUser
  }

  ngOnInit() {
  }
  //TODO send image change all dialog to forms
  save(): void {
    this.api.editCurrentUser({
      'username': this.data.username,
      'email': this.data.email,
      'first_name': this.data.first_name,
      'last_name': this.data.last_name,
      'height': this.data.height,
    }).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.dialogRef.close(true);
        this.error = null;
        this.api.getCurrentUser().subscribe((response: any) => {
          if (response)
            this.api.currentUser = response;
        });
      } else
        this.error = this.api.errorLog.pop();
    });
  }
}
