import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BusinessService } from './business.service';
import { Injectable } from '@angular/core';
import { Business } from '@app/entities';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BusinessesResolverService implements Resolve<Business[]> {
  constructor(private businessService: BusinessService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Business[] | Observable<Business[]> | Promise<Business[]> {
    return this.businessService.businesses;
  }

}
