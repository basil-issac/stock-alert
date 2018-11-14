import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private http: HttpClient) { }

  getChart(symbol: string, range: string) {
    return this.http.get(`${environment.iex_host}/${symbol}/chart/${range}`);
  }
}
