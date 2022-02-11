import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StreamListComponent } from './stream-list/stream-list.component';
import { StreamItemComponent } from './stream-list/stream-item/stream-item.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBroom, faCompress, faPlay, faPlus, faPowerOff, faStop, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    AppComponent,
    StreamListComponent,
    StreamItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faPlay,
      faStop,
      faCompress,
      faPowerOff,
      faBroom,
      faTrashAlt,
      faPlus
    );
  }
}
