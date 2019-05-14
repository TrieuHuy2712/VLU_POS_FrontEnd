import { FilterOrderComponent } from './filter-order/filter-order.component';
import { DetailDataSynchComponent } from './detail-data-synch/detail-data-synch.component';
import { MainSynchComponent } from './main-synch.component';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: MainSynchComponent },
    { path: 'view', component: FilterOrderComponent },
    { path: 'detail/:id', component: DetailDataSynchComponent }
];
export const MainSynchRouter = RouterModule.forChild(routes);