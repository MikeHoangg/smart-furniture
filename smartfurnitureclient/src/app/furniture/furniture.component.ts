import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material";
import {ApiService} from "../api.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-furniture',
  templateUrl: './furniture.component.html',
  styleUrls: ['./furniture.component.css']
})
export class FurnitureComponent implements OnInit {
  @Input() data: any;
  title: string;
  error: any;
  furnitureForm: FormGroup;
  types: any;

  constructor(private dialogRef: MatDialogRef<FurnitureComponent>,
              private api: ApiService) {
    this.furnitureForm = new FormGroup({
      code: new FormControl(this.data ? this.data.code : null),
      manufacturer: new FormControl(this.data ? this.data.manufacturer : null),
      type: new FormControl(this.data ? this.data.type : "chair"),
      is_public: new FormControl(this.data ? this.data.is_public : false),
      owner: new FormControl(api.currentUser.pk),
    });
    this.title = this.data ? "Edit furniture" : "Add furniture";
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
