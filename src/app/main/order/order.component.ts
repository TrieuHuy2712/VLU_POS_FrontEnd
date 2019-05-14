import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';

import { MessageConstants } from '../../core/common/message.constants';
import { SystemConstants } from '../../core/common/system.constants';
import { UploadService } from '../../core/services/upload.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { Router } from '@angular/router';

declare var moment: any;
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public currentPOS: number;
  public filterCustomerName: string = '';
  public filterCustomerNames: string = '';
  public filterStartDate: string = '';
  public filterPaymentStatus: string = '';
  public filterEndDate: string = '';
  public customer: string[] = [];
  public customerName: any = {
    CustomerID: 0,
    CustomerName: 0,
    CreatedDate: 0,
    OrderId: 0
  };
  public orderList: any[];
  public orders: any[];
  public dateOptions: any = {
    locale: { format: 'DD/MM/YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };

  constructor(public _authenService: AuthenService,
    private _dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService, private uploadService: UploadService) {
  }

  ngOnInit() {
    this.currentPOS= parseInt(SystemConstants.current_POS);
    this.search();
  }
  public search() {
    this.loadCustomersID();
    if(this.currentPOS!=0){
    this._dataService.get('/api/POS'+this.currentPOS+'order/getlistpaging?page=' + this.pageIndex
      + '&pageSize=' + this.pageSize + '&startDate=' + this.filterStartDate
      + '&endDate=' + this.filterEndDate + '&customerName=' + this.filterCustomerNames
      + '&paymentStatus=' + this.filterPaymentStatus)
      .subscribe((response: any) => {
        this.orders = response.Items;
        this.customer = [];
        console.log(this.orders);
        for (let i = 0; i < this.orders.length; i++) {
          for (let j = 0; j < this.orderList.length; j++) {
            if (this.orders[i].CustomerId == this.orderList[j].Id) {
              this.customerName.CustomerName = this.orderList[j].FullName;
              this.customerName.CreatedDate = this.orders[i].CreatedDate;
              this.customerName.OrderId = this.orders[i].ID;
              this.customer.push(this.customerName);
              this.customerName = {
                CustomerID: 0,
                CustomerName: 0,
                CreatedDate: 0,
                OrderId: 0
              };
            }
          }
        }
        console.log(this.customer);

        this.orderList = response.Items;
        this.pageIndex = response.PageIndex;

      }, error => this._dataService.handleError(error));
    }else{
      this._dataService.get('/api/order/getlistpaging?page=' + this.pageIndex
      + '&pageSize=' + this.pageSize + '&startDate=' + this.filterStartDate
      + '&endDate=' + this.filterEndDate + '&customerName=' + this.filterCustomerNames
      + '&paymentStatus=' + this.filterPaymentStatus)
      .subscribe((response: any) => {
        this.orders = response.Items;
        this.customer = [];
        console.log(this.orders);
        for (let i = 0; i < this.orders.length; i++) {
          for (let j = 0; j < this.orderList.length; j++) {
            if (this.orders[i].CustomerId == this.orderList[j].Id) {
              this.customerName.CustomerName = this.orderList[j].FullName;
              this.customerName.CreatedDate = this.orders[i].CreatedDate;
              this.customerName.OrderId = this.orders[i].ID;
              this.customer.push(this.customerName);
              this.customerName = {
                CustomerID: 0,
                CustomerName: 0,
                CreatedDate: 0,
                OrderId: 0
              };
            }
          }
        }
        console.log(this.customer);

        this.orderList = response.Items;
        this.pageIndex = response.PageIndex;

      }, error => this._dataService.handleError(error));
    }
  }

  public reset() {
    this.filterCustomerName = '';
    this.filterEndDate = '';
    this.filterStartDate = '';
    this.filterPaymentStatus = '';
    this.search();
  }

  public delete(id: string) {
    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/order/delete', 'id', id).subscribe((response: any) => {
        this.notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
        this.search();
      }, error => this._dataService.handleError(error));
    });
  }
  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.search();
  }
  public changeStartDate(value: any) {
    this.filterStartDate = moment(new Date(value.end._d)).format('DD/MM/YYYY');
  }
  public changeEndDate(value: any) {
    this.filterEndDate = moment(new Date(value.end._d)).format('DD/MM/YYYY');
  }
  public loadCustomersID() {
    this._dataService.get('/api/appUser/getlistAll').subscribe((response: any[]) => {
      this.orderList = response;
      console.log(this.orderList.length);
    }, error => this._dataService.handleError(error));
  }
}
