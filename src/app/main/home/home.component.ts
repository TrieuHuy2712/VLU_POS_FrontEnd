import { Component, OnInit } from '@angular/core';
import {SystemConstants} from '../../core/common/system.constants'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public currentPOS:number;
  constructor() { }

  ngOnInit() {
    this.currentPOS= parseInt(SystemConstants.current_POS);
  }

}
