import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service';

import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageConstants } from '../../core/common/message.constants';
import { SystemConstants } from '../../core/common/system.constants';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TreeComponent } from 'angular-tree-component';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
  @ViewChild('addEditModal') public addEditModal: ModalDirective;

  @ViewChild(TreeComponent)
  private treeProductCategory: TreeComponent;
  public filter: string = '';
  public entity: any;
  public functionId: string;
  public _productCategoryHierachy: any[];
  public _productCategories: any[];
  public currentPOS:number;
  constructor(private _dataService: DataService,
    private notificationService: NotificationService,
    private utilityService: UtilityService) { }

  ngOnInit() {
    this.currentPOS= parseInt(SystemConstants.current_POS);
    this.search();
    this.getListForDropdown();
  }
  public createAlias() {
    this.entity.Alias = this.utilityService.MakeSeoTitle(this.entity.Name);
  }
  //Load data
  public search() {
    this._dataService.get('/api/productCategory/getall?filter=' + this.filter)
      .subscribe((response: any[]) => {
        this._productCategoryHierachy = this.utilityService.Unflatten2(response);
        this._productCategories = response;
      }, error => this._dataService.handleError(error));
  }
  public getListForDropdown() {
    this._dataService.get('/api/productCategory/getallhierachy')
      .subscribe((response: any[]) => {
        this._productCategories = response;
      }, error => this._dataService.handleError(error));
  }
  //Show add form
  public showAdd() {
    this.entity = {};
    this.addEditModal.show();
  }
  //Show edit form
  public showEdit(id: string) {
    this._dataService.get('/api/productCategory/detail/' + id).subscribe((response: any) => {
      this.entity = response;
      this.addEditModal.show();
    }, error => this._dataService.handleError(error));
  }

  //Action delete
  public deleteConfirm(id: string): void {
    this._dataService.delete('/api/productCategory/delete', 'id', id).subscribe((response: any) => {
      this.notificationService.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
      this.search();
    }, error => this._dataService.handleError(error));
    this._dataService.delete('/api/POS1productCategory/delete', 'id', id).subscribe((response: any) => {
    }, error => this._dataService.handleError(error));
    this._dataService.delete('/api/POS2productCategory/delete', 'id', id).subscribe((response: any) => {
    }, error => this._dataService.handleError(error));
  }
  //Click button delete turn on confirm
  public delete(id: string) {
    this.notificationService.printConfirmationDialog(MessageConstants.CONFIRM_DELETE_MSG, () => this.deleteConfirm(id));
  }
  //Save change for modal popup
  public saveChanges(valid: boolean) {
    if (valid) {
      if (this.entity.ID == undefined) {
        this._dataService.post('/api/productCategory/add', this.entity).subscribe((response: any) => {
          this.search();
          this.addEditModal.hide();
          this.notificationService.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
        }, error => this._dataService.handleError(error));
        this._dataService.post('/api/POS1productCategory/add', this.entity).subscribe((response: any) => {
        }, error => this._dataService.handleError(error));
        this._dataService.post('/api/POS2productCategory/add', this.entity).subscribe((response: any) => {
        }, error => this._dataService.handleError(error));
      }
      else {
        this._dataService.put('/api/productCategory/update', this.entity).subscribe((response: any) => {
          this.search();
          this.addEditModal.hide();
          this.notificationService.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
        }, error => this._dataService.handleError(error));
        this._dataService.put('/api/POS1productCategory/update', this.entity).subscribe((response: any) => {
        }, error => this._dataService.handleError(error));
        this._dataService.put('/api/POS2productCategory/update', this.entity).subscribe((response: any) => {
        }, error => this._dataService.handleError(error));
      }
    }

  }

  public onSelectedChange($event) {
    console.log($event);
  }
}