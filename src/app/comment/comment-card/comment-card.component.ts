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
  <mat-card-content class="comment-text">{{replaceHtmlEntites(comment.body)}}</mat-card-content>
  `,
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements AfterViewChecked{
  @Input('comment') comment:any;

  public replaceHtmlEntites(text){
    var translate_re = /&(nbsp|amp|quot|lt|gt);/g,
      translate = {
        'nbsp': String.fromCharCode(160),
        'amp': '&',
        'quot': '"',
        'lt': '<',
        'gt': '>'
      },
      translator = function($0, $1){
        return translate[$1];
      };

    return text.replace(translate_re, translator);
  }
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
