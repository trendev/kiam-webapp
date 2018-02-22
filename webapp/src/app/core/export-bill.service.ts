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
          text: `\nDate de la facture : ${moment(bill.issueDate).locale('fr').format('L LT')}`,
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
        `Date de réalisation : ${moment(bill.deliveryDate).locale('fr').format('L')}`,
        '\n',
        this.buildPurchasedOfferings(bill.purchasedOfferings),
        '\n\n\n',
        {
          // use columns attribute to align the total table on right
          columns: [
            {
              width: '*', text: ''
            },
            {
              width: 'auto', table: this.buildTotalPart(bill)
            }
          ]
        },
        '\n\n\n',
        this.buildPayments(bill)
      ],
      styles: {
        header: {
          // fontSize: 10,
          bold: true,
          fillColor: '#dddddd'
        },
        footer: {
          fontSize: 10,
          fillColor: '#dddddd'
        },
        smaller: {
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
      { text: `N° SIRET : ${professional.companyID}`, style: 'smaller' },
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
        widths: [280, 'auto', 'auto', '*'],
        headerRows: 1,
        body: [
          [ // header
            { text: 'Désignation des prestations / forfaits', alignment: 'left', style: 'header' },
            { text: 'Qté.', alignment: 'center', style: 'header' },
            { text: 'Prix HT (EUR)', alignment: 'center', style: 'header' },
            { text: 'Montant HT (EUR)', alignment: 'center', style: 'header' }
          ],
          // spread the purchased offerings content
          ...purchasedOfferings.map(po => [
            { text: po.offeringSnapshot.name, alignment: 'left', style: 'smaller' },
            { text: po.qty, alignment: 'center', style: 'smaller' },
            { text: `${po.offeringSnapshot.price / 100}`, alignment: 'center', style: 'smaller' },
            { text: `${(po.offeringSnapshot.price * po.qty) / 100}`, alignment: 'center', style: 'smaller' }
          ]),
          [
            // compute the total amount
            { text: 'Total', alignment: 'left', style: 'footer', colSpan: 3 },
            {}, // add empty cell for spaning
            {}, // add empty cell for spaning
            {
              text: `${purchasedOfferings.map(po => po.qty * po.offeringSnapshot.price).reduce((a, b) => a + b, 0) / 100}`,
              alignment: 'center', style: 'footer'
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
  private buildTotalPart(bill: Bill) {
    const total = {
      body: [
        [
          { text: 'Réduction (EUR)', border: [false, false, false, false] },
          { text: `${bill.discount / 100}`, border: [false, false, false, false], alignment: 'right' }
        ],
        this.buildTotalDetails(bill),
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

  /**
   * Build the details of the bill sum up
   * @param bill the bill to export
   */
  private buildTotalDetails(bill: Bill) {
    if (bill.amount >= 0) {
      return [
        {
          text: 'Total à régler HT (EUR)',
          fillColor: '#dddddd',
          bold: true, border: [false, false, false, false]
        },
        { text: `${bill.amount / 100}`, style: 'header', alignment: 'right' }
      ];
    } else { // it's a credit
      return [
        {
          text: 'Avoir HT (EUR)',
          fillColor: '#dddddd',
          bold: true, border: [false, false, false, false]
        },
        { text: `${-bill.amount / 100}`, style: 'header', alignment: 'right' }
      ];
    }
  }


  private buildPayments(bill: Bill) {
    if (bill.paymentDate) {
      return this.buildPaymentsDone(bill);
    }
  }

  /**
   * Build the payment part if the bill is closed and payed
   * @param bill the bill to export
   */
  private buildPaymentsDone(bill: Bill) {
    return {
      table: {
        body: [
          [
            {
              text: `Facture soldée le : ${moment(bill.paymentDate).locale('fr').format('L')}`,
              bold: true,
              fillColor: '#eeeeee',
              // border: [false, false, false, false]
            }
          ],
          [this.getPaymentsDetails(bill)]
        ]
      }
    };
  }

  /**
   * Build the payment details
   * @param bill the bill to export
   */
  private getPaymentsDetails(bill: Bill) {
    if (bill.payments && bill.payments.length) {
      return {
        table: {
          widths: ['*', 'auto'],
          border: [false, false, false, false],
          body: [
            [{
              // correct plurials
              text: `Paiement${bill.payments.length > 1 ? 's' : ''} (EUR) :`,
              colSpan: 2,
              border: [false, false, false, false],
              // style: 'smaller'
            },
            {} // add empty cell for spaning
            ],
            // spread the content
            ...bill.payments.map(p => [
              {
                text: p.paymentMode.name,
                alignment: 'left',
                border: [false, false, false, false],
                style: 'smaller'
              },
              {
                text: `${p.amount / 100}`,
                alignment: 'right',
                border: [false, false, false, false],
                style: 'smaller'
              }
            ]),
          ]
        },
        fillColor: '#eeeeee',
        border: [false, false, false, false]
      };
    } else {
      // no payment found
      return {
        text: `Aucun paiement`,
        fillColor: '#eeeeee',
        border: [false, false, false, false],
      };

    }
  }

}
