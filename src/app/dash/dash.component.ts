import { Component, OnInit } from '@angular/core';
import { QuoteService } from '../iex/quote.service';
import { ChartService } from '../iex/chart.service';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { FirestoreService } from '../firestore.service';
import { WatchItem } from '../model/watch-item';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../custom/modal/modal.component';
import { HistoryService } from '../history/history.service';


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
  alertMessage: string;
  searchMessage: string;
  searchNotFoundMessage: string;


  constructor(private quoteService: QuoteService,
    private chartService: ChartService,
    private db: AngularFirestore,
    private firestoreService: FirestoreService,
    private modalService: NgbModal,
    private history: HistoryService) {

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
        this.watchList.push(
          {
            id: item['id']
            , companyName: item['companyName']
            , active: item['active']
            , added: item['added']
            , price: 0.0
            , percentageChange: 0.0
          }
        );
      });

      if (this.watchList.length > 0) {
        this.onSearch(this.watchList[0].id, "1m", true);
      } else {
        this.onSearch("AAPL", "", true);
      }

      this.refreshWatchListData();
    });


  }

  searchClicked(symbol: string) {
    this.onSearch(symbol, "", false);
  }

  onSearch(symbol: string, chartRange: string, initSearch: boolean) {

    if (chartRange == null || chartRange == '') {
      chartRange = '1m';
    }

    if (!initSearch) {
      this.sendSearchAnalytics();
      this.saveToUserHistory(`Searched for ${symbol} with range ${chartRange}`);
    }

    this.quoteService.getQuote(symbol).subscribe((response: any[]) => {
      this.searchSymbol = symbol;
      this.searchNotFoundMessage = null;
      this.searchMessage = `Search found ${response['symbol']}`;
      this.currentQuote = response;
    },
      error => {
        this.searchMessage = null;
        this.searchNotFoundMessage = `Did not find ${symbol}. Please see if symbol exists in http://eoddata.com/symbols.aspx`;
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
      .set({ 'active': true, 'added': searchDate, 'companyName': this.currentQuote['companyName'] });

    this.alertMessage = `${this.searchSymbol} was added to your watch list.`;
    this.saveToUserHistory(`Added ${this.searchSymbol} to watch list.`);
  }

  changeChartRange(entry: string) {
    console.log(`onSelectionChange symbol: ${this.searchSymbol} range: ${entry}`);
    this.onSearch(this.searchSymbol, entry, true);
  }

  onDeleteWatchItem(item: WatchItem) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.name = item.id;
    modalRef.result.then((result) => {
      if (result == 'confirm') {
        this.firestoreService.deleteDocument(`${this.dataPath}/${item.id}`);
        console.log(`Deleted item ${item.id} from watch list.`);
        this.alertMessage = `${item.id} was deleted from your watch list.`
      }
    }).catch((error) => {
      console.log(error);
    });
    this.saveToUserHistory(`Deleted watch item ${item.id} from watch list.`);
  }

  refreshWatchListData() {
    if (this.watchList.length > 0) {
      this.quoteService.getBatchQuote(this.watchList.map((item) => item.id)).subscribe((response) => {
        this.watchList.forEach((item) => {
          item.price = response[item.id]['quote']['latestPrice'];
          item.percentageChange = response[item.id]['quote']['change'];
        });
      });
    }
  }

  symbolInWatchList() {
    var item = this.watchList.find((item) => item.id == this.searchSymbol);
    if (item == null) {
      return false;
    }

    return true;
  }

  private saveToUserHistory(message: string) {
    this.history.saveHistory(firebase.auth().currentUser.email, message);
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
    { // Red
      backgroundColor: 'rgb(135,206,250,0.2)',
      borderColor: 'rgb(0,0,255,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // Green
      backgroundColor: 'rgb(144,238,144,0.2)',
      borderColor: 'rgb(0,128,0,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // Blue
      backgroundColor: 'rgb(255,160,122,0.2)',
      borderColor: 'rgb(255,160,122,1)',
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

  sendSearchAnalytics = () => {
    (<any>window).ga('send', 'event', {
      eventCategory: 'User Touch',
      eventLabel: 'Search',
      eventAction: `Search ${this.searchSymbol}`,
      eventValue: 10
    });
  }

}
