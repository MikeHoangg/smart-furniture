import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {MatDialogRef} from "@angular/material";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  error: any;
  user_obj: any;
  fileToUpload: File;
  editProfileForm: FormGroup;

  constructor(private api: ApiService,
              private dialogRef: MatDialogRef<EditProfileComponent>) {
    this.user_obj = this.api.currentUser;
    this.editProfileForm = new FormGroup({
      username: new FormControl(this.user_obj.username, [Validators.required]),
      email: new FormControl(this.user_obj.email, [Validators.required]),
      first_name: new FormControl(this.user_obj.first_name),
      last_name: new FormControl(this.user_obj.last_name),
      height: new FormControl(this.user_obj.height || 0, [Validators.required, Validators.min(0)]),
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
