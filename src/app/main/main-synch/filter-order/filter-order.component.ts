import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UtilityService } from '../../../core/services/utility.service';
import { AuthenService } from '../../../core/services/authen.service';

import { MessageConstants } from '../../../core/common/message.constants';
import { SystemConstants } from '../../../core/common/system.constants';
import { UploadService } from '../../../core/services/upload.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { Router } from '@angular/router';
declare var moment: any;

@Component({
  selector: 'app-filter-order',
  templateUrl: './filter-order.component.html',
  styleUrls: ['./filter-order.component.css']
})
export class FilterOrderComponent implements OnInit {
  public currentPOS: number;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public filterCustomerName: string = '';
  public filterCustomerNames: string = '';
  public filterStartDate: string = '';
  public filterPaymentStatus: string = '';
  public filterEndDate: string = '';
  public customer: string[] = [];
  public checkSlt: boolean;
  public checkedItems: any[];
  public backupItem: any[];
  public products: any[];
  public entity: any[];
  public checkbox: boolean;
  public customerName: any = {
    CustomerID: 0,
    CustomerName: 0,
    CreatedDate: 0,
    OrderId: 0,
    Status: false,
    Product:0
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
    this.backupItem = [];
    this.search();
    
  }
  public search() {
    this.loadCustomersID();
    this.loadProducts();
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
              this.customerName.Status = this.orders[i].Status;
              this.customer.push(this.customerName);
              this.customerName = {
                CustomerID: 0,
                CustomerName: 0,
                CreatedDate: 0,
                OrderId: 0,
                Status: false,
                Product:0,
              };
            }
          }
        }
        console.log(this.customer);

        this.orderList = response.Items;
        this.pageIndex = response.PageIndex;

      }, error => this._dataService.handleError(error));
  }
  checkUncheckAll(e) {
    if (e.target.checked == true) {
      for (let i = 0; i < this.orders.length; i++) {
        this.backupItem.push(this.orders[i]);
      }
    }
    else {
      for (var i = 0; i < this.customer.length; i++) {
        this.checkbox = false;
      }
      this.backupItem = [];
    }
    console.log(this.backupItem);
  }

  FieldsChange(e, id) {
    if (e.target.checked == true) {
      this._dataService.get('/api/POS'+this.currentPOS+'order/detail/' + id).subscribe((response: any) => {
        this.entity = response;
        console.log(response);
        for(let i=0;i < response.OrderDetails.length;i++){
            for(let k=0;k  < this.products.length;k++){
                if(this.products[k].ID==response.OrderDetails[i].ProductID){
                  response.OrderDetails[i].Product= this.products[k];
                }
            }
        }
        if (this.entity != null) {
          this.backupItem.push(response);
        }
        console.log(this.backupItem);
      }, error => this._dataService.handleError(error));
    } else {
      for (let i = 0; i < this.backupItem.length; i++) {
        if (this.backupItem[i].ID === id) {
          console.log(this.orders[i]);
          for (let j = i; j < this.backupItem.length; j++) {
            this.backupItem[j] = this.backupItem[j + 1];
          }
          this.backupItem.length--;
        }
      }
      console.log(this.backupItem);
    }

  }
  public createBackupItem() {

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
      this._dataService.delete('/api/POS'+this.currentPOS+'order/delete', 'id', id).subscribe((response: any) => {
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
  public loadProducts() {
    this._dataService.get('/api/product/getallparents').subscribe((response: any[]) => {
      this.products = response;
      console.log(this.products);
    }, error => this._dataService.handleError(error));
  }
  public saveData() {
    // this.backupItem.CreatedBy= SystemConstants.const_permission;
    for (let i = 0; i < this.backupItem.length; i++) {
      this.backupItem[i].Status = true;
      this._dataService.put('/api/POS'+this.currentPOS+'order/update', this.backupItem[i]).subscribe((response: any) => {
        this.search();
        console.log(response);
      });
      
      this._dataService.post('/api/order/add', this.backupItem[i]).subscribe((response: any) => {
      }, error => this._dataService.handleError(error));
      this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
    }
  }
}

