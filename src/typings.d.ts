/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
declare var Stripe: (pk: string) => any;
// declare module 'pdfmake/build/pdfmake.js';
// declare module 'pdfmake/build/vfs_fonts.js';

declare let gtag: Function;