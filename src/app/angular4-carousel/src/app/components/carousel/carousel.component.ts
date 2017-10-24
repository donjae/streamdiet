import { Component, OnInit, Input, OnDestroy, ViewChild, forwardRef } from '@angular/core';
import 'rxjs/add/operator/takeWhile';

import { CarouselService, ICarouselConfig, WindowWidthService } from '../../services';

import { PinsComponent } from './pins';
import { CarouselArrowsComponent } from './arrows';
import { CarouselHandlerDirective } from '../../directives';
import { MatButtonModule } from '@angular/material';

@Component({
  selector: 'carousel',
  template: `
  <div class="carousel-wrapper"
       appCarouselHandler (handleAutoplay)="onHandleAutoplay($event)">
    <div class="carousel-bg"
         *ngFor="let img of loadedImages; let i = index"
         [style.background-image]="img !== null ? 'url('+img+')' : 'url('+randomUrl+')'"
         [hidden]="i !== currentSlide">     
    </div>
    <div class="darken-overlay"
         *ngFor="let img of loadedImages; let i = index"
         [hidden]="i !== currentSlide">
    </div>
    <carousel-slide *ngFor="let img of loadedImages; let i = index"
         [src]="img"
         [slideNo]="i"
         [style.display]="i !== currentSlide ? 'none' : 'flex'">
    </carousel-slide>
    <!--<carousel-pins-->
      <!--*ngIf="galleryLength > 1"-->
      <!--[images]="loadedImages"-->
      <!--[currentSlide]="currentSlide"-->
      <!--(changeSlide)="onChangeSlideIndex($event);">-->
    <!--</carousel-pins>     -->
    <footer class="title"
     *ngFor="let story of stories; let s = index"
     [hidden]="s !== currentSlide">
     <span (click)="onNavigate(story.url)">{{story.title}}</span>
    </footer>
    <div class="button-wrapper"
     *ngIf="galleryLength > 1">
      <button mat-mini-fab class="arrow-btn-left" (click)="onChangeSlide('prev')">&lsaquo;</button>
      <button mat-mini-fab class="arrow-btn-right" (click)="onChangeSlide('next')">&rsaquo;</button>
    </div>
  </div>
`,
  styleUrls: ['assets/carousel.styles.scss']
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() private sources: string[];
  @Input() private stories: string[]
  @Input() private config: ICarouselConfig;

  @ViewChild(forwardRef(() => CarouselHandlerDirective)) private carouselHandlerDirective: CarouselHandlerDirective;
  @ViewChild(CarouselArrowsComponent) private carouselArrowsComponent: CarouselArrowsComponent;
  @ViewChild(PinsComponent) private pinsComponent: PinsComponent;

  private autoplayIntervalId;
  private preventAutoplay: boolean;

  public loadedImages: string[];
  public galleryLength: number;
  public currentSlide = 0;
  randomUrl = 'https://source.unsplash.com/1600x900'

  constructor(private carouselService: CarouselService,
              private windowWidthService: WindowWidthService) { }

  ngOnInit() {
    this.initData();
  }

  public initData() {
    this.galleryLength = this.sources.length;

    const [showImmediate, ...showWhenLoad] = this.sources;
    this.loadedImages = this.config.verifyBeforeLoad ? [showImmediate] : this.sources;

    if (this.galleryLength < 2) {
      return;
    }

    this.carouselService.init(showWhenLoad, this.config);

    this.carouselService.onImageLoad()
      .takeWhile(() => !!this.galleryLength)
      .subscribe(
        (image) => {
          console.log(image)
          this.loadedImages.push(image)
        }
      );

    if (this.config.autoplay) {
      this.config.autoplayDelay = this.config.autoplayDelay < 1000 ? 1000 : this.config.autoplayDelay;

      const minWidth = this.config.stopAutoplayMinWidth;

      this.windowWidthService.onResize(minWidth, true)
        .takeWhile(() => !!this.galleryLength)
        .subscribe(
        (isMinWidth) => {
          this.preventAutoplay = !isMinWidth;
          this.onHandleAutoplay(!this.config.autoplay);
        }
      );
    }
  }

  public onChangeSlide(direction: string): void {
    if (direction === 'prev') {
      this.currentSlide = this.currentSlide === 0 ? this.loadedImages.length - 1 : --this.currentSlide;
    } else {
      this.currentSlide = this.currentSlide === this.loadedImages.length - 1 ? 0 : ++this.currentSlide;
    }
    this.carouselHandlerDirective.setNewSlide(this.currentSlide, direction);
    // this.disableCarouselNavBtns();
  }

  public onChangeSlideIndex(index: number): void {
    if (index === this.currentSlide) {
      return;
    }

    const direction = index > this.currentSlide ? 'next' : 'prev';

    this.currentSlide = index;
    this.carouselHandlerDirective.setNewSlide(this.currentSlide, direction);
    // this.disableCarouselNavBtns();
  }

  public onHandleAutoplay(stopAutoplay): void {
    if (stopAutoplay || this.preventAutoplay) {
      clearInterval(this.autoplayIntervalId);
      return;
    }

    this.startAutoplay(this.config.autoplayDelay);
  }

  private startAutoplay(delay: number): void {
    this.autoplayIntervalId = setInterval(() => {
      this.onChangeSlide('next');
      this.pinsComponent.disableNavButtons();
      this.carouselArrowsComponent.disableNavButtons();
    }, delay);
  }

  private disableCarouselNavBtns(): void {
    if (!this.config.animation) {
      return;
    }

    this.carouselArrowsComponent.disableNavButtons();
    this.pinsComponent.disableNavButtons();
  }

  ngOnDestroy() {
    if (this.autoplayIntervalId) {
      clearInterval(this.autoplayIntervalId);
    }
  }

  onNavigate(url){
    window.open(url, "_blank");
  }
}
