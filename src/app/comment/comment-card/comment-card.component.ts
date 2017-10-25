import { Component, OnChanges, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { EmitterService } from '../../reddit/emitter.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import "rxjs/Rx";
import { Observable } from "rxjs";
import { Http } from '@angular/http';
import { MatCardModule } from '@angular/material';

@Component({
  selector: 'diet-comment-card',
  template: `
  <mat-card-title class="comment-author">{{comment.author}}</mat-card-title>
  <mat-card-content class="comment-text">{{comment.body}}</mat-card-content>
  `,
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements AfterViewChecked{
  @Input('comment') comment:any;


  // loadData(data) {

  // }

  constructor(
    private emitterService: EmitterService,
    private http: Http,
  ) {
    // this.dataContainer.nativeElement.innerHTML = this.html;
    // this.imageSources = data.images
    // this.image = this.sanitization.bypassSecurityTrustStyle('url('+ story.preview.images[0].source.url + ')')
  }

  ngAfterViewChecked() {
    // this.dataContainer.nativeElement.innerHTML = this.html;
    // console.log(this.html)
  }

}
