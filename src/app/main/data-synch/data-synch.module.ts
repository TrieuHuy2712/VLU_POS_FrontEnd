import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSynchComponent } from './data-synch.component';
import { PaginationModule, ModalModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataService } from './../../core/services/data.service';
import { UtilityService } from './../../core/services/utility.service';
import { UploadService } from './../../core/services/upload.service';
import { Daterangepicker } from 'ng2-daterangepicker';
import { DataSynchRouter} from './data-synch-routes';
import { DetailDataSynchComponent } from './detail-data-synch/detail-data-synch.component';
import { Select2Module } from 'ng2-select2';
import { FilterOrderComponent } from './filter-order/filter-order.component';

@NgModule({
  imports: [
    CommonModule,
    DataSynchRouter,
    FormsModule,
    PaginationModule,
    Daterangepicker,
    ModalModule,
    Select2Module
  ],
  declarations: [DataSynchComponent, DetailDataSynchComponent, FilterOrderComponent],
  providers: [DataService, UtilityService, UploadService]
})
export class DataSynchModule { }
