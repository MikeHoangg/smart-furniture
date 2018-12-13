import {Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {
  error: any;
  data: any;
  reviews: any;
  title: string;
  rating: number;
  total_users: number;
  reviewForm: FormGroup;
  furnitureList: any[];

  constructor(private api: ApiService,
              private route: ActivatedRoute, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    this.title = this.route.snapshot.paramMap.get('brand');
    iconRegistry.addSvgIcon('delete',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/baseline-delete-24px.svg'));
  }

  ngOnInit() {
    this.getReviews();
  }

  getReviews() {
    this.api.getObj('reviews', this.title).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.error = null;
        this.reviews = response;
        this.getRating();
        this.getTotalUsers();
      } else {
        this.error = this.api.errorLog.pop();
      }
    });
  }

  submit(): void {
    if (this.reviewForm.valid)
      this.api.createObj('reviews', this.reviewForm.value).subscribe((response: any) => {
        console.log(response);
        if (response) {
          this.error = null;
          this.getReviews();
        } else
          this.error = this.api.errorLog.pop();
      });
  }

  isInFurnitureList(id) {
    for (let f of this.furnitureList)
      if (f.id === id)
        return true;
    return false
  }

  getTotalUsers() {
    this.api.getList('furniture').subscribe((response: any) => {
        if (response) {
          let res = 0;
          this.furnitureList = [];
          for (let f of response)
            if (f.brand == this.title) {
              res++;
              this.furnitureList.push(f)
            }
          this.route.queryParams.subscribe(params => {
            let furniture = parseInt(params['furniture']);
            if (this.api.currentUser != null) {
              this.data = this.api.currentUser;
              this.reviewForm = new FormGroup({
                furniture: new FormControl(furniture && this.isInFurnitureList(furniture) ? furniture : null, [Validators.required]),
                content: new FormControl(null, [Validators.required]),
                rating: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(5)]),
                user: new FormControl(this.data.id, [Validators.required]),
              });
              console.log(this.reviewForm.value)
            }
          });
          this.total_users = res
        } else
          this.total_users = 0
      }
    )
  }

  getRating() {
    if (this.reviews == null)
      this.rating = -1;
    let rating = 0;
    for (let r of this.reviews)
      rating += r.rating;
    rating /= this.reviews.length;
    this.rating = rating.toFixed(2);
  }

  deleteObject(list, id) {
    this.api.deleteObj(list, id).subscribe((response: any) => {
      console.log(response);
      this.getReviews()
    });
  }

  isReviewOwner(id) {
    if (this.api.currentUser != null)
      for (let review of this.api.currentUser.review_set)
        if (review.id === id && review.user.id === this.api.currentUser.id)
          return true;
    return false;
  }

  getDate(datetimeStr) {
    let date = new Date(datetimeStr);
    return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
  }

  getTime(datetimeStr) {
    let date = new Date(datetimeStr);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }
}