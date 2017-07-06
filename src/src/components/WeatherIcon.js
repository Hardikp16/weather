import React, { Component } from 'react';

class WeatherIcon extends Component {

	constructor() {
      super();

      this.state = {
      	hovered: false,
      };

   }

   weatherTypetoIcon(){

      return '';
   }

	render(props) {

      //this.weatherTypetoIcon(props.weatherType);
    
      let weatherIcon = {
         fontSize: '100px'
      }

		return(

          <i className="wi wi-night-sleet" style={weatherIcon} ></i>
			
      );
	}

}

export default WeatherIcon;