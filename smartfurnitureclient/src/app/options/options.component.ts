import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  public error: object;

  constructor(private dialogRef: MatDialogRef<OptionsComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private api: ApiService) {
  }

  ngOnInit() {
  }

  save(): void {
    if (this.data.title === "Add") {
      // TODO add options
    } else {
      // TODO edit options
    }
  }
}
