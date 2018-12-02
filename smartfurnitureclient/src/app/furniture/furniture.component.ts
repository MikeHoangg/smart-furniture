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

  constructor(private dialogRef: MatDialogRef<FurnitureComponent>,
              private api: ApiService) {
    this.furnitureForm = new FormGroup({
      code: new FormControl(this.data ? this.data.code : null),
      manufacturer: new FormControl(this.data ? this.data.manufacturer : null),
      type: new FormControl(this.data ? this.data.type : null),
      is_public: new FormControl(this.data ? this.data.is_public : false),
    });
    this.title = this.data ? "Add furniture" : "Edit furniture";
  }

  ngOnInit() {
  }

  save(): void {
    if (this.title === "Add furniture") {
      // TODO add furniture
    } else {
      // TODO edit furniture
    }
  }
}
