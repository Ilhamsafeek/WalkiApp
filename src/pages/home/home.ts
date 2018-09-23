import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geofence } from '@ionic-native/geofence';

declare var google: any;

var image = {
  url: "assets/imgs/marker.png", // url
  scaledSize: new google.maps.Size(50, 50) // scaled size
  
};

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapRef: ElementRef;

  constructor(public navCtrl: NavController, public platform: Platform, private geofence: Geofence) {
    geofence.initialize().then(
      () => console.log('Geofence Plugin Ready'),
      (err) => console.log(err)
    );

    

    platform.ready().then(() => {
      this.getPlaces();
    });
  }

  getPlaces() {

      //Location -lat, long
      const location = new google.maps.LatLng(8.4884346,81.1718863);
      //map options
        
        const options = {
          center: location,
          zoom: 15,
          mapTypeId: 'roadmap',
          disableDefaultUI: true 
        }
      
        const map = new google.maps.Map(this.mapRef.nativeElement
          ,options);
    let service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: {lat: 8.4884346, lng: 81.1718863},
      radius: 500,
      type: ['restaurant']
    }, (results,status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          console.log(results[i].name);
          this.addGeofence(results[i].id, i+1, results[i].geometry.location.lat(), results[i].geometry.location.lng(), results[i].name, results[i].vicinity);
        }
      }
    });

    this.addMarker(location,map);
  }

 private addGeofence(id, idx, lat, lng, place, desc) {
    let fence = {
      id: id,
      latitude: lat,
      longitude: lng,
      radius: 50,
      transitionType: 1,
      notification: {
          id: idx,
          title: 'You crossed ' + place,
          text: desc,
          openAppOnClick: true
      }
    }

    
    this.geofence.addOrUpdate(fence).then(
       () => console.log('Geofence added'),
       (err) => console.log('Geofence failed to add')
     );
  }



  addMarker(position, map){
    
    return new google.maps.Marker({
      position,
      map,
      icon: image
    });
  }

  

}
