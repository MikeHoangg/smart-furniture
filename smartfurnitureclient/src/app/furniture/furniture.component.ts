import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../api.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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
      code: new FormControl(data ? data.code : null,[Validators.required]),
      brand: new FormControl(data ? data.brand : null,[Validators.required]),
      type: new FormControl(data ? data.type : "chair",[Validators.required]),
      is_public: new FormControl(data ? data.is_public : false),
      owner: new FormControl(api.currentUser.id,[Validators.required]),
    });
    this.title = data ? "EDIT" : "ADD";
    this.types = api.furnitureTypes
  }

  ngOnInit() {
  }

  save(): void {
    if (this.data == null) {
      if (this.furnitureForm.valid)
        this.api.createObj('furniture', this.furnitureForm.value).subscribe((response: any) => {
          console.log(response);
          if (response) {
            this.error = null;
            this.dialogRef.close(true);
          } else
            this.error = this.api.errorLog.pop();
        });
    } else {
      if (this.furnitureForm.valid)
        this.api.editObj('furniture', this.data.id, this.furnitureForm.value).subscribe((response: any) => {
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
