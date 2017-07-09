import React, { Component } from 'react';
import WeatherIcon from './WeatherIcon.js';

class WeatherForcast extends Component {

	constructor(props) {
		super(props);
		
		this.state ={
			days: 5
		}
	}


	renderTemp(temp) {
      var style = {
         fontSize: '25px',
         paddingTop: '5px',
      }
      return <div style={style}> {temp}&deg;{this.props.units.temperature} </div>
   }

   renderForcast() {
     var forcasts = this.props.forcasts;

     if(Object.keys(forcasts).length === 0 && forcasts.constructor === Object) {
      return null;
     }



     var iconSize = '50';
     var	style ={
     		paddingTop: '10px',
     		paddingBottom: '10px'
   	}
	   let panelColor = {
         background: 'rgb(230, 230, 230)'
      }


     return forcasts.map(function(forcast,i) {
      	if(i===0 || i > this.state.days) {
         	return null;
      	}
      	return ( 
      		<div key={i} className="col-xs-4 col-sm-3 col-md-2 col-lg-2" style={panelColor}> 
               <div> {forcast.day} </div> 
               <div id={"weatherDesc"}> {forcast.text} </div>
               <div style={style}> <WeatherIcon weatherType={forcast.code} iconSize={iconSize} /> </div>
               <div> High {this.renderTemp(forcast.high)} Low {this.renderTemp(forcast.low)}  </div>
            </div>
      );
     }, this);
      // let forcast = data.item.forecast; //code:"30"date:"06 Jul 2017"day:"Thu"high:"91"low:"69"text:"Partly Cloudy"

   }

   render() {
   	
   	return (
   		<div className="row">
   		<div className="col-md-1 col-lg-1"> </div>
   			{this.renderForcast()}
			<div className="col-md-1 col-lg-1"> </div>
   		</div>
		);	

	}

}

export default WeatherForcast;