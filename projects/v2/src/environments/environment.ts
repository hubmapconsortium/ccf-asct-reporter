// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  tag: 'Development',
  googleAnalyticsId: 'G-77K2VNZRJ2',
  asctbApiUrl: 'https://apps.humanatlas.io/asctb-api'
  // use the following url when developing against in-staging-only features
  // asctbApiUrl: 'https://apps.humanatlas.io/asctb-api--staging'
  // use the following url for localhost API development
  // asctbApiUrl: 'http://localhost:5000'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
