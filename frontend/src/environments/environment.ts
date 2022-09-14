// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// s3://thomastaker/takerfiles/
export const environment = {
  production: false,
  urlServer: 'http://127.0.0.1:8000/api',
  S3: {
    bucket: 'thomastaker',
    idAccess: 'AKIA6I3W66W4OZDYFDK5',
    accessSecret: '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',
    place: 'eu-west-3',
    version: 'v4',
    pointUrl: 's3-accelerate.amazonaws.com',
    href: 'https://thomastaker.s3-accelerate.amazonaws.com',
    host: 's3-accelerate.amazonaws.com',
    hostname: 'https://s3-accelerate.amazonaws.com',
    imgUrl: 'https://s3-eu-west-3.amazonaws.com/thomastaker/takerfiles/',
},
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
