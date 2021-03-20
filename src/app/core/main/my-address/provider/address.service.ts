import {Injectable} from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import {BehaviorSubject} from 'rxjs';
import Autocomplete = google.maps.places.Autocomplete;

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  autocompleteService: Autocomplete;
  autocompleteInitialized = new BehaviorSubject(null);

  constructor(private mapsAPILoader: MapsAPILoader) {
  }

  startAutocompleteService(searchElementRef): void {
    this.mapsAPILoader.load().then(() => {
      this.autocompleteService = new google.maps.places.Autocomplete(searchElementRef.nativeElement, {
        types: ['address'],
      });
      this.autocompleteInitialized.next(this.autocompleteService);
    });
  }
}
