import { Professional } from './../entities/professional.model';
import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Business } from '@app/entities';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProfessionalBusinessesResolverService implements Resolve<Business[]> {
  constructor(private authenticationService: AuthenticationService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Business[] | Observable<Business[]> | Promise<Business[]> {
   const pro = new Professional(this.authenticationService.user);
   return Observable.of(pro.businesses);
  }

}
