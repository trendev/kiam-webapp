import { ClientBill } from './../entities/client-bill.model';
import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class ExportBillService {

  constructor() { }

  exportClientBill(clientBill: ClientBill) {
    const docDefinition = { content: JSON.stringify(clientBill) };
    pdfMake.createPdf(docDefinition).download(`${clientBill.reference}.pdf`);
  }

}
