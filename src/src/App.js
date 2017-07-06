import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import SearchInput from './components/SearchInput.js';

class App extends Component {

   constructor() {
      super();

      // state
      this.state = {
         latitude: '',
         longitude: '',
         apiKey: '850f83ef463a250b2288de67d144ab5f',
         isLoading: false,
         weatherInfoArray: [],
         weatherDesc: '',
         weatherCond: '',
         icon: '',
         fiveDayData: '',
      };

      this.setLatLng = this.setLatLng.bind(this);
   }

   setLatLng(latitude, longitude) {


      this.setState({
         latitude: latitude,
         longitude: longitude,
         isLoading: false
      });

      this.getTodaysWeather();
      this.getFiveDay();
   }

   resetLatLng() {

      this.setState({
         latitude: '',
         longitude: '',
      })
   }


   getTodaysWeather() {

      let parms ={
         lat: this.state.latitude,
         lon: this.state.longitude,
         appid: this.state.apiKey,
         units: 'Imperial'
      }


      $.ajax({url: 'http://api.openweathermap.org/data/2.5/weather',
               type: 'GET',
               data: parms,
               success: (rsp) => {
                  this.setWeatherData(rsp);
               },
               error: (rsp) => {
                  this.handleFailAjax(rsp);
               }
            });

   }

   getFiveDay() {

      let parms ={
         lat: this.state.latitude,
         lon: this.state.longitude,
         appid: this.state.apiKey,
         units: 'Imperial'
      }


      $.ajax({url: 'http://api.openweathermap.org/data/2.5/forecast',
               type: 'GET',
               data: parms,
               success: (rsp) => {
                  this.setState({fiveDayData: rsp.list});
                  // this.setWeatherData(rsp);
               },
               error: (rsp) => {

               }
            });
   }

   setWeatherData(data) {

      var weatherInfoArray = [];

      let weatherInfo = data.main;

      for( var type in weatherInfo) {
         let unit = '';
         if(type.includes('temp')){
            unit = 'F';
         } else if(type.includes('humidity')){
            unit = '%';
         } else if(type.includes('pressure')) {
            unit = 'hPa';
         }
         weatherInfoArray.push({type: type, data: weatherInfo[type], unit: unit});
      }


      this.setState({
         weatherInfoArray: weatherInfoArray,
         city: data.name,
         weatherCond: data.weather[0].main,
         weatherDesc: data.weather[0].description,
         icon: data.weather[0].icon+'.png',

      })
      console.log("setWeather ");
      console.log(data);
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
               <div className="col-sm-3"> </div>
               <div className="col-sm-6 text-center panel " style={panelColor}>
                     <SearchInput
                        setLatLng={this.setLatLng}
                     />
               </div>
               <div className="col-sm-3"> </div>
         </div>

      );


   }

   renderWeather() {

      if(this.state.weatherInfoArray.length === 0) {
         return null;
      }

      let panelColor = {
         background: 'rgb(230, 230, 230)'
      }

      let textStyle = {
         textAlign: 'left'
      };

      let weatherInfoDomStyle = {
         textAlign: 'left',
         paddingBottom: '50px'
      }


      let imgStyle = {
         width: '50%'
      };

      var content;
      var unit;
      let weatherInfoDom = this.state.weatherInfoArray.map(function(row, i){
         if(row.type.includes('temp')){
            content = row.type + ': ' + row.data 
            unit = <span> <sup>o</sup>{row.unit} </span>
         } else {
            content = row.type + ': ' + row.data ;
            unit = <span> {row.unit} </span>
         }

         return (<div key={i}> {content} {unit} </div>)
      });
        
      var imgSrc = 'http://openweathermap.org/img/w/' + this.state.icon;
      

         return(
               <div className="col-sm-6 col-xs-12 text-center panel" style={panelColor}>
                  <div>

                     {/* Weather Desc */}
                     <div style={textStyle}>
                        <div>
                           <h3>{this.state.city}</h3>
                        </div>
                        <div>
                          {this.state.weatherCond}
                        </div>
                        <div>
                           {this.state.weatherDesc}
                        </div>
                     </div>

                     <div className="row">
                        <div className="col-md-6 col-xs-8">
                           <img src={imgSrc} alt="today_weather" style={imgStyle}/>
                        </div>
                        <div className="col-md-6 col-xs-4" style={weatherInfoDomStyle}>
                           {weatherInfoDom}
                        </div>
                     </div>

                  </div>
               </div>
         );

   }

   renderFooter() {
      let creditArray = [{href: 'https://facebook.github.io/react/', text: 'React Framework'},
                        {href: 'https://github.com/kenny-hibino/react-places-autocomplete', text:'React Auto Complete Component'},
                        {href: 'https://openweathermap.org/', text: 'Weather API'},
                        {href: 'http://getbootstrap.com/', text: 'Bootstrap'},
                        {href: 'https://jquery.com/', text: 'jQuery for Ajax'}
                     ];


      let creditP = creditArray.map(function(row, i){
         return <p key={'credit'+i}> <a  href={row.href} > {row.text} </a> </p>
      });
      let footerStyle = {
         textAlign: 'center'
      }
      return <footer style={footerStyle}> {creditP} </footer>;
   }

   render(state) {

     
      return (
     
         <div className="container">

            {/*!-- Title */}
            <div className="col-sm-12 text-center">
               <h2> Weather Web App </h2>
            </div>

            {/* Fail search */}


            {/* Search */}
            {this.renderSearch(state)}
            {/* Weather App */}
            <div className="row">
               <div className="col-sm-3"> </div>

               {this.renderWeather(state)}

               <div className="col-sm-3"> </div> 
            </div>

            {this.renderFooter()}
            

         </div>

      );
  }
}

export default App;
