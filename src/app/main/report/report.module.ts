import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueComponent } from './revenue/revenue.component';
import { ReportRouter } from './report.routes';
import { ChartsModule } from 'ng2-charts';
import { Daterangepicker } from 'ng2-daterangepicker';
@NgModule({
  imports: [
    CommonModule,
    ReportRouter,
    ChartsModule,
    Daterangepicker
  ],
  declarations: [RevenueComponent]
})
export class ReportModule { }