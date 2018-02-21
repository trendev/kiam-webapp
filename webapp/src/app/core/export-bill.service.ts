import { Utils, BillsUtils } from '@app/shared';
import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { Professional, Bill, ClientBill, Address } from '@app/entities';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as moment from 'moment';

@Injectable()
export class ExportBillService {

  constructor(private authenticationService: AuthenticationService) { }

  exportClientBill(clientBill: ClientBill) {

    const customerDetails = [
      {
        text: `${clientBill.client.customerDetails.firstName} ${clientBill.client.customerDetails.lastName}`,
        bold: true
      },
      '\n',
      this.getAddress(clientBill.client.address),
      '\n',
      `N° Client : ${clientBill.client.id}`
    ];

    const dd = this.createPDF(clientBill, customerDetails);

  }

  private createPDF(bill: Bill, customerDetails: any) {
    const professional = new Professional(this.authenticationService.user);

    // docDefinition
    const dd = {
      content: [
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
        '\n\n\n',
        {
          table: {
            widths: ['*'],
            body: [
              [{
                text: `Facture ${BillsUtils.shrinkRef(bill.reference)}\n`,
                bold: true,
                alignment: 'center',
                fillColor: '#cccccc'
              }],
            ]
          }
        },
        '\n',
        `Référence : ${bill.reference}`,
        `Date de réalisation  : ${moment(bill.deliveryDate).locale('fr').format('L')}`,
        { text: `Facture réglée le : ${moment(bill.paymentDate).locale('fr').format('L')}`, bold: true }
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
