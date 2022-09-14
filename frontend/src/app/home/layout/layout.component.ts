import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Router } from '@angular/router';
import { tap, timer } from 'rxjs';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnDestroy {

  public mobileQuery: MediaQueryList;

  public fillerNav = [
    { path:'', title:'Accueil', icon:'home' },
    { path:'profile', title:'Profil', icon:'account_circle' },
    { path:'bookmarks', title:'Signets', icon:'bookmarks' },
  ];
  
  private _mobileQueryListener: () => void;

  constructor(
    private media: MediaMatcher,
    private changeDetectorRef: ChangeDetectorRef, 
    private authService: AuthService, 
    private router: Router, 
    
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change',this._mobileQueryListener);
  }

  logout():void {
    this.authService.logout();
    timer(1000).pipe(
      tap(() => this.router.navigate(['init/login']))
    ).subscribe();
  }

  
deleteAccount():void{
  this.authService.deleteUser().pipe(
    tap((res) =>{
      if(res){
        this.router.navigate(['/init/login']);
      }
    })
  ).subscribe();
}

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

}
