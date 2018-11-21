import { TestBed, inject } from "@angular/core/testing";
import { QuoteService } from "./quote.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [QuoteService],
    imports: [
      HttpClientTestingModule
    ],
  });
});

it('expects iex service to get the correct quote it requested',
  inject([HttpTestingController, QuoteService],
    (httpMock: HttpTestingController, service: QuoteService) => {
      // We call the service
      service.getQuote("AAPL").subscribe( (data: any[]) => {
        expect(data['symbol']).toBe('AAPL');
        expect(data['companyName']).toBe('Apple Inc.');
      });
    })
);