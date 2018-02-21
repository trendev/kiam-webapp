import { Utils } from './../shared/utils';
import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { Professional, Bill, ClientBill, Address } from '@app/entities';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class ExportBillService {

  constructor(private authenticationService: AuthenticationService) { }

  exportClientBill(clientBill: ClientBill) {

    const customerDetails = [
      {
        text: `${clientBill.client.customerDetails.firstName} ${clientBill.client.customerDetails.lastName}`,
        bold: true
      },
      `N° client : ${clientBill.client.id}`,
      '\n',
      this.getAddress(clientBill.client.address)
    ];

    const dd = this.createPDF(clientBill, customerDetails);

  }

  private createPDF(bill: Bill, customerDetails: any) {
    const professional = new Professional(this.authenticationService.user);

    // docDefinition
    const dd = {
      content: [
        // {
        //   alignment: 'justify',
        //   columns: [
        //     {
        //       stack: this.professionalDetails()
        //     },
        //     {
        //       stack: customerDetails
        //     }
        //   ],
        //   // optional space between columns
        //   columnGap: 10
        // },
        {
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                {
                  border: [false, false, false, false],
                  stack: this.professionalDetails()
                },
                {
                  fillColor: '#dddddd',
                  stack: customerDetails
                }
              ]
            ]
          }
        },
        '\n',
        {
          table: {
            widths: ['*'],
            body: [
              [{
                text: `Facture ${bill.reference}\n`,
                bold: true,
                alignment: 'center'
              }],
            ]
          }
        },
      ]
    };
    pdfMake.createPdf(dd).download(`${bill.reference}.pdf`);
  }

  private professionalDetails(): any[] {
    const professional = new Professional(this.authenticationService.user);

    return [
      {
        text: `${professional.companyName}`,
        bold: true
      },
      `N° SIRET : ${professional.companyID}`,
      '\n',
      ...this.getAddress(professional.address),
      '\n',
      `Dirigeant : ${professional.customerDetails.firstName} ${professional.customerDetails.lastName}`,
      `Tél. : ${Utils.formatPhoneNumber(professional.customerDetails.phone)}`,
      `Email : ${professional.email}`,
    ];
  }

  private getAddress(address: Address): any[] {
    return [
      address.street,
      address.optional,
      address.postalCode,
      address.city]
      // remove undefined values
      .filter(e => !!e);
  }

}
