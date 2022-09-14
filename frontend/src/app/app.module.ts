import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { InterceptorsServices } from './core/interceptors/interceptors';
import { AuthGuard } from './core/guards/auth.guard';
import { GuestGuard } from './core/guards/guest.guard';
import { AuthService } from './core/services/auth/auth.service';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

export function AuthConfigFactory(authService: AuthService): () => Observable<boolean> {
  return () => authService.init();
}

const appRoutes: Routes = [
  { path: 'init', loadChildren: () => import('./login/login.module').then(e => e.LoginModule), canLoad:[GuestGuard] },
  { path: 'home', loadChildren: () => import('./home/home.module').then(e => e.HomeModule), canLoad:[AuthGuard] },
  { path: '', redirectTo:'home', pathMatch:'full'},
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule
  ],
  providers: [
    InterceptorsServices,
    {
      provide: APP_INITIALIZER,
      useFactory: AuthConfigFactory,
      deps: [AuthService],
      multi: true
  },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
