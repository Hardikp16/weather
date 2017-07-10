import React from 'react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

class Demo extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      address: '',
      error: null,
      loading: false
    }

    this.handleSelect = this.handleSelect.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSelect(address) {
    this.setState({
      address,
      loading: true
    })

    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {

        this.setState({
          loading: false
        });

        this.props.setLatLng(lat, lng);

      })
      .catch((error) => {
        console.log('Oh no!', error);

        this.setState({
          loading: false
        });

        var errorMsg = "There was an error with the google location request. Please try again later";
        this.props.setError(errorMsg);

      })
  }

  handleChange(address) {

    this.setState({
      address,
    })

  }


  render() {
    const cssClasses = {
      root: 'form-group',
      input: 'search-input',
      autocompleteContainer: 'Demo__autocomplete-container',
    }

    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div className="Demo__suggestion-item">
        <i className='fa fa-map-marker Demo__suggestion-icon'/>
        <strong>{formattedSuggestion.mainText}</strong>{' '}
        <small className="text-muted">{formattedSuggestion.secondaryText}</small>
      </div>)

    const inputProps = {
      type: "text",
      value: this.state.address,
      onChange: this.handleChange,
      autoFocus: true,
      placeholder: "Enter zip code, address, or city",
      name: 'input',
      id: "search-input-id",
    }

    const paddingStyle = {
      paddingTop: '12px',
    }

    return (
      <div style={paddingStyle}>
    
          <PlacesAutocomplete className={"input-group"}
            onSelect={this.handleSelect}
            autocompleteItem={AutocompleteItem}
            onEnterKeyDown={this.handleSelect}
            classNames={cssClasses}
            inputProps={inputProps}
          />
          {this.state.loading ? <div><i className="fa fa-spinner fa-pulse fa-3x fa-fw Demo__spinner" /></div> : null}
         
      </div>
    )
  }
}

export default Demo