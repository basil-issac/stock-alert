import { Component, OnInit } from '@angular/core';
import { QuoteService } from '../iex/quote.service';
import { ChartService } from '../iex/chart.service';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {

  public entries: string[];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
  private currentQuote: any[];
  public lineChartData:Array<any>;
  public lineChartLabels:Array<any>;
  private searchSymbol;

  constructor(private quoteService: QuoteService,
     private chartService: ChartService,
     private db: AngularFirestore) { 
    this.currentQuote = [];
    this.lineChartData = new Array<any>();
    this.lineChartLabels = new Array<any>();
  }

  ngOnInit() {
  }

  private processChart(chartResponse: any[]) {

    console.log(chartResponse);

    this.entries = ['1d','1m','3m','6m','ytd','1y','2y','5y']

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
    this.lineChartData.push({data: open, label: 'Open'});
    this.lineChartData.push({data: high, label: 'High'});
    this.lineChartData.push({data: low, label: 'Low'});

  }

  // public lineChartData:Array<any> = [
  //   {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  //   {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
  //   {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  // ];

  // public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions:any = {
    responsive: true
  };

  public lineChartColors:Array<any> = [
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

  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

  public onSearch(symbol: string, chartRange: string) {

    if(chartRange == null || chartRange == '') {
      chartRange = '1m';
    }
    this.searchSymbol = symbol;
    this.quoteService.getQuote(symbol).subscribe((response: any[]) => {
      console.log('Quote response: ' + response);
      this.currentQuote = response;
    });

    this.chartService.getChart(symbol,chartRange).subscribe((response: any[]) => {

      this.processChart(response);

    });
  }

  public addToWatchList() {
    console.log(`Added ${this.searchSymbol} to watch list`);
    var user = firebase.auth().currentUser;
    var d = new Date();
    var date = d.getUTCMonth() + '/' +d.getUTCDate() + '/' + d.getUTCFullYear();
    var time = ' '+ d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds();
    var searchDate = `${date} ${time}`;
    this.db.doc(`users/${user.email}`)
      .collection('watchlist')
      .doc(this.searchSymbol)
      .set({'active': true, 'added': searchDate});
  }

  public changeChartRange(entry: string) {
    console.log(`onSelectionChange symbol: ${this.searchSymbol} range: ${entry}`);
    this.onSearch(this.searchSymbol, entry);
  }

}
