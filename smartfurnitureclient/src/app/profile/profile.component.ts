import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatIconRegistry, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {ApiService} from "../api.service";
import {DomSanitizer} from "@angular/platform-browser";
import {EditProfileComponent} from "../edit-profile/edit-profile.component";
import {OptionsComponent} from "../options/options.component";
import {FurnitureComponent} from "../furniture/furniture.component";
import {ActivatedRoute} from "@angular/router";

export interface furniture {
  id: number;
  code: string;
  manufacturer: string;
  type: string;
}

export interface options {
  id: number;
  type: string;
  name: string;
  height: number;
  length: number;
  width: number;
  incline: number;
  rigidity: string;
  temperature: number;
  massage: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  data: any;
  error: any;
  furnitureDisplayedColumns: string[] = ['id', 'code', 'manufacturer', 'type'];
  optionsDisplayedColumns: string[] = ['id', 'type', 'name', 'height', 'length',
    'width', 'incline', 'rigidity', 'temperature', 'massage'];
  ownedFurnitureDataSource: MatTableDataSource<furniture>;
  optionsDataSource: MatTableDataSource<options>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog,
              private api: ApiService,
              private route: ActivatedRoute,
              iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {

    iconRegistry.addSvgIcon('edit',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-edit-24px.svg'));
    iconRegistry.addSvgIcon('add',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-add-24px.svg'));
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    let id = this.route.snapshot.paramMap.get('id');
    if (this.api.currentUser != null && id === this.api.currentUser.pk) {
      this.data = this.api.currentUser;
      this.getTables();
    } else {
      this.api.getObj('users', id).subscribe((response: any) => {
        console.log(response);
        if (response) {
          this.error = null;
          this.data = response;
          this.getTables()
        } else {
          this.error = this.api.errorLog.pop();
        }
      });
    }
  }

  isOwner() {
    return this.api.currentUser ? this.api.currentUser.pk == this.data.pk : false;
  }

  getTables() {
    this.optionsDataSource = new MatTableDataSource(this.data.options_set);
    this.optionsDataSource.paginator = this.paginator;
    this.optionsDataSource.sort = this.sort;

    this.ownedFurnitureDataSource = new MatTableDataSource(this.data.owned_furniture);
    this.ownedFurnitureDataSource.paginator = this.paginator;
    this.ownedFurnitureDataSource.sort = this.sort;
  }

  applyFurnitureFilter(filterValue: string) {
    this.ownedFurnitureDataSource.filter = filterValue.trim().toLowerCase();
    if (this.ownedFurnitureDataSource.paginator)
      this.ownedFurnitureDataSource.paginator.firstPage();
  }

  applyOptionsFilter(filterValue: string) {
    this.optionsDataSource.filter = filterValue.trim().toLowerCase();
    if (this.optionsDataSource.paginator)
      this.optionsDataSource.paginator.firstPage();
  }

  //TODO add/edit options + furniture, stripe dialog
  openDialog(name: string): void {
    console.log(name);
    let dialogRef;
    if (name === 'editProfile')
      dialogRef = this.dialog.open(EditProfileComponent);
    else if (name === 'addOptions')
      dialogRef = this.dialog.open(OptionsComponent);
    else if (name === 'addFurniture')
      dialogRef = this.dialog.open(FurnitureComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.getCurrentUser().subscribe((response: any) => {
          console.log(response);
          if (response) {
            this.api.currentUser = response;
            this.data = this.api.currentUser;
            this.ownedFurnitureDataSource = new MatTableDataSource(this.api.currentUser.owned_furniture);
            this.optionsDataSource = new MatTableDataSource(this.api.currentUser.options_set);
          }
        });
      }
    });
  }
}
