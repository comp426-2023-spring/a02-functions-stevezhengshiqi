#!/usr/bin/env node

import minimist from 'minimist';
import fetch from 'node-fetch';
import moment from 'moment-timezone';

const args = minimist(process.argv.slice(2));

// Create the help text
if (args.h){
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n\
    -h            Show this help message and exit.\n\
    -n, -s        Latitude: N positive; S negative.\n\
    -e, -w        Longitude: E positive; W negative.\n\
    -z            Time zone: uses tz.guess() from moment-timezone by default.\n\
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n\
    -j            Echo pretty JSON from open-meteo API and exit." 
    );
    process.exit(0);
}

// Timezone
// const timezone = moment.tz.guess()
const timezone = args.z ? args.z : moment.tz.guess()

var latitude = args.n ? args.n : args.s -1;
var longitude = args.e ? args.e : args.w -1;
var day = args.d ? args.d : 1;
var start = moment().format("YYYY-MM-DD"); 
var end = moment().add(day,'days').format("YYYY-MM-DD");

// Find the appropriate request URL
var url = "https://api.open-meteo.com/v1/forecast?latitude="+latitude+"&longitude="+longitude+"&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&timezone="+timezone+"&start_date="+start+"&end_date="+end;

// Construct a fetch() API call that will return the JSON data you need
const response = await fetch(url);
// Get the data from the request
const data = await response.json();
const days = args.d; 

if(args.j) {
    console.log(data);
    process.exit(0);
}

if (days == 0) {
    console.log("today.")
} else if (days > 1) {
    console.log("in " + days + " days.")
} else {
    console.log("tomorrow.")
}

if (data.daily.precipitation_hours[days] == 0) {
    console.log("You will not need your galoshes");
} else {
    console.log("You might need your galoshes");
}

process.exit(0);