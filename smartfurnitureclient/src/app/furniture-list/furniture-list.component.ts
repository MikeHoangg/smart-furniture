import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatIconRegistry, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from "@angular/material";
import {furniture} from "../profile/profile.component";
import {ApiService} from "../api.service";
import {DomSanitizer} from "@angular/platform-browser";
import {FurnitureComponent} from "../furniture/furniture.component";
import {ApplyOptionsComponent} from "../apply-options/apply-options.component";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {TranslateService} from "@ngx-translate/core";

export interface furniture {
  id: number;
  code: string;
  brand: string;
  type: string;
  current_options: any[];
  owner: number;
}

@Component({
  selector: 'app-furniture-list',
  templateUrl: './furniture-list.component.html',
  styleUrls: ['./furniture-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FurnitureListComponent implements OnInit {
  furnitureDisplayedColumns: string[] = ['code', 'brand', 'type'];
  furnitureDataSource: MatTableDataSource<furniture>;
  expandedElement: furniture | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  prime_types: string[] = [];

  constructor(private dialog: MatDialog,
              private api: ApiService,
              public snackBar: MatSnackBar, public translate: TranslateService,
              iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('edit',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-edit-24px.svg'));
    iconRegistry.addSvgIcon('rate',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-star_rate-18px.svg'));
    iconRegistry.addSvgIcon('settings',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-settings-20px.svg'));
    iconRegistry.addSvgIcon('delete',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-delete-24px.svg'));
    for (let type of api.furnitureTypes) {
      if (type.prime_actions)
        this.prime_types.push(type.name)
    }
  }

  ngOnInit() {
    this.getFurniture();
  }

  getFurniture() {
    this.api.getList('furniture').subscribe((response: any) => {
      if (response) {
        this.furnitureDataSource = new MatTableDataSource(response);
        this.furnitureDataSource.paginator = this.paginator;
        this.furnitureDataSource.sort = this.sort;
      }
    });
  }

  applyFurnitureFilter(filterValue: string) {
    this.furnitureDataSource.filter = filterValue.trim().toLowerCase();
    if (this.furnitureDataSource.paginator)
      this.furnitureDataSource.paginator.firstPage();
  }

  isFurnitureOwner(id) {
    if (this.api.currentUser != null)
      for (let furniture of this.api.currentUser.owned_furniture)
        if (furniture.id === id && furniture.owner.id === this.api.currentUser.id)
          return true;
    return false;
  }

  openDialog(name: string, id = null): void {
    if (this.api.currentUser == null)
      this.translate.get('ACTION.NOT_AUTHORIZED').subscribe((res: string) => {
        this.snackBar.open(res, 'OK', {
          duration: 5000,
        });
      });
    else {
      let dialogRef;
      if (name === 'editFurniture') {
        this.api.getObj('furniture', id).subscribe((response: any) => {
          console.log(response);
          if (response) {
            dialogRef = this.dialog.open(FurnitureComponent, {data: response});
            this.closedDialog(dialogRef);
          }
        });
      } else if (name === 'settings') {
        this.api.getObj('furniture', id).subscribe((response: any) => {
          console.log(response);
          if (response) {
            dialogRef = this.dialog.open(ApplyOptionsComponent, {data: response});
            this.closedDialog(dialogRef);
          }
        });
      }
    }

  }

  closedDialog(dialogRef) {
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getFurniture();
      }
    });
  }

  deleteObject(list, id) {
    this.api.deleteObj(list, id).subscribe((response: any) => {
      console.log(response);
      this.getFurniture();
    });
  }

  getAvg(options, attr) {
    if (attr != 'massage' && attr != 'rigidity') {
      let res = 0;
      for (let option of options)
        res += option[attr];
      return Math.round(res / options.length)
    } else if (attr == 'massage') {
      let res = {
        'none': 0,
        'slow': 0,
        'medium': 0,
        'rapid': 0
      };
      for (let option of options)
        res[option[attr]]++;
      return Object.keys(res).reduce(function (a, b) {
        return res[a] > res[b] ? a : b
      });
    } else if (attr == 'rigidity') {
      let res = {
        'soft': 0,
        'medium': 0,
        'solid': 0
      };
      for (let option of options)
        res[option[attr]]++;
      return Object.keys(res).reduce(function (a, b) {
        return res[a] > res[b] ? a : b
      });
    }
  }
}
