import { DataSynchComponent } from './data-synch.component';
import { DetailDataSynchComponent } from './detail-data-synch/detail-data-synch.component';
import {FilterOrderComponent} from './filter-order/filter-order.component';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: DataSynchComponent },
    { path: 'view', component: FilterOrderComponent },
    { path: 'detail/:id', component: DetailDataSynchComponent }
];
export const DataSynchRouter = RouterModule.forChild(routes);