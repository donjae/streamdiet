import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';

import { AppComponent } from './app.component';
import { CommentComponent } from './comment/comment.component';
import { NewsComponent } from './news/news.component';
import { RedditService } from './reddit/reddit.service';
import { EmitterService } from './reddit/emitter.service';

// import { CarouselComponent, CarouselItemElement } from './carousel/carousel.component';
// import { CarouselItemDirective } from './carousel/carousel-item.directive';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'angular4-carousel';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    CarouselModule
    // BrowserAnimationsModule //carousel
  ],
  declarations: [
    AppComponent,
    CommentComponent,
    NewsComponent
    //
    // CarouselItemDirective,
    // CarouselItemElement
  ],
  providers: [
    RedditService,
    EmitterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

