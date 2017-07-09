import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
import SearchInput from './components/SearchInput.js';
import WeatherIcon from './components/WeatherIcon.js';
import WeatherForcast from './components/WeatherForcast.js'
// import './css/weather-icons-wind.min.css';

class App extends Component {

   constructor() {

      super();
      // state
      this.state = {
         latitude: '',
         longitude: '',
         apiKey: '850f83ef463a250b2288de67d144ab5f',
         isLoading: false,
         weatherAtmosphere: [],
         todayWeather: {},
         weatherCond: '',
         city: '',
         forcasts: {},
         units:  {}
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

   convertMetricToImperical(){

   }

   getYahooApi(){
      return 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(SELECT%20woeid%20FROM%20geo.places%20WHERE%20text%3D%22(' +this.state.latitude +'%2C' +this.state.longitude+ ')%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
   }

   setLatLng(latitude, longitude) {

      this.setState({
         latitude: latitude,
         longitude: longitude,
         isLoading: false
      });

      this.getWeather();
   }

   resetLatLng() {

      this.setState({
         latitude: '',
         longitude: '',
      })
   }

   firstLetterUpper(string) {
      // if(string.length===0){
      //    return;
      // }
      // if(string.length==="")
      return string.charAt(0).toUpperCase() + string.substr(1);
   }


   getWeather() {

      let url = this.getYahooApi();

      $.ajax({url: url,
               type: 'GET',
               // data: parms,
               success: (rsp) => {
                  this.setWeatherData(rsp.query.results.channel);
               },
               error: (rsp) => {
                  this.handleFailAjax(rsp);
               }
      });

   }

   setWeatherData(data) {
      console.log(data);
      var weatherAtmosphere = [];

      let astronomy = data.astronomy;  // sunrise:"5:22 am"sunset:"8:29 pm"
      let atmosphere = data.atmosphere; //humidity:"61"pressure:"991.0"rising:"0"visibility:"16.1"
      let todayWeather = data.item.condition; // code:"27"date:"Thu, 06 Jul 2017 10:00 PM CDT"temp:"83"text:"Mostly Cloudy"
      let forcasts = data.item.forecast; //code:"30"date:"06 Jul 2017"day:"Thu"high:"91"low:"69"text:"Partly Cloudy"
      let city = data.location; // city:"Morton Grove"country:"United States"region:" IL"

      for( var type in atmosphere) {
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
      });
   }

   handleFailAjax(error){
      console.log(error);
   }

   renderSearch(){

      let panelColor = {
         background: 'rgb(230, 230, 230)'
      }

      return (
        
         <div className="row">
               <div className="col-sm-3 col-xs-1"> 
               </div>
               <div className="col-sm-6 col-xs-10 text-center panel " style={panelColor}>
                     <SearchInput setLatLng={this.setLatLng} />
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
      // let todayWeather = data.item.condition; // code:"27"date:"Thu, 06 Jul 2017 10:00 PM CDT"temp:"83"text:"Mostly Cloudy"


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
                     {this.renderTemp(todaysWeather.temp)}
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
                          {href: 'https://openweathermap.org/', text: 'Weather API'},
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
