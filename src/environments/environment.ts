// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCVXMR5Q__Aea9It00pWxKn51EpfPIMos0",
    authDomain: "stock-watch-bd638.firebaseapp.com",
    databaseURL: "https://stock-watch-bd638.firebaseio.com",
    projectId: "stock-watch-bd638",
    storageBucket: "stock-watch-bd638.appspot.com",
    messagingSenderId: "646374588895"
  },
  iex_host: `https://api.iextrading.com/1.0/stock`,
  isLoggedIn: false
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
