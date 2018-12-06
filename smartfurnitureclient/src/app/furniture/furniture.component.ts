import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../api.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-furniture',
  templateUrl: './furniture.component.html',
  styleUrls: ['./furniture.component.css']
})
export class FurnitureComponent implements OnInit {
  title: string;
  error: any;
  furnitureForm: FormGroup;
  types: any;

  constructor(private dialogRef: MatDialogRef<FurnitureComponent>,
              private api: ApiService,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.furnitureForm = new FormGroup({
      code: new FormControl(data ? data.code : null),
      manufacturer: new FormControl(data ? data.manufacturer : null),
      type: new FormControl(data ? data.type : "chair"),
      is_public: new FormControl(data ? data.is_public : false),
      owner: new FormControl(api.currentUser.pk),
    });
    this.title = data ? "Edit furniture" : "Add furniture";
    this.types = api.furnitureTypes
  }

  ngOnInit() {
  }

  save(): void {
    if (this.title === "Add furniture") {
      this.api.createObj('furniture', this.furnitureForm.value).subscribe((response: any) => {
        console.log(response);
        if (response) {
          this.error = null;
          this.dialogRef.close(true);
        } else
          this.error = this.api.errorLog.pop();
      });
    } else {
      this.api.editObj('furniture', this.data.pk, this.furnitureForm.value).subscribe((response: any) => {
        console.log(response);
        if (response) {
          this.error = null;
          this.dialogRef.close(true);
        } else
          this.error = this.api.errorLog.pop();
      });
    }
  }
}
