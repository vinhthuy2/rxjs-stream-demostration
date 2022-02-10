import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { StreamModel } from 'src/app/app.component';

@Component({
  selector: 'app-stream-item',
  templateUrl: './stream-item.component.html',
  styleUrls: ['./stream-item.component.scss']
})
export class StreamItemComponent implements OnInit {
  @Input()
  stream!: StreamModel;

  @Input() speed: number = 1000;

  @ViewChild('streamRef')
  streamRef!: ElementRef;

  marble$!: Observable<any>;

  interval: number = 1000;
  intervalStarted: boolean = false;
  streamCompleted: boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.stream.streamRenewed$.subscribe(() => {
      this.marble$ = this.stream.getStream();
      this.marble$.subscribe({
        complete: () => {
          this.intervalStarted = false;
          this.streamCompleted = true;
        },
        next: () => {
          this.streamCompleted = false;
          if (this.streamRef) {
            let marble = document.createElement('div')
            marble.className = 'marble ' + this.stream.name.replace(' ', '');
            marble.style.backgroundColor = this.stream.color;
            marble.style.animationDuration = this.speed + 'ms';
            this.streamRef.nativeElement.append(marble);

            marble.addEventListener('animationend', () => {
              this.streamRef.nativeElement.removeChild(marble);
            })
          }
        }
      })
    })
  }

  onTriggerClicked() {
    console.log(this.marble$);
    this.stream.manualTrigger();
  }

  onStartInterval() {
    this.stream.startInterval(this.interval)
    this.intervalStarted = true;

  }

  onStopInterval() {
    this.stream.stopInterval()
    this.intervalStarted = false;
  }

  onCompleteClicked() {
    this.stream.completeStream();
  }

  onClearStream() {
    while ((<HTMLElement>this.streamRef.nativeElement).hasChildNodes()) {
      const lastChild = (<HTMLElement>this.streamRef.nativeElement).lastElementChild!;

      if (lastChild) {
        (<HTMLElement>this.streamRef.nativeElement).removeChild(lastChild);
      }
    }
  }
}
