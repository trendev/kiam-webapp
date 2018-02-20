import { Utils } from './../shared/utils';
import { Bill } from './../entities/bill.model';
import { Professional } from './../entities/professional.model';
import { AuthenticationService } from './authentication.service';
import { ClientBill } from './../entities/client-bill.model';
import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class ExportBillService {

  constructor(private authenticationService: AuthenticationService) { }

  exportClientBill(clientBill: ClientBill) {

    const customerDetails = {
      text: 'Customer Details should go here'
    };

    const dd = this.createPDF(clientBill, customerDetails);

  }

  private createPDF(bill: Bill, customerDetails: any) {
    const professional = new Professional(this.authenticationService.user);

    // docDefinition
    const dd = {
      content: [
        {
          alignment: 'justify',
          columns: [
            {
              stack: this.professionalDetails()
            },
            {
              stack: [customerDetails]
            }
          ],
          // optional space between columns
          columnGap: 10
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
      `SIRET : ${professional.companyID}`,
      '\n',
      ...this.professionalAddress(professional),
      '\n',
      `Dirigeant: ${professional.customerDetails.firstName} ${professional.customerDetails.lastName}`,
      `Tél: ${Utils.formatPhoneNumber(professional.customerDetails.phone)}`,
      `Email: ${professional.email}`,
    ];
  }

  private professionalAddress(pro: Professional): any[] {
    return [
      pro.address.street,
      pro.address.optional,
      pro.address.postalCode,
      pro.address.city]
      // remove undefined values
      .filter(e => !!e);
  }

}
