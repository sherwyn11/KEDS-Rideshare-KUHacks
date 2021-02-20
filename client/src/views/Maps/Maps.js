/*global google*/
import React from "react";
import _ from 'lodash';
//import { DirectionsRenderer } from "react-google-maps";
import { compose, withProps, lifecycle } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,

} from "react-google-maps";
import { Fab } from "@material-ui/core";
import { LocalTaxi } from "@material-ui/icons";

const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

const Maps = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAUxSCFAa8dpHXlqjdMlRRvuQm1rbUUP7A&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `580px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap,

  lifecycle({
    componentDidMount() {
      const DirectionsService = new google.maps.DirectionsService();

      DirectionsService.route(
        {
          origin: new google.maps.LatLng(19.1217707406339, 72.83944134193857),
          destination: new google.maps.LatLng(19.17060002212831, 72.79517092313263),
          travelMode: google.maps.TravelMode.DRIVING
        },

        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.setState({
              directions: result,
              distance: result.routes[ 0 ].legs[ 0 ].distance.text,
              time: result.routes[ 0 ].legs[ 0 ].duration.text,
            });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    },

    componentWillMount() {
      const refs = {}

      this.setState({
        bounds: null,
        source: { lat: 19.1217707406339, lng: 72.83944134193857 },
        destination: { lat: 19.17060002212831, lng: 72.79517092313263 },
        center: {
          lat: 41.9, lng: -87.624
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        },
        onSourceBoxMounted: ref => {
          refs.sourceBox = ref;
        },
        onDestinationBoxMounted: ref => {
          refs.destinationBox = ref;
        },
        onSourcePlacesChanged: () => {
          const places = refs.sourceBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);


          let s = { lat: nextCenter.lat(), lng: nextCenter.lng() };
          this.setState({
            center: nextCenter,
            markers: nextMarkers,
            source: s
          });
          refs.map.fitBounds(bounds);
        },
        onDestinationPlacesChanged: () => {
          console.log(refs);
          const places = refs.destinationBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          console.log(nextCenter);
          let d = { lat: nextCenter.lat(), lng: nextCenter.lng() };
          this.state.getRoute(this.state.source, d);
          this.setState({
            center: nextCenter,
            markers: nextMarkers,
            destination: d,
          });

          refs.map.fitBounds(bounds);
        },
        getRoute: (source, destination) => {
          console.log('Source', source.lat, source.lng);
          console.log('Destination', destination.lat, destination.lng);
          const DirectionsService = new google.maps.DirectionsService();

          DirectionsService.route(
            {
              origin: new google.maps.LatLng(source),
              destination: new google.maps.LatLng(destination),
              travelMode: google.maps.TravelMode.DRIVING
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                console.log(result);
                localStorage.setItem('sourceLat', source.lat);
                localStorage.setItem('sourceLng', source.lng);
                localStorage.setItem('destinationLat', destination.lat);
                localStorage.setItem('destinationLng', destination.lng)
                localStorage.setItem('distance', result.routes[ 0 ].legs[ 0 ].distance.text);
                localStorage.setItem('time', result.routes[ 0 ].legs[ 0 ].duration.text);
                this.setState({
                  directions: result,
                  distance: result.routes[ 0 ].legs[ 0 ].distance.text,
                  time: result.routes[ 0 ].legs[ 0 ].duration.text,
                });
              } else {
                console.error(`error fetching directions ${result}`);
              }
            }
          );
        }
      });
    },
  })
)(props => (
  <GoogleMap defaultZoom={8} ref={props.onMapMounted} defaultCenter={{ lat: 72.77587292177071, lng: 18.89286755846978 }}>
    <SearchBox
      ref={props.onSourceBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onSourcePlacesChanged}
    >
      <input
        type="text"
        placeholder="Enter Source"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    <SearchBox
      ref={props.onDestinationBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onDestinationPlacesChanged}
    >
      <input
        type="text"
        placeholder="Enter Destination"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          marginLeft: '5px',
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    <Fab variant="extended"
      color="secondary"
      href="/admin/steps"
      style={{
        position: "absolute",
        right: "55px",
        bottom: "25px"
      }}
    >
      <LocalTaxi />
  Ride Now
</Fab>
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
));

export default Maps;