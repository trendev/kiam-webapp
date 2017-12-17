import { ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';

export class NavigationUtils {
    static navigateToParent(route: ActivatedRouteSnapshot | ActivatedRoute): string {
        let url = '';
        let parent = route.parent;

        while (parent) {
            if (parent.url[0]) {
                url = `${parent.url[0].path}/${url}`;
            }
            parent = parent.parent || null;
        }
        return url;
    }
}
