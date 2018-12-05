import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {MatDialogRef} from "@angular/material";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  error: any;
  data: any;
  fileToUpload: File;
  editProfileForm: FormGroup;

  constructor(private api: ApiService,
              private dialogRef: MatDialogRef<EditProfileComponent>) {
    this.data = this.api.currentUser;
    this.editProfileForm = new FormGroup({
      username: new FormControl(this.data.username),
      email: new FormControl(this.data.email),
      first_name: new FormControl(this.data.first_name),
      last_name: new FormControl(this.data.last_name),
      height: new FormControl(this.data.height || 0),
    })
  }

  ngOnInit() {
  }

  save(): void {
    let formData: FormData = new FormData();
    for (let key in this.editProfileForm.value)
      formData.append(key, this.editProfileForm.value[key]);
    if (this.fileToUpload)
      formData.append('image', this.fileToUpload);
    this.api.editCurrentUser(formData).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.error = null;
        this.dialogRef.close(true);
      } else
        this.error = this.api.errorLog.pop();
    });
  }

  public handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
}
