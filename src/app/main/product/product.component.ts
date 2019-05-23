
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service';

import { MessageConstants } from '../../core/common/message.constants';
import { SystemConstants } from '../../core/common/system.constants';
import { UploadService } from '../../core/services/upload.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  /*Declare modal */
  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  @ViewChild("thumbnailImage") thumbnailImage;
  /*Product manage */
  public baseFolder: string = SystemConstants.BASE_API;
  public entity: any;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public filterKeyword: string = '';
  public filterCategoryID: number;
  public currentPOS:number;
  public products: any[];
  public productCategories: any[];
  public checkedItems: any[];
 /*Product manage */
 public imageEntity: any = {};
 public productImages: any = [];
 @ViewChild('imageManageModal') public imageManageModal: ModalDirective;
 @ViewChild("imagePath") imagePath;
 public sizeId: number = null;
 public colorId: number = null;
 public colors: any[];
 public sizes: any[];
 /*Quantity manage */
 public quantityEntity: any = {};
 public productQuantities: any = [];

  constructor(public _authenService: AuthenService,
    private _dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService, private uploadService: UploadService) {
  }
  ngOnInit() {
    this.currentPOS= parseInt(SystemConstants.current_POS);
    console.log(this.currentPOS);
    this.search();
    this.loadProductCategories();

  }
  public createAlias() {
    this.entity.Alias = this.utilityService.MakeSeoTitle(this.entity.Name);
  }
  public search() {
    this._dataService.get('/api/product/getall?page=' + this.pageIndex + '&pageSize=' + this.pageSize + '&keyword=' + this.filterKeyword + '&categoryId=' + this.filterCategoryID)
      .subscribe((response: any) => {
        console.log(response);
        this.products = response.Items;
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
      }, error => this._dataService.handleError(error));
  }
  public reset() {
    this.filterKeyword = '';
    this.filterCategoryID = null;
    this.search();
  }
  //Show add form
  public showAdd() {
    this.entity = { Content: '' };
    this.addEditModal.show();
  }
  //Show edit form
  public showEdit(id: string) {
    this._dataService.get('/api/product/detail/' + id).subscribe((response: any) => {
      this.entity = response;
      this.addEditModal.show();
    }, error => this._dataService.handleError(error));
  }

  public delete(id: string) {
    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/product/delete', 'id', id).subscribe((response: any) => {
        this.notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
        this.search();
      }, error => this._dataService.handleError(error));
      this._dataService.delete('/api/POS1product/delete', 'id', id).subscribe((response: any) => {
      }, error => this._dataService.handleError(error));
      this._dataService.delete('/api/POS2product/delete', 'id', id).subscribe((response: any) => {
      }, error => this._dataService.handleError(error));
    });
  }

  private loadProductCategories() {
    this._dataService.get('/api/productCategory/getallhierachy').subscribe((response: any[]) => {
      this.productCategories = response;
    }, error => this._dataService.handleError(error));
  }
  //Save change for modal popup
  public saveChanges(valid: boolean) {
    if (valid) {
      let fi = this.thumbnailImage.nativeElement;
      if (fi.files.length > 0) {
        this.uploadService.postWithFile('/api/upload/saveImage?type=product', null, fi.files).then((imageUrl: string) => {
          this.entity.ThumbnailImage = imageUrl;
        }).then(() => {
          this.saveData();
        });
      }
      else {
        this.saveData();
      }
    }
  }
  private saveData() {
    this.entity.CreatedBy= SystemConstants.const_permission;
    if (this.entity.ID == undefined) {
      this._dataService.post('/api/product/add', this.entity).subscribe((response: any) => {
        this.search();
        this.addEditModal.hide();
        this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
      });
      this._dataService.post('/api/POS1product/add', this.entity).subscribe((response: any) => {
      });
      this._dataService.post('/api/POS2product/add', this.entity).subscribe((response: any) => {
      });
    }
    else {
      this._dataService.put('/api/product/update', this.entity).subscribe((response: any) => {
        this.search();
        this.addEditModal.hide();
        this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
      }, error => this._dataService.handleError(error));
      this._dataService.put('/api/POS1product/update', this.entity).subscribe((response: any) => {
      }, error => this._dataService.handleError(error));
      this._dataService.put('/api/POS2product/update', this.entity).subscribe((response: any) => {
      }, error => this._dataService.handleError(error));
    }
  }
  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.search();
  }

 public keyupHandlerContentFunction(e: any) {
    this.entity.Content = e;
  }
  public deleteMulti() {
    this.checkedItems = this.products.filter(x => x.Checked);
    var checkedIds = [];
    for (var i = 0; i < this.checkedItems.length; ++i)
      checkedIds.push(this.checkedItems[i]["ID"]);

    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/product/deletemulti', 'checkedProducts', JSON.stringify(checkedIds)).subscribe((response: any) => {
        this.notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
        this.search();
      }, error => this._dataService.handleError(error));
      this._dataService.delete('/api/POS1product/deletemulti', 'checkedProducts', JSON.stringify(checkedIds)).subscribe((response: any) => {
    
      }, error => this._dataService.handleError(error));
      this._dataService.delete('/api/POS2product/deletemulti', 'checkedProducts', JSON.stringify(checkedIds)).subscribe((response: any) => {
    
      }, error => this._dataService.handleError(error));
    });
  }
  /*Image management*/
  public showImageManage(id: number) {
    this.imageEntity = {
      ProductId: id
    };
    this.loadProductImages(id);
    this.imageManageModal.show();
  }

   public loadProductImages(id: number) {
    this._dataService.get('/api/productImage/getall?productId=' + id).subscribe((response: any[]) => {
      this.productImages = response;
    }, error => this._dataService.handleError(error));
  }
  public deleteImage(id: number) {
    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => {
      this._dataService.delete('/api/productImage/delete', 'id', id.toString()).subscribe((response: any) => {
        this.notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
        this.loadProductImages(this.imageEntity.ProductId);
      }, error => this._dataService.handleError(error));
    });
  }

  public saveProductImage(isValid: boolean) {
    if (isValid) {
      let fi = this.imagePath.nativeElement;
      if (fi.files.length > 0) {
        this.uploadService.postWithFile('/api/upload/saveImage?type=product', null, fi.files).then((imageUrl: string) => {
          this.imageEntity.Path = imageUrl;
          this._dataService.post('/api/productImage/add', this.imageEntity).subscribe((response: any) => {
            this.loadProductImages(this.imageEntity.ProductId);
            this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          });
        });
      }
    }
  }
  /*Quản lý số lượng */
  public showQuantityManage(id: number) {
    this.quantityEntity = {
      ProductId: id
    };
    this.loadProductQuantities(id);

  }

  public loadProductQuantities(id: number) {
    this._dataService.get('/api/productQuantity/getall?productId=' + id + '&sizeId=' + this.sizeId + '&colorId=' + this.colorId).subscribe((response: any[]) => {
      this.productQuantities = response;
    }, error => this._dataService.handleError(error));
  }

  public saveProductQuantity(isValid: boolean) {
    if (isValid) {
      this._dataService.post('/api/productQuantity/add', this.quantityEntity).subscribe((response: any) => {
        this.loadProductQuantities(this.quantityEntity.ProductId);
        this.quantityEntity = {
          ProductId: this.quantityEntity.ProductId
        };
        this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
      }, error => this._dataService.handleError(error));
    }
  }

   
}
