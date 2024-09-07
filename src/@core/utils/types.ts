interface MonthYear {
  year: number;
  month: number;
}

interface Fns {
  cardType(cardNumber: string): string;
  formatCardNumber(cardNumber: string): string;
  validateCardNumber(cardNumber: string): boolean;
  validateCardCVC(cvc: string, type?: string): boolean;
  validateCardExpiry(monthYear: string, year?: string): boolean;
  cardExpiryVal(monthYear: string | HTMLInputElement): MonthYear;
}

export type PaymentTypes = {
  fns: Fns;
  formatCardCVC(elem: HTMLInputElement): HTMLInputElement;
  restrictNumeric(elem: HTMLInputElement): HTMLInputElement;
  formatCardNumber(elem: HTMLInputElement): HTMLInputElement;
  formatCardExpiry(elem: HTMLInputElement): HTMLInputElement;
};


export interface ProductBrand {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
  active: boolean;
  createdOn: string; // You might want to use Date type here if you parse the date
  updatedOn: string; // You might want to use Date type here if you parse the date
  tenantId: number;
  companyId: number;
  externalReference: string;
  isDeleted: boolean;
  company: {
    id: number;
    uuid: string;
    code: string;
    name: string;
    altName: string;
    active: boolean;
  };
}


