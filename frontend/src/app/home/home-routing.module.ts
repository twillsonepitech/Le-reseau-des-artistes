import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { DetailFeedComponent } from './detail-feed/detail-feed.component';
import { FeedComponent } from './feed/feed.component';
import { LayoutComponent } from './layout/layout.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path:'', component: LayoutComponent, 
  children:[
    { path:'', component:FeedComponent },
    { path:'bookmarks', component:BookmarksComponent },
    { path:'profile', component:ProfileComponent },
    { path:'feed/:feedId', component:DetailFeedComponent },
  ] 
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
