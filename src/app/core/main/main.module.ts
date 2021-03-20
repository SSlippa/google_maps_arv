import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { InputTextModule } from 'primeng/inputtext';

import { environment } from '../../../environments/environment';
import { MyAddressComponent } from './my-address/my-address.component';
import { AddressService } from './my-address/provider/address.service';
import { MainComponent } from './main.component';

export const mainRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'address', pathMatch: 'full' },
      { path: 'address', component: MyAddressComponent }
    ]
  }
];


@NgModule({
  declarations: [MyAddressComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(mainRoutes),
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMaps.accessToken,
      libraries: ['places']
    }),
    InputTextModule,
    ReactiveFormsModule
  ],
  providers: [AddressService]
})
export class MainModule { }
