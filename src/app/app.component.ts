import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { concat, exhaustAll, merge, Observable, of, Subscription } from 'rxjs';
import { StreamModel } from './model/StreamModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges {
  title = 'rxjs-operators';

  streamList: StreamModel[] = [];
  speed: number = 5000;

  subscription: Subscription | undefined;
  @ViewChild('streamRef')
  streamRef!: ElementRef;

  isListeningResult: boolean = false;
  operator = 'concat';
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
  ngOnInit(): void {
    this.onAddSteamClick()
  }

  onAddSteamClick() {
    this.streamList.push(this.createStream());

  }

  private createStream(name = `Stream ${this.streamList.length + 1}`, interval = 1000) {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    return new StreamModel(name, randomColor, interval);
  }

  public get streams() {
    return this.streamList.map(a => a.getStream());
  }

  getOperator() {
    switch (this.operator) {
      case 'concat':
        return concat;
      case 'merge':
        return merge;
      // case 'exhaustAll':
      //   return exhaustAll;
      default:
        return null
    }
  }

  subscribeCombination() {
    this.isListeningResult = true;
    const oper = this.getOperator();
    if (oper) {
      this.subscription = oper(...this.streams).subscribe(
        {
          next: (a) => {
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
          },
          complete: () => this.isListeningResult = false
        }
      )
    } else {
      alert('Invalid operator!!!')
    }
  }

  unSubscribeCombination() {
    this.isListeningResult = false;
    this.subscription?.unsubscribe();
  }
}


