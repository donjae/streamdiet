import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';
// import "rxjs/add/operator/mergeMap";
// import 'rxjs/add/observable/of';


@Injectable()
export class EmitterService{
  constructor(
  ){}

  newsEmitter = new EventEmitter();
  widthEmitter = new EventEmitter();

}
