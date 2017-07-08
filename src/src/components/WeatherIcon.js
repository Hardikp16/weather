import React, { Component } from 'react';

class WeatherIcon extends Component {

	constructor(props) {
      super(props);

      this.state = {

      };
   }

   weatherTypetoIcon(index) {
      console.log(index);
      console.log("index");

      let weatherIcons = ["tornado", "day-storm-showers", "hurricane", "thunderstorm", "thunderstorm", 
         ["rain", "snow"], ["rain", "sleet"], ["snow", "sleet"], 
         "hail", "rain-mix", "hail", "showers", "showers", 
         "snow", " day-snow", "snow-wind", "snow", "hail", 
         "sleet", "dust", "fog", "windy", "smoke", "strong-wind", "windy", "snowflake-cold", 
         "cloudy", "night-cloudy", "day-cloudy",
         "night-alt-partly-cloudy", "day-cloudy-high", "night-clear", 
         "day-sunny", "night-partly-cloudy", "day-sunny-overcast", ["rain", "hail"], "hot",
         "thunderstorm", "thunderstorm", 
         "thunderstorm", "showers", "snow-wind",
         "snow-wind", "snow-wind", "cloud", 
         "thunderstorm", "snow", "thunderstorm", 
         "na"];


      return weatherIcons[parseInt(index, 10)];


   }

   // renderAllIcons(){
   //    // function to test all weatherIcon elements render correctly
   //    let WeatherIcons = ["tornado", "day-storm-showers", "hurricane", "thunderstorm", "thunderstorm", 
   //       ["rain", "snow"], ["rain", "sleet"], ["snow", "sleet"], 
   //       "hail", "rain-mix", "hail", "showers", "showers", 
   //       "snow", " day-snow", "snow-wind", "snow", "hail", 
   //       "sleet", "dust", "fog", "windy", "smoke", "strong-wind", "windy", "snowflake-cold", 
   //       "cloudy", "night-cloudy", "day-cloudy",
   //       "night-alt-partly-cloudy", "day-cloudy-high", "night-clear", 
   //       "day-sunny", "night-partly-cloudy", "day-sunny-overcast", ["rain", "hail"], "hot",
   //       "thunderstorm", "thunderstorm", 
   //       "thunderstorm", "showers", "snow-wind",
   //       "snow-wind", "snow-wind", "cloud", 
   //       "thunderstorm", "snow", "thunderstorm", 
   //       "na"];



   //    let AllIcons = WeatherIcons.map(function(iconOut, i){
   //       if(typeof(iconOut) === 'string') {
   //          return <div key={i}> {i} <i className={'wi wi-' + iconOut}> </i> </div>
   //       } else {
   //           let multiWeather = iconOut.map(function(iconIn, j){
   //             return  <i className={'wi wi-' + iconIn}> </i> 
   //          });
   //           return <div key={i}> {i}  {multiWeather} </div>
   //       }
   //    });

   //    return AllIcons;
   // }

   weatherIconElement(weatherIcon) {
      
      const wiClass = 'wi wi-';
      const oneIcon = {
         fontSize: '100px'
      }
      const twoIcon = {
         fontSize: '50px'
      }

      if(typeof(weatherIcon) === 'string') {
            return <div>  <i className={'wi wi-' + weatherIcon}> </i> </div>
      } else {
         let multiWeather = weatherIcon.map(function(iconIn, j){
            return  <i className={'wi wi-' + iconIn}> </i> 
         });
            return <div>  {multiWeather} </div>
      }
   }


   
	render() {

      let weatherIcon = this.weatherTypetoIcon((this.props.weatherType));
       const oneIcon = {
         fontSize: '100px'
      }

		return (
          <i className={'wi wi-' + weatherIcon} style={oneIcon}>  </i> 
      );
	}

}

export default WeatherIcon;