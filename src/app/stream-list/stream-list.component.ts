import { Component, Input, OnInit } from '@angular/core';
import { StreamModel } from "../model/StreamModel";

@Component({
  selector: 'app-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.scss']
})
export class StreamListComponent implements OnInit {

  @Input()
  streamList : StreamModel[] = [];

  @Input() speed : number = 1000;
  constructor() { }

  ngOnInit(): void {
  }

}
