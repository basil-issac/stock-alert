import { Component, OnInit } from '@angular/core';
import { QuoteService } from '../iex/quote.service';
import { ChartService } from '../iex/chart.service';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { FirestoreService } from '../firestore.service';
import { WatchItem } from '../model/watch-item';


@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {

  public entries: string[];
  public watchList: WatchItem[];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  private currentQuote: any[];
  public lineChartData: Array<any>;
  public lineChartLabels: Array<any>;
  private searchSymbol;

  firestoreData: Observable<any[]>;
  dataPath: string;

  uncheckableRadioModel = 'Left';


  constructor(private quoteService: QuoteService,
    private chartService: ChartService,
    private db: AngularFirestore,
    private firestoreService: FirestoreService) 
    
    {
    this.currentQuote = [];
    this.lineChartData = new Array<any>();
    this.lineChartLabels = new Array<any>();
    this.watchList = [];
    this.dataPath = `/users/${firebase.auth().currentUser.email}/watchlist`;
    this.firestoreData = this.firestoreService.getCollection(this.dataPath);
  }

  ngOnInit() {

    this.firestoreData.subscribe(response => {
      this.watchList.length = 0;
      response.map(item => {
        console.log(`item ${item['id']}`);
        this.watchList.push({id: item['id'], active: item['active'], added: item['added']});
        this.onSearch(item['id'],"3m");
      })
      console.log(this.watchList);
    });

  }

  onSearch(symbol: string, chartRange: string) {

    if (chartRange == null || chartRange == '') {
      chartRange = '1m';
    }
    this.searchSymbol = symbol;
    this.quoteService.getQuote(symbol).subscribe((response: any[]) => {
      console.log('Quote response: ' + response);
      this.currentQuote = response;
    });

    this.chartService.getChart(symbol, chartRange).subscribe((response: any[]) => {

      this.processChart(response);

    });
  }

  addToWatchList() {
    console.log(`Added ${this.searchSymbol} to watch list`);
    var user = firebase.auth().currentUser;
    var d = new Date();
    var date = d.getUTCMonth() + '/' + d.getUTCDate() + '/' + d.getUTCFullYear();
    var time = ' ' + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds();
    var searchDate = `${date} ${time}`;
    this.db.doc(`users/${user.email}`)
      .collection('watchlist')
      .doc(this.searchSymbol)
      .set({ 'active': true, 'added': searchDate });
  }

  changeChartRange(entry: string) {
    console.log(`onSelectionChange symbol: ${this.searchSymbol} range: ${entry}`);
    this.onSearch(this.searchSymbol, entry);
  }

  onEditWatchItem(item: WatchItem) {

  }

  onDeleteWatchItem(item: WatchItem) {
    
  }


  private processChart(chartResponse: any[]) {

    console.log(chartResponse);

    this.entries = ['1d', '1m', '3m', '6m', 'ytd', '1y', '2y', '5y']

    this.lineChartLabels.length = 0;
    this.lineChartData.length = 0;

    var labels = new Array<any>();
    var data = new Array<any>();
    var open = [];
    var high = [];
    var low = [];

    chartResponse.forEach(item => {
      labels.push(item['label']);
      open.push(item['open']);
      high.push(item['high']);
      low.push(item['low']);
    });

    this.lineChartLabels = labels;
    this.lineChartData.push({ data: open, label: 'Open' });
    this.lineChartData.push({ data: high, label: 'High' });
    this.lineChartData.push({ data: low, label: 'Low' });

  }

  public lineChartOptions: any = {
    responsive: true
  };

  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  chartClicked(e: any): void {
    console.log(e);
  }

  chartHovered(e: any): void {
    console.log(e);
  }

}
