import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service';

import { NotificationService } from '../../../core/services/notification.service';
import { UtilityService } from '../../../core/services/utility.service';
import { MessageConstants } from '../../../core/common/message.constants';
import { SystemConstants } from '../../../core/common/system.constants';
import { ModalDirective } from 'ngx-bootstrap/modal';
declare var moment: any;
@Component({
  selector: 'app-order-add',
  templateUrl: './order-add.component.html',
  styleUrls: ['./order-add.component.css']
})
export class OrderAddComponent implements OnInit {
  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  public entity: any = { Status: false };
  public sizeId: number = null;
  public colorId: number = null;
  public totalAmount: number = 0;
  public colors: any[];
  public sizes: any[];
  public products: any[];
  public currentPOS: number;
  public customerBonus: any[];
  public orderDetails: any[] = [];
  public detailEntity: any = {
    ProductID: 0,
    Quantity: 0,
    Price: 0,

  };
  public customer: any[];
  public detailCustomerEntity: any = {
    Id: 0,
    FullName: 0,
    BonusPoint: 0,
    UserName: 0,
    Email: 0,
    Address: 0,
    Avatar: 0,
    Gender: 0,
    BirthDay: 0,
    PhoneNumber: 0,
    Roles: 0,
    Status: 0,

  };


  constructor(private utilityService: UtilityService,
    private _dataService: DataService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.currentPOS = parseInt(SystemConstants.current_POS);
    this.loadCustomers();
  }
  /*Product quantity management */
  public showAddDetail() {
    this.loadProducts();
    this.addEditModal.show();
  }
  public loadProducts() {
    if (this.currentPOS == 0) {
      this._dataService.get('/api/product/getallparents').subscribe((response: any[]) => {
        this.products = response;
        console.log(this.products);
      }, error => this._dataService.handleError(error));
    } else {
      this._dataService.get('/api/POS'+this.currentPOS+'product/getallparents').subscribe((response: any[]) => {
        this.products = response;
        console.log(this.products);
      }, error => this._dataService.handleError(error));
    }
  }
  public loadCustomers() {
    this._dataService.get('/api/appUser/getlistAll').subscribe((response: any[]) => {
      this.customer = response;

      console.log(this.customer);
    }, error => this._dataService.handleError(error));
  }
  public modelChanged(selectedValue: string) {
    var checkProduct = findingProduct(this.products, selectedValue, 0, this.products.length - 1);
    this.detailEntity.Price = this.products[checkProduct].Price;

  }
  public getCustomerSelected(selectedValue: string) {
    this.entity.CustomerId = selectedValue;
    this._dataService.get('/api/appUser/detail/' + this.entity.CustomerId)
      .subscribe((response: any) => {
        this.customerBonus = response;
        console.log(this.customerBonus);
        this.detailCustomerEntity.BonusPoint = response.BonusPoint;
        this.detailCustomerEntity.Id = response.Id;
        this.detailCustomerEntity.FullName = response.FullName;
        this.detailCustomerEntity.UserName = response.UserName;
        this.detailCustomerEntity.Email = response.Email;
        this.detailCustomerEntity.Address = response.Address;
        this.detailCustomerEntity.Avatar = response.Avatar;
        this.detailCustomerEntity.Gender = response.Gender;
        this.detailCustomerEntity.BirthDay = response.BirthDay;
        this.detailCustomerEntity.PhoneNumber = response.PhoneNumber;
        this.detailCustomerEntity.Roles = response.Roles;
        this.detailCustomerEntity.Status = response.Status;
      });
  }


  public goBack() {
    this.utilityService.navigate('/main/order/index');
  }


  //Save change for modal popup
  public saveChanges(valid: boolean) {
    let validate = true;
    this.detailCustomerEntity.BirthDay = moment(new Date(this.detailCustomerEntity.BirthDay)).format('DD/MM/YYYY');
    if (this.entity.PaymentMethod == "BONUSPOINT") {
      if (this.totalAmount <= (this.detailCustomerEntity.BonusPoint * 100)) {
        this.detailCustomerEntity.BonusPoint = this.detailCustomerEntity.BonusPoint - this.totalAmount;
      } else {
        this.notificationService.printErrorMessage(MessageConstants.NOT_ENOUGH_MONEY);
        validate = false;
      }
    } else {
      this.detailCustomerEntity.BonusPoint = this.detailCustomerEntity.BonusPoint + (this.totalAmount / 1000);
    }
    if (validate == true) {
      this._dataService.put('/api/appUser/update', this.detailCustomerEntity)
        .subscribe((response: any) => {
        }, error => this._dataService.handleError(error));
      if (valid) {
        this.entity.Status = false;
        this.entity.OrderDetails = this.orderDetails;
        this._dataService.post('/api/POS'+this.currentPOS+'order/add', this.entity).subscribe((response: any) => {
          this.entity = response;
          this.utilityService.navigate('main/order/detail/' + response.ID);
          this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));

      }
    }

  }
  public saveOrderDetail(valid: boolean) {
    if (valid) {
      this.addEditModal.hide();
      this.detailEntity.Product = this.products.find(x => x.ID == this.detailEntity.ProductID);
      this.orderDetails.push(this.detailEntity);
      this.totalAmount += (this.detailEntity.Price * this.detailEntity.Quantity);
      this.detailEntity = {
        ProductID: 0,
        Quantity: 0,
        Price: 0
      };
    }
  }

  //Action delete
  public deleteDetail(item: any) {
    for (var index = 0; index < this.orderDetails.length; index++) {
      let orderDetail = this.orderDetails[index];
      if (orderDetail.ProductID == item.ProductID
        && orderDetail.ColorId == item.ColorId
        && orderDetail.SizeId == item.SizeId) {
        this.orderDetails.splice(index, 1);
      }
    }
  }
}
let findingProduct = function (arr, x, start, end) {


  if (start > end) return false;

  let mid = Math.floor((start + end) / 2);

  if (arr[mid].ID == x) return mid;
  if (arr[mid].ID > x)
    return findingProduct(arr, x, start, mid - 1);
  else

    return findingProduct(arr, x, mid + 1, end);
}

