import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectgridComponent } from './projectgrid/projectgrid.component';
import { ProjectlistComponent } from './projectlist/projectlist.component';
import { OverviewComponent } from './overview/overview.component';
import { CreateComponent } from './create/create.component';

const routes: Routes = [
    { path: '', redirectTo: 'list' },

    {
        path: 'grid',
        component: ProjectgridComponent
    },
    {
        path: 'list',
        component: ProjectlistComponent
    },
    {
        path: 'view/:id',
        component: OverviewComponent
    },
    {
        path: 'create',
        component: CreateComponent
    },
    {
        path: 'edit/:id',
        component: CreateComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectsRoutingModule {}
