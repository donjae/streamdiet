import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';

import { AppComponent } from './app.component';
import { CommentComponent } from './comment/comment.component';
import { NewsComponent } from './news/news.component';
import { RedditService } from './reddit/reddit.service';
import { EmitterService } from './reddit/emitter.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from './angular4-carousel';
import { MatButtonModule } from '@angular/material';
import { MatCardModule } from '@angular/material';
import { CommentCardComponent } from './comment/comment-card/comment-card.component'
@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    CarouselModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule
  ],
  declarations: [
    AppComponent,
    CommentComponent,
    NewsComponent,
    CommentCardComponent
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

