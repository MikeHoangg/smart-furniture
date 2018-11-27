import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../api.service";
import {AppRoutingModule} from "../app-routing.module";

@Component({
  selector: 'app-furniture',
  templateUrl: './furniture.component.html',
  styleUrls: ['./furniture.component.css']
})
export class FurnitureComponent implements OnInit {
  public error: object;

  constructor(private dialogRef: MatDialogRef<FurnitureComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private api: ApiService,
              private router: AppRoutingModule) {
  }

  ngOnInit() {
  }

  save(): void {
    if (this.data.title === "Add") {
      // TODO add furniture
    } else {
      // TODO edit furniture
    }
  }
}
