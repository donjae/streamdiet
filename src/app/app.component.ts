import { Component, OnInit } from '@angular/core';
import { RedditService } from './reddit/reddit.service';
import { Http } from '@angular/http';
import { EmitterService } from './reddit/emitter.service'
// import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/mergeMap";
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-root',
  template: `
  <div class="wrapper">
    <div class="Grid Grid--cols-2">
      <div class="Grid-cell">
        <diet-news></diet-news>
      </div>
      <div class="Grid-cell2">
        <diet-comment></diet-comment>
      </div>
    </div>
 </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  // title: string;
  // domain: string;
  // author: string;
  // url: string;
  story: Object

  constructor(
    private redditService: RedditService,
    private http: Http,
    public emitterService: EmitterService
  ){
    let result = []
    let images = []
    let emitted = {stories: [], images: []}

    this.http.get('https://www.reddit.com/r/popular/hot.json')
      // Mergemap is required to merge nested object in array
      .mergeMap(response => response.json().data.children)
      .map(data => Object.keys(data).map(k => data[k]))
      .subscribe(
        (data)=>{
          emitted.stories.push(data[1]);
          // console.log(data[1])
          data[1].preview !== undefined ?  emitted.images.push(data[1].preview.images[0].source.url) : emitted.images.push(null)
          // images.push(data[1].preview.images[0].source.url)
        },
        (err)=>{
          console.log('Parsing Error: %s', err);
        },
        ()=>{
          // this.story = result[0]
          // console.log(result)
          // emitted.stories = result
          // emitted.images = images
          console.log(emitted)
          this.emitterService.newsEmitter.emit(emitted)
        });
  }

  ngOnInit(){
  }

}
