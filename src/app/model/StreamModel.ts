import { BehaviorSubject, Subject } from 'rxjs';


export class StreamModel {
  private _subject: Subject<{ color: string; type?: string; }>;
  private _isComplete = false;
  public timer: any;
  private _renewSuject: Subject<any>;
  constructor(
    public name: string,
    public color: string,
    public interval: number
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
      this.renewStream();
      this._isComplete = false;
    }
    this.timer = setInterval(() => {
      this._subject.next({
        color: this.color,
        type: 'interval'
      });
    }, interval);

    console.log(`start interval`, `stream ${this.name}`);
  }

  public stopInterval() {
    clearInterval(this.timer);
    console.log(`stop interval`, this.timer);
  }

  public manualTrigger() {
    this._subject.next({
      color: this.color,
      type: 'manual'
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
