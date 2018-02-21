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

  /**
   * Export a Client bill into PDF
   * @param clientBill the clientbill to export, must be closed/payed
   */
  exportClientBill(clientBill: ClientBill) {

    // Build the customer details part
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

  /**
   * Create a PDF from a Bill
   * @param bill the bill to convert
   * @param customerDetails the customer details part previously generated
   */
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
          // display the date when the bill was issued (date time)
          text: `\nDate : ${moment(bill.issueDate).locale('fr').format('L LT')}`,
          bold: true,
          alignment: 'right'
        },
        '\n\n\n',
        // display the bills shrinked reference
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
          // use columns attribute to align the total table on right
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

  /**
   * Build the professional details part
  */
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

  /**
   * Build an address detail and filter undefined value in order to avoid failures in pdfmake parsing
   * @param address the address to display
   */
  private buildAddress(address: Address): any[] {
    return [
      address.street,
      address.optional,
      address.postalCode,
      address.city]
      // remove undefined values
      .filter(e => !!e);
  }

  /**
   * Build the table of the purchased offerings
   * @param purchasedOfferings the purchased offerings of the Bill
   */
  private buildPurchasedOfferings(purchasedOfferings: PurchasedOffering[]) {
    return {
      table: {
        widths: ['*', 'auto', 'auto', 'auto'],
        headerRows: 1,
        body: [
          [ // header
            { text: 'Désignation des prestations/forfaits', alignment: 'left', style: 'poHeader' },
            { text: 'Qté.', alignment: 'center', style: 'poHeader' },
            { text: 'Prix HT (EUR)', alignment: 'center', style: 'poHeader' },
            { text: 'Montant HT (EUR)', alignment: 'center', style: 'poHeader' }
          ],
          // spread the content
          ...purchasedOfferings.map(po => [
            { text: po.offeringSnapshot.name, alignment: 'left', style: 'poContent' },
            { text: po.qty, alignment: 'center', style: 'poContent' },
            { text: `${po.offeringSnapshot.price / 100}`, alignment: 'center', style: 'poContent' },
            { text: `${(po.offeringSnapshot.price * po.qty) / 100}`, alignment: 'center', style: 'poContent' }
          ]),
          [
            // compute the total amount
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

  /**
   * Build the total part (discount, total amount...)
   * @param bill the bill to export
   */
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

    // clear the discount part if there is no discount in the bill
    if (!bill.discount) {
      total.body.shift();
    }

    return total;
  }

}
