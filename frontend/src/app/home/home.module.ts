import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { FeedComponent } from './feed/feed.component';

import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import  { MatInputModule } from '@angular/material/input';
import  { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import {MatChipsModule} from '@angular/material/chips';

import { LayoutComponent } from './layout/layout.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { ProfileComponent } from './profile/profile.component';
import { DetailFeedComponent } from './detail-feed/detail-feed.component';
import { GetAmazonFilesPipe } from '../core/pipes/aws-s3.pipe';

@NgModule({
  declarations: [
    FeedComponent, 
    LayoutComponent, 
    BookmarksComponent, 
    ProfileComponent, 
    DetailFeedComponent,
    GetAmazonFilesPipe,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatTabsModule,
    MatChipsModule,
  ]
})
export class HomeModule { }
