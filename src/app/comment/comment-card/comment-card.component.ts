import { Component, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
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
  <div>
    {{comment.body}}
  </div>
  `,
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnChanges{
  @Input('comment') comment:any;

  // @ViewChild('dataContainer') dataContainer: ElementRef;

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

  ngOnChanges() {
    // this.dataContainer.nativeElement.innerHTML = this.html;
    // console.log(this.html)
  }

}
