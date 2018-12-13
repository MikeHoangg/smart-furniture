import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, of} from "rxjs";
import {StripeScriptTag} from "stripe-angular";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  errorLog: Array<object> = [];
  statusLog: Array<object> = [];
  currentUser: any;
  massageRigidityTypes: any;
  furnitureTypes: any;
  apiUrl: string;

  loadUser() {
    return new Promise((resolve, reject) => {
      let lang = document.cookie.match(/lang=(\w+)/);
      this.apiUrl = lang ? `http://127.0.0.1:8000/${lang[1]}/api/v1` : 'http://127.0.0.1:8000/en/api/v1';
      if (document.cookie.match(/auth_token=(Token \w+)/)) {
        this.getCurrentUser().subscribe((response: any) => {
          resolve();
          console.log(response);

          if (response)
            this.currentUser = response;
        });
      } else
        resolve();
    })
  }

  loadFurnitureTypes() {
    return new Promise((resolve, reject) => {
      this.getList('furniture-types').subscribe((response: any) => {
        console.log(response);
        resolve();
        if (response)
          this.furnitureTypes = response;
      });
    })
  }

  loadMassageRigidityTypes() {
    return new Promise((resolve, reject) => {
      this.getList('massage-rigidity-types').subscribe((response: any) => {
        console.log(response);
        resolve();
        if (response)
          this.massageRigidityTypes = response;
      });
    })
  }

  constructor(private httpClient: HttpClient,
              public stripeTag: StripeScriptTag) {
    this.stripeTag.setPublishableKey("pk_test_0iZ2ciCzQWinzLyvzEzkuWiE")
  }


  private handleError<T>(result?: T) {
    return (response: any): Observable<T> => {
      console.log(response);
      this.errorLog.push(response.error);
      this.statusLog.push(response.status);
      return of(result as T);
    };
  }

  private getHttpOptions() {
    let res = {};
    let authCookie = document.cookie.match(/auth_token=(Token \w+)/);
    let csrfCookie = document.cookie.match(/csrftoken=(w+)/);
    if (authCookie)
      res['Authorization'] = authCookie[1];
    // if (csrfCookie)
    //   res['X-CSRFTOKEN'] = csrfCookie[1];
    return {headers: new HttpHeaders(res)}
  }

  authorize(action, data = null) {
    return this.httpClient.post(`${this.apiUrl}/${action}/`, data)
      .pipe(catchError(this.handleError()));
  }

  getCurrentUser() {
    return this.httpClient.get(`${this.apiUrl}/user/`, this.getHttpOptions())
      .pipe(catchError(this.handleError()));
  }

  editCurrentUser(data) {
    return this.httpClient.put(`${this.apiUrl}/user/`, data, this.getHttpOptions())
      .pipe(catchError(this.handleError()));
  }

  getList(list) {
    return this.httpClient.get(`${this.apiUrl}/${list}/`, this.getHttpOptions())
      .pipe(catchError(this.handleError()));
  }

  getObj(list, id) {
    return this.httpClient.get(`${this.apiUrl}/${list}/${id}/`, this.getHttpOptions())
      .pipe(catchError(this.handleError()));
  }

  editObj(list, id, data) {
    return this.httpClient.put(`${this.apiUrl}/${list}/${id}/`, data, this.getHttpOptions())
      .pipe(catchError(this.handleError()));
  }

  createObj(list, data) {
    return this.httpClient.post(`${this.apiUrl}/${list}/`, data, this.getHttpOptions())
      .pipe(catchError(this.handleError()));
  }

  deleteObj(list, id) {
    return this.httpClient.delete(`${this.apiUrl}/${list}/${id}`, this.getHttpOptions())
      .pipe(catchError(this.handleError()));
  }
}
