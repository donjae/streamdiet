import { Component, OnInit } from '@angular/core';
import { RedditService } from './reddit/reddit.service';
import { Http, Headers, RequestOptions } from '@angular/http';
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
  imageLink = []
  storiesArr = []


  constructor(
    private redditService: RedditService,
    private http: Http,
    public emitterService: EmitterService,
  ){
    let result = []
    let images = []
    let emitted = {stories: [], images: []}
    let imgur = /imgur/i


    this.http.get('https://www.reddit.com/r/popular/hot.json')
      // Mergemap is required to merge nested object in array
      .mergeMap(response => response.json().data.children)
      .map(data => Object.keys(data).map(k => data[k]))
      .subscribe(
        (data)=>{
          // emitted.stories.push(data[1]);
          // console.log(data[1])
          if(imgur.test(data[1].domain)){
            this.crawlImgur(data[1].url, data[1])
          }
          else if(data[1].preview !== undefined && !imgur.test(data[1].domain)){
            this.imageLink.push(data[1].preview.images[0].source.url)
            this.storiesArr.push(data[1])
          }
          else{
            this.imageLink.push(null)
            this.storiesArr.push(data[1])
          }
        },
        (err)=>{
          console.log('Parsing Error: %s', err);
        },
        ()=>{
          // this.story = result[0]
          // console.log(result)
          // emitted.stories = result
          emitted.images = this.imageLink
          emitted.stories = this.storiesArr
          console.log(emitted)
          this.emitterService.newsEmitter.emit(emitted)
        });



  }

  ngOnInit(){
  }

  //dont need to retain order

  crawlImgur(url: string, story){

    let hashRe = /^https?:\/\/(?:i\.|m\.|edge\.|www\.)*imgur\.com\/(?:r\/\w+\/)*(?!gallery)(?!removalrequest)(?!random)(?!memegen)((?:\w{5}|\w{7})(?:[&,](?:\w{5}|\w{7}))*)(?:#\d+)?[a-z]?(\.(?:jpe?g|gifv?|png))?(\?.*)?$/i;
    //for imgur galleries
    let galleryHashRe = /^https?:\/\/(?:m\.|www\.)?imgur\.com\/gallery\/(\w+)(?:[/#]|$)/i;
    //for imgur albums (concatendated imgur albums were removed)
    let albumHashRe = /^https?:\/\/(?:m\.|www\.)?imgur\.com\/a\/(\w+)(?:[/#]|$)/i;
    let imgArray = []
    let imgurSplit = null;
    let headers = new Headers();


    headers.append('Authorization', 'Client-Id 1d8d9b36339e0e2');

    if (imgurSplit = (galleryHashRe.exec(url))) {
      // console.log(imgurSplit[3])
      this.http.get('https://api.imgur.com/3/gallery/' + imgurSplit[1], {headers: headers})
        .map(data => data.json().data)
        .subscribe(image => {
          if (['image/png', 'image/jpeg'].includes(image.type)) {
            this.imageLink.push(image.link)
          } else {
            this.imageLink.push('http://i.imgur.com/' + image.id + 'h.jpg')
          }
        },
          (err)=>{},
          ()=>{
            this.storiesArr.push(story);
          })
    }

    else if (imgurSplit = albumHashRe.exec(url)) {
      // console.log(imgurSplit[3] + ' ' + imgurSplit[1])
      this.http.get('https://api.imgur.com/3/album/' + imgurSplit[1], {headers: headers})
        .map(data => data.json().data)
        .subscribe(image => {
          if (['image/png', 'image/jpeg'].includes(image.type)) {
            this.imageLink.push(image.link)
          } else {
            this.imageLink.push('http://i.imgur.com/' + image.id + 'h.jpg')
          }
        },
          (err)=>{},
          ()=>{
            this.storiesArr.push(story);
          })
    }

    else if (imgurSplit = hashRe.exec(url)) {
      this.http.get('https://api.imgur.com/3/image/' + imgurSplit[1], {headers: headers})
        .map(data => data.json().data)
        .subscribe(image => {
          if (['image/png', 'image/jpeg'].includes(image.type)){
            this.imageLink.push(image.link)
          } else {
            this.imageLink.push('http://i.imgur.com/' + image.id + 'h.jpg')
          }
        },
      (err)=>{},
      ()=>{
        this.storiesArr.push(story);
      })
    } else{
      this.imageLink.push(url)
      this.storiesArr.push(story)
    }

  }

}

