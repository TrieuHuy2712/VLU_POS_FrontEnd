import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service';

import { NotificationService } from '../../../core/services/notification.service';
import { UtilityService } from '../../../core/services/utility.service';
import { MessageConstants } from '../../../core/common/message.constants';
import { SystemConstants } from '../../../core/common/system.constants';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-detail-data-synch',
  templateUrl: './detail-data-synch.component.html',
  styleUrls: ['./detail-data-synch.component.css']
})
export class DetailDataSynchComponent implements OnInit {
  public currentPOS:number;
  public orderDetails: any[];
  public entity: any;
  public totalAmount: number;
  public customer: any[];
  public orderId: number;
  public baseFolder: string = SystemConstants.BASE_API;
  public detailCustomerEntity: any = {
    Id: 0,
    FullName: 0
  };
  constructor(private utilityService: UtilityService,
    private _dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService) { }


  ngOnInit() {
    this.loadCustomers();
    this.currentPOS= parseInt(SystemConstants.current_POS);
    this.activatedRoute.params.subscribe((params: Params) => {
      this.orderId = params['id'];
      this.loadOrder(this.orderId);

      this.loadOrderDetail(this.orderId);
    });

  }
  public goBack() {
    this.utilityService.navigate('/main/order/index');
  }
  public loadCustomers() {
    this._dataService.get('/api/appUser/getlistAll').subscribe((response: any[]) => {
      this.customer = response;
    }, error => this._dataService.handleError(error));
  }
  public loadOrder(id: number) {
    this._dataService.get('/api/order/detail/' + id.toString()).subscribe((response: any) => {
      this.entity = response;
      console.log(this.entity);
      var checkCustomer = findingCustomer(this.customer, this.entity.CustomerId, 0, this.customer.length - 1);
      this.detailCustomerEntity.FullName = this.customer[checkCustomer].FullName;
    }, error => this._dataService.handleError(error));
  }

  public loadOrderDetail(id: number) {
    this._dataService.get('/api/order/getalldetails/' + id.toString()).subscribe((response: any[]) => {
      this.orderDetails = response;
      this.totalAmount = 0;
      for (var item of this.orderDetails) {
        this.totalAmount = this.totalAmount + (item.Quantity * item.Price);
      }
      console.log(this.totalAmount);
    }, error => this._dataService.handleError(error));
  }

  public exportToExcel() {
    this._dataService.get('/api/order/exportExcel/' + this.orderId.toString()).subscribe((response: any) => {
      console.log(response);
      window.open(this.baseFolder + response.Message);
    }, error => this._dataService.handleError(error));
  }

}
let findingCustomer = function (arr, x, start, end) {


  if (start > end) return false;
  let mid = Math.floor((start + end) / 2);
  if (arr[mid].Id == x) return mid;
  if (arr[mid].Id > x)
    return findingCustomer(arr, x, start, mid - 1);
  else
    return findingCustomer(arr, x, mid + 1, end);
} 
