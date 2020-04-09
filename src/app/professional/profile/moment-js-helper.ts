import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Duration, DurationInputArg2 } from 'moment';

const moment = _rollupMoment || _moment;
import { StripePlan } from '@app/entities';

export class MomentJSHelper {
    private static computeDuration(plan: StripePlan): Duration {
        return moment.duration(plan.interval_count, plan.interval as DurationInputArg2);
    }

    static displayRenewalInterval(plan: StripePlan): string {
        moment.locale('fr');
        return MomentJSHelper.computeDuration(plan).humanize(true);
    }

    static displayRenewalUnit(plan: StripePlan): string {
        const locale = 'fr-subscribe';
        const options = {
            M: 'mois',
            y: 'an'
        };

        if (moment.locales().indexOf(locale) === -1) {
            moment.defineLocale(locale, {
                parentLocale: 'fr',
                relativeTime: options
            });
        } else {
            moment.updateLocale(locale, {
                relativeTime: options
            });
        }

        return MomentJSHelper.computeDuration(plan).humanize(false);
    }
}
