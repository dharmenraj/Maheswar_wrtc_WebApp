import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "src/app/dashboard/dashboard.component";
import { MultiChatComponent } from "src/app/multi-chat/multi-chat.component";


const routes: Routes = [
  {
    path:'', component:DashboardComponent
  },
  {
    path:'chat', component:MultiChatComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
