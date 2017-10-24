import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { CarouselService, WindowWidthService } from './services';

import {
  AppComponent,
  CarouselComponent,
  SlideComponent,
  CarouselArrowsComponent,
  PinsComponent
} from './components';

import { CarouselHandlerDirective } from './directives';

@NgModule({
  declarations: [
    AppComponent,
    CarouselComponent,
    SlideComponent,
    CarouselArrowsComponent,
    PinsComponent,
    CarouselHandlerDirective
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [CarouselComponent],
  providers: [CarouselService, WindowWidthService],
  bootstrap: [AppComponent]
})
export class CarouselModule { }
