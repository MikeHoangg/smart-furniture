import {Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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
              private route: ActivatedRoute) {
    this.title = this.route.snapshot.paramMap.get('brand');
    this.route.queryParams.subscribe(params => {
      let furniture = params['furniture'];
      if (api.currentUser != null) {
        this.data = api.currentUser;
        this.reviewForm = new FormGroup({
          furniture: new FormControl(furniture ? furniture : null),
          content: new FormControl(),
          rating: new FormControl([Validators.min(1), Validators.max(5)]),
          user: new FormControl(this.data.id),
        });
      }
    });

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
    this.api.createObj('reviews', this.reviewForm.value).subscribe((response: any) => {
      console.log(response);
      if (response) {
        this.error = null;
        this.getReviews();
      } else
        this.error = this.api.errorLog.pop();
    });

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
    this.rating = rating
  }

  deleteObject(list, id) {
    this.api.deleteObj(list, id).subscribe((response: any) => {
      console.log(response);
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
