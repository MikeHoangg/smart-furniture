import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl: string = 'http://127.0.0.1:8000/api/v1/';
  errorLog: Array<object> = [];

  constructor(private httpClient: HttpClient) {
  }

  private handleError<T>(result?: T) {
    return (response: any): Observable<T> => {
      this.errorLog.push(response.error);
      return of(result as T);
    };
  }

  login(data) {
    return this.httpClient.post(`${this.apiUrl}login/`, data)
      .pipe(catchError(this.handleError()));
  }

  logout() {
    return this.httpClient.post(`${this.apiUrl}logout/`, null)
      .pipe(catchError(this.handleError()));
  }
}
