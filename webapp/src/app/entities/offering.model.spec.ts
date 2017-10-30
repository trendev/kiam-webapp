import { OfferingType } from './offering.model';
import { Pack } from './pack.model';
import { Service } from './service.model';

describe('Offering', () => {

    it('should create a Service', () => {
        const service = new Service({
            id: 1234,
            cltype: 'whatever',
            name: 'service-test',
            price: 1000,
            duration: 60,
            businesses: [
                { designation: 'Coiffure' },
                { designation: 'Esthétique' }
            ]
        });
        expect(service).toBeTruthy();
        expect(service.cltype).toBe(OfferingType.SERVICE);
        expect(service.hidden).toBeFalsy();
        console.log(service.toString());
    });

    it('should create a Pack with a Service', () => {
        const pack = new Pack({
            id: 1234,
            cltype: 'whatever',
            name: 'pack-test',
            price: 1000,
            duration: 60,
            businesses: [
                { designation: 'Coiffure' },
                { designation: 'Esthétique' }
            ],
            offerings: [
                {
                    id: 4321,
                    cltype: 'whatever',
                    name: 'service-test',
                    price: 1000,
                    duration: 60,
                    businesses: [
                        { designation: 'Coiffure' },
                        { designation: 'Esthétique' }
                    ]
                }
            ]
        });

        expect(pack).toBeTruthy();
        expect(pack.cltype).toBe(OfferingType.PACK);
        expect(pack.hidden).toBeFalsy();
        console.log(pack.toString());
    });
});
