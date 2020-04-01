import { Utils, BillsUtils } from '@app/shared';
import { Injectable } from '@angular/core';
import { Professional, Bill, ClientBill, Address, PurchasedOffering, CollectiveGroupBill } from '@app/entities';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;
import { AuthenticationService } from '@app/core';

@Injectable()
export class ExportBillService {

  constructor(private authenticationService: AuthenticationService) { }

  /**
   * Export a Client bill into PDF
   * @param clientBill the clientbill to export
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
   * Export a CollectiveGroup bill into PDF
   * @param collectiveGroupBill the collectiveGroup Bill to export
   */
  exportCollectiveGroupBill(collectiveGroupBill: CollectiveGroupBill) {
    // Build the customer details part
    const customerDetails = [
      {
        text: collectiveGroupBill.collectiveGroup.groupName,
        bold: true
      },
      `N° groupe : ${collectiveGroupBill.collectiveGroup.id}`,
      '\n',
      this.buildAddress(collectiveGroupBill.collectiveGroup.address),
      '\n',
      {
        text: [
          'Bénéficiaire : ',
          {
            text: collectiveGroupBill.recipient,
            bold: true
          }
        ]
      }
    ];

    // remove recipient item if there is no recipient
    if (!collectiveGroupBill.recipient) {
      customerDetails.pop();
    }

    const dd = this.createPDF(collectiveGroupBill, customerDetails);
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
      footer: {
        text: `Facture générée et protégée par Comptandye`,
        italics: true,
        fontSize: 9,
        margin: [0, 10, 0, 0],
        alignment: 'center'
      },
      content: [
        {
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                {
                  border: [false, false, false, false],
                  stack: this.buildProfessionalDetails(bill)
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
          text: `\nDate de la facture : ${moment(bill.issueDate).locale('fr').format('L - LT')}`,
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
        this.buildPurchasedOfferings(bill),
        {
          // use columns attribute to align the total table on right
          columns: [
            {
              width: '*', text: ''
            },
            {
              width: 'auto',
              text: 'Prix et Montants spécifiés en Euros (€)',
              italics: true,
              fontSize: 10,
            }
          ]
        },

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
        {
          // use columns attribute to align the total table on right
          columns: [
            {
              width: '*', text: ''
            },
            {
              width: 'auto', table: this.buildPayments(bill)
            }
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 10,
          bold: true,
          fillColor: '#dddddd'
        },
        total: {
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
  private buildProfessionalDetails(bill: Bill): any[] {
    const professional = new Professional(this.authenticationService.user);

    return [
      {
        text: `${professional.companyName}`,
        bold: true
      },
      ...this.buildCompanyDetails(bill, professional),
      '\n',
      ...this.buildAddress(professional.address),
      '\n',
      `Dirigeant : ${professional.customerDetails.firstName} ${professional.customerDetails.lastName}`,
      `Tél. : ${Utils.formatPhoneNumber(professional.customerDetails.phone)}`,
      `Email : ${professional.email}`,
    ];
  }

  private buildCompanyDetails(bill: Bill, professional: Professional): any[] {
    const companyDetails = [{ text: `N° SIRET : ${professional.companyID}`, style: 'smaller' }];

    if (bill.vatInclusive) {
      companyDetails.push({ text: `N° TVA intra. : ${professional.vatcode}`, style: 'smaller' });
    }

    return companyDetails;
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

  private buildPurchasedOfferings(bill: Bill) {

    const purchasedOfferings = bill.purchasedOfferings;
    if (bill.vatInclusive) {
      return {
        table: {
          widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          headerRows: 1,
          body: [
            [ // header
              { text: '\nDésignation des prestations / forfaits', alignment: 'left', style: 'header' },
              { text: '\nQté.', alignment: 'center', style: 'header' },
              { text: '\nPrix HT', alignment: 'center', style: 'header' },
              { text: '\nTVA (%)', alignment: 'center', style: 'header' },
              { text: '\nPrix TTC', alignment: 'center', style: 'header' },
              {
                table: {
                  widths: ['*', '*'],
                  margin: [0, 0, 0, 0],
                  body: [
                    [
                      {
                        text: 'Montant', alignment: 'center', style: 'header',
                        colSpan: 2,
                        border: [false, false, false, false]
                      },
                      {}// add empty cell for spaning
                    ],
                    [
                      { text: 'HT', alignment: 'left', style: 'header', border: [false, false, false, false] },
                      { text: 'TTC', alignment: 'right', style: 'header', border: [false, false, false, false] }
                    ]
                  ]
                },
                alignment: 'center',
                style: 'header',
                colSpan: 2
              },
              {} // add empty cell for spaning
            ],
            // spread the purchased offerings content
            ...purchasedOfferings.map(po => [
              { text: po.offeringSnapshot.name, alignment: 'left', style: 'smaller' },
              { text: po.qty, alignment: 'center', style: 'smaller' },
              { text: `${po.offeringSnapshot.price / 100}`, alignment: 'center', style: 'smaller' },
              { text: po.vatRate, alignment: 'center', style: 'smaller' },
              {
                text: `${Math.round((po.offeringSnapshot.price * (100 + po.vatRate)) / 100) / 100}`,
                alignment: 'center',
                style: 'smaller'
              },
              { text: `${(po.offeringSnapshot.price * po.qty) / 100}`, alignment: 'center', style: 'smaller' },
              {
                text: `${(Math.round((po.offeringSnapshot.price * (100 + po.vatRate)) / 100) * po.qty) / 100}`,
                alignment: 'center',
                style: 'smaller'
              }
            ]),
            [
              // compute the total amount
              { text: 'Total', alignment: 'left', style: 'footer', colSpan: 5 },
              {}, // add empty cell for spaning
              {}, // add empty cell for spaning
              {}, // add empty cell for spaning
              {}, // add empty cell for spaning
              {
                text: `${purchasedOfferings.map(po => po.qty * po.offeringSnapshot.price).reduce((a, b) => a + b, 0) / 100}`,
                alignment: 'center', style: 'footer'
              },
              {
                text: `${purchasedOfferings.map(po => po.qty * Math.round((po.offeringSnapshot.price * (100 + po.vatRate)) / 100))
                  .reduce((a, b) => a + b, 0) / 100}`,
                alignment: 'center', style: 'footer',
                bold: true
              }
            ]
          ]
        }
      };
    } else {
      return {
        table: {
          widths: ['*', 'auto', 'auto', 'auto'],
          headerRows: 1,
          body: [
            [ // header
              { text: 'Désignation des prestations / forfaits', alignment: 'left', style: 'header' },
              { text: 'Qté.', alignment: 'center', style: 'header' },
              { text: 'Prix HT', alignment: 'center', style: 'header' },
              { text: 'Montant HT', alignment: 'center', style: 'header' }
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
  }

  /**
   * Build the total part (discount, total amount...)
   * @param bill the bill to export
   */
  private buildTotalPart(bill: Bill) {

    const total = {
      body: [
        [
          { text: 'Réduction (€)', border: [false, false, false, false] },
          { text: `${bill.discount / 100}`, border: [false, false, false, false], alignment: 'right' }
        ],
        ...this.buildTotalDetails(bill),
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

    // remove the legal FR conditions if bill is VAT inclusive
    if (bill.vatInclusive) {
      total.body.pop();
    }

    return total;

  }

  /**
   * Build the details of the bill sum up
   * @param bill the bill to export
   */
  private buildTotalDetails(bill: Bill) {
    if (bill.amount >= 0) {
      if (!bill.vatInclusive) {
        return [[
          {
            text: `Montant Total HT (€)`,
            fillColor: '#dddddd',
            bold: true, border: [false, false, false, false]
          },
          { text: `${bill.amount / 100}`, style: 'total', alignment: 'right' }
        ]];
      } else {
        return [
          [
            {
              text: `Montant Total TTC (€)`,
              fillColor: '#dddddd',
              bold: true, border: [false, false, false, false]
            },
            { text: `${bill.amount / 100}`, style: 'total', alignment: 'right' }
          ],
          [
            {
              text: `Montant Total HT (€)`,
              fillColor: '#dddddd',
              border: [false, false, false, false]
            },
            { text: `${Math.round(BillsUtils.getRevenue(bill)) / 100}`, style: 'total', alignment: 'right', bold: false }
          ],
          ...this.buildVATAmounts(bill)
        ];
      }

    } else { // it's a credit
      return [[
        {
          text: `Avoir ${bill.vatInclusive ? 'TTC' : 'HT'} (€)`,
          fillColor: '#dddddd',
          bold: true, border: [false, false, false, false]
        },
        { text: `${-bill.amount / 100}`, style: 'total', alignment: 'right' }
      ]];
    }
  }

  private buildVATAmounts(bill: Bill) {
    const vatAmounts = BillsUtils.getNetVATAmounts(bill);
    return vatAmounts.map(va => [
      {
        text: `Total de TVA à ${va.rate}% (€)`,
        italics: true, fontSize: 10,
        bold: true,
        border: [false, false, false, false],
      },
      {
        text: `${Math.round(va.amount) / 100}`,
        italics: true, fontSize: 10,
        bold: true,
        alignment: 'right',
        border: [false, false, false, false],
      }
    ]);
  }

  /**
   * Dispatch between closed / opened bills
   * @param bill bill to export
   */
  private buildPayments(bill: Bill) {
    if (bill.paymentDate) {
      return this.buildPaymentsClosedBill(bill);
    } else {
      return this.buildPaymentsOpenedBill(bill);
    }
  }

  /**
   * Build the payment part if the bill is closed and payed
   * @param bill the bill to export
   */
  private buildPaymentsClosedBill(bill: Bill) {
    const paymentPart = {
      body: [
        [this.getPaymentsDetails(bill)],
        [
          {
            text: `Facture soldée le : ${moment(bill.paymentDate).locale('fr').format('L')}`,
            bold: true,
            color: 'white',
            fillColor: 'black',
            border: [false, false, false, false]
          }
        ],
      ]
    };

    // remove the payment details if there is no payment
    if (!bill.payments) {
      paymentPart.body.shift();
    }

    return paymentPart;
  }

  /**
   * Build the payment part if the bill is not closed or partially paid
   * @param bill the bill to export
   */
  private buildPaymentsOpenedBill(bill: Bill) {

    // the bills with an amount <= 0 are auto-closed, this should never occur..
    if (bill.amount <= 0) {
      return {
        body: [
          [{
            text: '',
            border: [false, false, false, false]
          }]
        ]
      };
    }

    const paymentPart = {
      body: [
        [this.getPaymentsDetails(bill)],
        [
          {
            table: {
              body: [
                [
                  {
                    text: `${bill.payments ? 'Reste' : 'Montant'} à régler ${bill.vatInclusive ? 'TTC' : 'HT'} (€):`,
                    bold: true,
                    color: 'white',
                    fillColor: 'black'
                  },
                  {
                    text: `${this.remainingAmount(bill) / 100}`,
                    bold: true,
                    alignment: 'right',
                    color: 'white',
                    fillColor: 'black'
                  }
                ]
              ]
            },
            fillColor: 'black',
            border: [false, false, false, false]
          }
        ],
      ]
    };

    // remove the payment details if there is no payment
    if (!bill.payments) {
      paymentPart.body.shift();
    }

    return paymentPart;
  }

  /**
   * Computes and returns the remaining amount to pay
   * @param bill the bill to export
   */
  private remainingAmount(bill: Bill): number {
    if (bill.payments) {
      return bill.amount - bill.payments.map(pm => pm.amount).reduce((a, b) => a + b, 0);
    } else {
      return bill.amount;
    }
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
              text: `Paiement${bill.payments.length > 1 ? 's' : ''} (€) :`,
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
        italics: true,
        border: [false, false, false, false],
      };

    }
  }

}
