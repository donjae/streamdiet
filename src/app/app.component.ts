import { Component, OnInit } from '@angular/core';
import { RedditService } from './reddit/reddit.service';
import { Http, Headers } from '@angular/http';
import { EmitterService } from './reddit/emitter.service'
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
      <div class="Grid-cell2" #chatWindow [scrollTop]="chatWindow.scrollHeight">
        <diet-comment></diet-comment>
      </div>
    </div>
 </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  story: Object
  imageLink = []
  storiesArr = []
  commentUrl = []


  constructor(private redditService: RedditService,
              private http: Http,
              public emitterService: EmitterService,) {
    let result = []
    let images = []
    let emitted = {stories: [], images: [], commentUrl: []}
    let imgur = /imgur/i
    let gfycat = /gfycat/i
    let streamable = /streamable/i
    let giphy = /giphy/i


    this.http.get('https://www.reddit.com/r/popular/hot.json')
      .mergeMap(response => response.json().data.children)
      .map(data => Object.keys(data).map(k => data[k]))
      .subscribe(
        (data)=> {
          if (imgur.test(data[1].domain)) {
            this.crawlImgur(data[1].url, data[1], data[1].permalink)
          }
          else if (gfycat.test(data[1].domain)) {
            this.crawlGfycat(data[1].url, data[1], data[1].permalink)
          }
          else if (streamable.test(data[1].domain)) {
            this.crawlStreamable(data[1].url, data[1], data[1].permalink)
          }
          else if (giphy.test(data[1].domain)) {
            this.crawlGiphy(data[1].url, data[1], data[1].permalink)
          }
          else if (data[1].preview !== undefined && !imgur.test(data[1].domain)) {
            this.imageLink.push(data[1].preview.images[0].source.url)
            this.storiesArr.push(data[1])
            this.commentUrl.push(data[1].permalink)
          }
          else {
            this.imageLink.push(null)
            this.storiesArr.push(data[1])
            this.commentUrl.push(data[1].permalink)
          }
        },
        (err)=> {
          console.log('Parsing Error: %s', err);
        },
        ()=> {
          emitted.images = this.imageLink
          emitted.stories = this.storiesArr
          emitted.commentUrl = this.commentUrl
          console.log(emitted)
          this.emitterService.newsEmitter.emit(emitted)
        });


  }

  ngOnInit() {
  }

  crawlImgur(url: string, story, permalink) {

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
          (err)=> {
          },
          ()=> {
            this.storiesArr.push(story);
            this.commentUrl.push(permalink)
          })
    }

    else if (imgurSplit = albumHashRe.exec(url)) {
      this.http.get('https://api.imgur.com/3/album/' + imgurSplit[1], {headers: headers})
        .map(data => data.json().data)
        .subscribe(image => {
            if (['image/png', 'image/jpeg'].includes(image.type)) {
              this.imageLink.push(image.link)
            } else {
              this.imageLink.push('http://i.imgur.com/' + image.id + 'h.jpg')
            }
          },
          (err)=> {
          },
          ()=> {
            this.storiesArr.push(story);
            this.commentUrl.push(permalink)
          })
    }

    else if (imgurSplit = hashRe.exec(url)) {
      this.http.get('https://api.imgur.com/3/image/' + imgurSplit[1], {headers: headers})
        .map(data => data.json().data)
        .subscribe(image => {
            if (['image/png', 'image/jpeg'].includes(image.type)) {
              this.imageLink.push(image.link)
            } else {
              this.imageLink.push('http://i.imgur.com/' + image.id + 'h.jpg')
            }
          },
          (err)=> {
          },
          ()=> {
            this.storiesArr.push(story);
            this.commentUrl.push(permalink)
          })
    }
    else {
      this.imageLink.push(url)
      this.storiesArr.push(story)
      this.commentUrl.push(permalink)
    }

  }

  crawlGfycat(url: string, story, permalink) {
    let gifSplit

    if (gifSplit = (/[^((https|http)?(:\/\/)?(?:i\.|m\.|edge\.|www\.|thumbs\.)*gfycat\.com\/(?:detail\/))].+?(?=\?)/g).exec(url)) {
      this.http.get('https://api.gfycat.com/v1test/gfycats/' + gifSplit[0])
        .map(data => data.json())
        .subscribe(
          res => {
            this.imageLink.push(res.gfyItem.thumb360PosterUrl)
          },
          (err)=> {
          },
          ()=> {
            this.storiesArr.push(story);
            this.commentUrl.push(permalink)
          })
    } else {
      let gfyId = url.split('/').pop().split('-')[0]
      this.http.get('https://api.gfycat.com/v1test/gfycats/' + gfyId)
        .map(data => data.json())
        .subscribe(
          res => {
            this.imageLink.push(res.gfyItem.thumb360PosterUrl)
          },
          (err)=> {
          },
          ()=> {
            this.storiesArr.push(story);
            this.commentUrl.push(permalink)
          })
    }
  }

  crawlStreamable(url: string, story, permalink) {
    var streamableId = url.substr(url.lastIndexOf('/') + 1);

    if (streamableId) {
      this.http.get('https://api.streamable.com/videos/' + streamableId)
        .map(data => data.json())
        .subscribe(
          res => {
            this.imageLink.push(res.files.mp4.url)
          },
          (err)=> {
          },
          ()=> {
            this.storiesArr.push(story);
            this.commentUrl.push(permalink)
          })
    }
  }

  crawlGiphy(url: string, story, permalink){
    let giphyId

    if (giphyId = /^https?:\/\/((?:i\.|media\.)?giphy\.com\/media\/([^/\n]+)\/giphy\.gif|i\.giphy\.com\/([^/\n]+)\.gif|giphy\.com\/gifs\/(?:.*-)?([^/\n]+))/.exec(url)) {
      let res = giphyId.filter((val)=>{
        return val !== undefined;
      })
      this.imageLink.push('https://i.giphy.com/' + res.pop() + '.webp')
      this.storiesArr.push(story);
      this.commentUrl.push(permalink)
    }
  }
}

