import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BehaviorSubject, concat, Observable, of, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,OnChanges {
  title = 'rxjs-operators';

  streamList: StreamModel[] = [];
  speed: number = 5000;

  subscription: Subscription | undefined;
  @ViewChild('streamRef')
  streamRef!: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
  ngOnInit(): void {
    this.onAddSteamClick()
  }

  onAddSteamClick() {
    this.streamList.push(this.createStream());
    this.subscription?.unsubscribe();
    this.subscription =  concat(...this.streams).subscribe(
      (a)=>{
        if (this.streamRef) {
          let marble = document.createElement('div')
          marble.className = 'marble ';
          marble.style.backgroundColor = a.color;
          marble.style.animationDuration = this.speed + 'ms';
          this.streamRef.nativeElement.append(marble);

          marble.addEventListener('animationend', () => {
            this.streamRef.nativeElement.removeChild(marble);
          })
        }
      }
    )
  }

  private createStream(name = `Stream ${this.streamList.length + 1}`, interval = 1000) {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    return new StreamModel(name, randomColor, interval);
  }

  public get streams(){
    return this.streamList.map(a=> a.getStream());
  }
}

export class StreamModel {
  private _subject: Subject<{color:string,type?:string}>;
  private _isComplete = false;
  public timer: any;
  private _renewSuject: Subject<any>;
  constructor(
    public name: string,
    public color: string,
    public interval: number,
  ) {
    this.name = name;
    this.color = color;
    this.interval = interval;
    this._subject = new Subject();
    this._renewSuject = new BehaviorSubject(null);
  }

  public getStream() {
    return this._subject.asObservable();
  }

  public startInterval(interval = 1000) {
    if (this._isComplete) {
      this.renewStream()
      this._isComplete=false;
    }
    this.timer = setInterval(() => {
      this._subject.next({
        color:this.color,
        type:'interval'
      });
    }, interval)

    console.log(`start interval`, `stream ${this.name}`);
  }

  public stopInterval() {
    clearInterval(this.timer);
    console.log(`stop interval`, this.timer);
  }

  public manualTrigger() {
    this._subject.next({
      color:this.color,
      type:'manual'
    });
  }

  public completeStream() {
    this.stopInterval();
    this._subject.complete();
    this._isComplete = true;
  }

  public renewStream() {
    this._subject = new Subject();
    this._renewSuject.next(null);
  }

  public get isStreamClosed() {
    return this._subject.closed;
  }

  public get streamRenewed$() {
    return this._renewSuject.asObservable();
  }
}
