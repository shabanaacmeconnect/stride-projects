import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { KanbanboardComponent } from './kanbanboard/kanbanboard.component';
import { CreatetaskComponent } from './createtask/createtask.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
    {
        path: 'list',
        component: ListComponent
    },
    {
        path: 'kanban',
        component: KanbanboardComponent
    },
    {
        path: 'create/:id',
        component: CreatetaskComponent
    },
    {
        path: 'edit/:id/:task_id',
        component: CreatetaskComponent
    },
    {
        path: 'view/:id/:task_id',
        component: OverviewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TasksRoutingModule { }
