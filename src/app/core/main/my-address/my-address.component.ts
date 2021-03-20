import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AddressService } from './provider/address.service';

@Component({
  selector: 'app-my-address',
  templateUrl: './my-address.component.html',
  styleUrls: ['./my-address.component.scss']
})
export class MyAddressComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('search', {static: false}) searchElementRef: ElementRef;

  public latitude: number;
  public longitude: number;
  public zoom: number;
  isAddressFormState = false;
  subs = new Subscription();

  searchForm: FormGroup = new FormGroup({
    text: new FormControl(''),
    street: new FormControl(''),
    streetNumber: new FormControl(''),
    city: new FormControl(''),
    country: new FormControl(''),
    zip: new FormControl(''),
  });

  constructor(private ngZone: NgZone, private addressService: AddressService) {
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.addressService.startAutocompleteService(this.searchElementRef);
    this.addressChangedListener();
  }

  ngOnDestroy(): void {
    this.clearListeners();
    this.subs.unsubscribe();
  }

  clearListeners(): void {
    google.maps.event.clearInstanceListeners(this.addressService.autocompleteService);
  }

  switchForm(event): void {
    event.preventDefault();
    this.isAddressFormState = !this.isAddressFormState;

    setTimeout(() => {
      if (!this.isAddressFormState) {
        const newSearchText = `${this.searchForm.get('street').value} ${this.searchForm.get('city').value} ${this.searchForm.get('country').value}`;
        this.searchForm.get('text').setValue(newSearchText);
        this.clearListeners();
        this.addressService.startAutocompleteService(this.searchElementRef);
      }
    });

  }

  addressChangedListener(): void {
    this.subs.add(
      this.addressService.autocompleteInitialized.pipe(filter(autocomplete => autocomplete)).subscribe(autocomplete => {
        autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
            for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
              const componentType = component.types[0];
              switch (componentType) {
                case 'street_number': {
                  this.searchForm.get('streetNumber').setValue(component.long_name);
                  break;
                }
                case 'route': {
                  this.searchForm.get('street').setValue(`${component.long_name} ${this.searchForm.get('streetNumber').value}`);
                  break;
                }
                case 'postal_code': {
                  this.searchForm.get('zip').setValue(component.long_name);
                  break;
                }
                case 'locality':
                  this.searchForm.get('city').setValue(component.long_name);
                  break;
                case 'country':
                  this.searchForm.get('country').setValue(component.long_name);
                  break;
              }
            }
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.zoom = 12;
          });
        });
      })
    );
  }
}
