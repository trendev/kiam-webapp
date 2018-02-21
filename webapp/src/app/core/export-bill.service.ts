import { Utils, BillsUtils } from '@app/shared';
import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { Professional, Bill, ClientBill, Address, PurchasedOffering } from '@app/entities';

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
      this.buildAddress(clientBill.client.address),
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
                  stack: this.buildProfessionalDetails()
                },
                {
                  fillColor: '#dddddd',
                  stack: customerDetails
                }
              ]
            ]
          }
        },
        {
          text: `\nDate : ${moment(bill.issueDate).locale('fr').format('L LT')}`,
          bold: true,
          alignment: 'right'
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
                border: [false, false, false, false],
                fillColor: '#cccccc'
              }],
            ]
          }
        },
        '\n',
        `Référence : ${bill.reference}`,
        `Date de réalisation  : ${moment(bill.deliveryDate).locale('fr').format('L')}`,
        { text: `Facture réglée le : ${moment(bill.paymentDate).locale('fr').format('L')}`, bold: true },
        '\n',
        this.buildPurchasedOfferings(bill.purchasedOfferings),
        '\n',
        {
          columns: [
            {
              width: '*', text: ''
            },
            {
              width: 'auto', table: this.buildTotal(bill)
            }
          ]
        }
      ],
      styles: {
        poHeader: {
          // fontSize: 10,
          bold: true,
          fillColor: '#dddddd'
        },
        poFooter: {
          // fontSize: 10,
          fillColor: '#dddddd'
        },
        poContent: {
          fontSize: 10,
          // fillColor: '#dddddd'
        }
      },
    };

    pdfMake.createPdf(dd).download(`${bill.reference}.pdf`);
  }

  private buildProfessionalDetails(): any[] {
    const professional = new Professional(this.authenticationService.user);

    return [
      {
        text: `${professional.companyName}`,
        bold: true
      },
      `N° SIRET : ${professional.companyID}`,
      '\n',
      ...this.buildAddress(professional.address),
      '\n',
      `Dirigeant : ${professional.customerDetails.firstName} ${professional.customerDetails.lastName}`,
      `Tél. : ${Utils.formatPhoneNumber(professional.customerDetails.phone)}`,
      `Email : ${professional.email}`,
    ];
  }

  private buildAddress(address: Address): any[] {
    return [
      address.street,
      address.optional,
      address.postalCode,
      address.city]
      // remove undefined values
      .filter(e => !!e);
  }

  private buildPurchasedOfferings(purchasedOfferings: PurchasedOffering[]) {
    return {
      table: {
        widths: ['*', 'auto', 'auto', 'auto'],
        headerRows: 1,
        body: [
          [
            { text: 'Désignation des prestations/forfaits', alignment: 'left', style: 'poHeader' },
            { text: 'Qté.', alignment: 'center', style: 'poHeader' },
            { text: 'Prix HT (EUR)', alignment: 'center', style: 'poHeader' },
            { text: 'Montant HT (EUR)', alignment: 'center', style: 'poHeader' }
          ],
          ...purchasedOfferings.map(po => [
            { text: po.offeringSnapshot.name, alignment: 'left', style: 'poContent' },
            { text: po.qty, alignment: 'center', style: 'poContent' },
            { text: `${po.offeringSnapshot.price / 100}`, alignment: 'center', style: 'poContent' },
            { text: `${(po.offeringSnapshot.price * po.qty) / 100}`, alignment: 'center', style: 'poContent' }
          ]),
          [
            { text: 'TOTAL', alignment: 'left', style: 'poFooter', colSpan: 3 },
            {},
            {},
            {
              text: `${purchasedOfferings.map(po => po.qty * po.offeringSnapshot.price).reduce((a, b) => a + b, 0) / 100}`,
              alignment: 'center', style: 'poFooter'
            }
          ]
        ]
      }
    };
  }

  private buildTotal(bill: Bill) {
    const total = {
      body: [
        [
          { text: 'Réduction (EUR)', border: [false, false, false, false] },
          { text: `${bill.discount / 100}`, border: [false, false, false, false] }
        ],
        [
          { text: 'Total à régler HT (EUR)', bold: true, border: [false, false, false, false] },
          { text: `${bill.amount / 100}`, alignment: 'center', style: 'poHeader' }
        ],
        [
          {
            text: 'TVA non applicable, art. 293B du CGI',
            italics: true, colSpan: 2,
            fontSize: 10,
            border: [false, false, false, false]
          },
          {}
        ]
      ]
    };

    if (!bill.discount) {
      total.body.shift();
    }

    return total;
  }

}
