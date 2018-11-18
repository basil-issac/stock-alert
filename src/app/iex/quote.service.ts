import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(private http: HttpClient) { }

  getQuote(symbol: String) {
    var url = `${environment.iex_host}/${symbol}/quote`;
    return this.http.get(url);
  }

  getBatchQuote(symbols: string[]) {
    var result: any[];
    var url = `${environment.iex_host}/market/batch?symbols=${symbols.join(',')}&types=quote`;
    return this.http.get(url);
  }

}
