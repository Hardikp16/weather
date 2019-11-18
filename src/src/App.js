import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
import SearchInput from './components/SearchInput.js';
import WeatherIcon from './components/WeatherIcon.js';
import WeatherForcast from './components/WeatherForcast.js'
var CryptoJS = require("crypto-js");

class App extends Component {

   constructor() {

      super();
      // state
      this.state = {
         latitude: '',
         longitude: '',
         apiKey: 'AIzaSyAzmX7CmJu1-mRePpiUc-iuAmgxaaSnFYA',
         //isLoading: false,
         weatherAtmosphere: [],
         todayWeather: {},
         weatherCond: '',
         city: '',
         forcasts: {},
         units:  {},
         error: null,
      };

      this.setLatLng = this.setLatLng.bind(this);
      this.firstLetterUpper = this.firstLetterUpper.bind(this);
      this.renderTemp = this.renderTemp.bind(this);
   }

   componentWillMount() {
      this.setDefault();
   }

   setDefault() {
      let units = {distance: "mi", pressure: "in", speed: "mph", temperature: "F", humidity: "%", rising: "", visibility: "mi"};
      
      this.setState({units: units});
   }

   getYahooApi(){
      return 'https://weather-ydn-yql.media.yahoo.com/forecastrss';
   }

   setError(error){
      console.log(error);

      this.setState({
         error: error
      });
   }

   setLatLng(latitude, longitude) {

      this.setState({
         latitude: latitude,
         longitude: longitude,
         //isLoading: false,
         error: null
      });

      this.getWeather();
   }

   firstLetterUpper(string) {
      return string.charAt(0).toUpperCase() + string.substr(1);
   }

   getWeather() {

      let url = this.getYahooApi();
      var query = { 
                     'lat': this.state.latitude, 
                     'lon': this.state.longitude, 
                     'format': 'json'
                  };

      var method = 'GET';
      var app_id = 'vxBHJ43c';
      var consumer_key = 'dj0yJmk9SmhvVTVqYUJDREM3JmQ9WVdrOWRuaENTRW8wTTJNbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTkx';
      var consumer_secret = 'e1730614dac1389c5a6371b48b1f714bfa168ba0';
      var concat = '&';
      var oauth = {
         'oauth_consumer_key': consumer_key,
         'oauth_nonce': Math.random().toString(36).substring(2),
         'oauth_signature_method': 'HMAC-SHA1',
         'oauth_timestamp': parseInt(new Date().getTime() / 1000).toString(),
         'oauth_version': '1.0'
      };

      var merged = {}; 
      $.extend(merged, query, oauth);
      // Note the sorting here is required
      var merged_arr = Object.keys(merged).sort().map(function(k) {
      return [k + '=' + encodeURIComponent(merged[k])];
      });
      var signature_base_str = method
      + concat + encodeURIComponent(url)
      + concat + encodeURIComponent(merged_arr.join(concat));

      var composite_key = encodeURIComponent(consumer_secret) + concat;
      var hash = CryptoJS.HmacSHA1(signature_base_str, composite_key);
      var signature = hash.toString(CryptoJS.enc.Base64);

      oauth['oauth_signature'] = signature;
      var auth_header = 'OAuth ' + Object.keys(oauth).map(function(k) {
      return [k + '="' + oauth[k] + '"'];
      }).join(',');


      $.ajax({
               url: url + '?' + $.param(query),
               headers: {
                  'Authorization': auth_header,
                  'X-Yahoo-App-Id': app_id 
               },
               method: 'GET',

               // data: parms,
               success: (rsp) => {
                  this.setWeatherData(rsp);
               },
               error: (rsp) => { 
                  var error = "There was an error with the weather request. Please try again later";
                  this.setError(error);
               }
      });

   }

   setWeatherData(data) {
      console.log(data);
      var weatherAtmosphere = [];

      let astronomy = data.current_observation.astronomy;  // sunrise:"5:22 am"sunset:"8:29 pm"
      let atmosphere = data.current_observation.atmosphere; //humidity:"61"pressure:"991.0"rising:"0"visibility:"16.1"
      let todayWeather = data.current_observation.condition; // code:"27"date:"Thu, 06 Jul 2017 10:00 PM CDT"temp:"83"text:"Mostly Cloudy"
      let wind = data.current_observation.wind //
      let forcasts = data.forecasts; //code:"30"date:"06 Jul 2017"day:"Thu"high:"91"low:"69"text:"Partly Cloudy"
      let city = data.location; // city:"Morton Grove"country:"United States"region:" IL"

      for( var type in atmosphere) {
         if(type === "rising"){
            continue;
         }
         let unit = this.state.units[type];
         let uType = this.firstLetterUpper(type);
         
         weatherAtmosphere.push({type: uType, data: atmosphere[type], unit: unit});
      }

      this.setState({
         weatherAtmosphere: weatherAtmosphere,
         astronomy: astronomy,
         todayWeather: todayWeather,
         forcasts: forcasts,
         city: city,
         error: null,
      });
   }

   renderError() {

      if(this.state.error === null) {
         return null;
      }

      return (
         <div class="alert alert-danger" role="alert">
            <strong>Error!</strong> {this.state.error}
         </div>
      );
   }


   renderSearch() {

      let panelColor = {
         background: 'rgb(230, 230, 230)'
      }

      return (
        
         <div className="row">
               <div className="col-sm-3 col-xs-1"> 
               </div>
               <div className="col-sm-6 col-xs-10 text-center panel " style={panelColor}>
                     <SearchInput setLatLng={this.setLatLng} setError={this.setError} />
               </div>
               <div className="col-sm-3 col-xs-1"> </div>
         </div>

      );

   }
 

   renderTemp(temp) {

      var style ={
         fontSize: '25px',
         paddingTop: '5px',
      }
      return <div style={style}> {temp}&deg;{this.state.units.temperature} </div>
   }

   renderWeather() {

      if(this.state.weatherAtmosphere.length === 0) {
         return null;
      }

      let panelColor = {
         background: 'rgb(230, 230, 230)'
      }

      let textStyle = {
         textAlign: 'left',
         paddingBottom: '10px'
      };

      let weatherInfoDomStyle = {
         textAlign: 'left',
         paddingBottom: '50px',
         paddingRight: '0px',
         paddingLeft: '0px'
      }

      let mainWeatherStyle = {
         paddingTop: '10px'
      }


      let todaysWeather = this.state.todayWeather;

      let weatherAtmosphere = this.state.weatherAtmosphere.map(function(row, i){
         let data = row.data + ' ' + row.unit;     

         return (<div key={i}>  <span> {row.type} </span>  <span> {data} </span> </div>)
      });


      var iconSize = '100'
   
      return(
         <div className="col-sm-6 col-xs-12 col-md-6 text-center panel" style={panelColor}>
            <div>

               {/* Weather Desc */}
               <div style={textStyle}>
                  <div>
                     {todaysWeather.date}
                  </div>
                  <div>
                    {todaysWeather.text}
                  </div>
               </div>

               <div className="row">
                  <div className="col-md-7 col-sm-6 col-xs-7" style={mainWeatherStyle}>
                     <WeatherIcon weatherType={todaysWeather.code} iconSize={iconSize} />
                     {this.renderTemp(todaysWeather.temperature)}
                  </div>
                  <div className="col-md-5 col-sm-3 col-xs-5" style={weatherInfoDomStyle}>
                     {weatherAtmosphere}
                  </div>
               </div>

            </div>
         </div>
      );

   }


   renderFooter() {
      let creditArray = [ {href: 'https://facebook.github.io/react/', text: 'React Framework'},
                          {href: 'https://github.com/kenny-hibino/react-places-autocomplete', text:'React Auto Complete Component'},
                          {href: 'https://developer.yahoo.com/weather/documentation.html', text: 'Yahoo Weather API'},
                          {href: 'http://getbootstrap.com/', text: 'Bootstrap'},
                          {href: 'https://jquery.com/', text: 'jQuery for Ajax'},
                          {href: 'https://erikflowers.github.io/weather-icons/', text: 'Weather Icon'} ];


      let creditP = creditArray.map(function(row, i){
         return <p key={'credit'+i}> <a  href={row.href} > {row.text} </a> </p>
      });
      let footerStyle = {
         textAlign: 'center'
      }
      return <footer style={footerStyle}> {creditP} </footer>;
   }

   render() {

     
      return (
     
         <div className="container">

            {this.renderError()}

            {/*!-- Title */}
            <div className="col-sm-12 text-center">
               <h2> Weather Web App </h2>
            </div>

            {/* Fail search */}

            {/* Search */}
            {this.renderSearch()}
            {/* Weather App */}
            <div className="row">
               <div className="col-sm-3"> </div>

               {this.renderWeather()}

               <div className="col-sm-3"> </div> 
            </div>

            <WeatherForcast forcasts={this.state.forcasts} units={this.state.units}/>

            {this.renderFooter()}

         </div>

      );
  }
}

export default App;
