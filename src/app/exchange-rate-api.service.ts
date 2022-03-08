import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateApiService {
  API_KEY = 'a9d63c71f48593f71b7fe6fdd4e15eb0'; //change apikey
  END_POINT = 'http://api.exchangeratesapi.io/';

  constructor(private http: HttpClient) {}


  getCurrenciesOptions(): Observable<any> {
    return this.http
      .get(this.END_POINT + `v1/symbols?access_key=${this.API_KEY}`)
      .pipe(catchError((err) => {
        return throwError(err);
        
      }));
  }

  getCurrency(date: string, symbol: string): Observable<any> {
    return this.http.get(
      this.END_POINT +
        `${date}?access_key=${this.API_KEY}&base=EUR&symbols=${symbol}`
    );
  }
}
