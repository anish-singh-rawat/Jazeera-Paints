export type InvoiceStatus = "Paid" | string;

export type InvoiceLayoutProps = {
  id: string | undefined;
};

export type InvoiceClientType = {
  name: string;
  address: string;
  company: string;
  country: string;
  contact: string;
  companyEmail: string;
};

export type InvoiceType = {
  id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  externalReference: string;
  status: number;
  street: string;
  taxNumber: string;
  customerType: string;
  customerTypes: {
    name: string;
    altName: string;
  };
  customerDivision: {
    name: string;
  };
  tax: {
    code: string;
    id: string;
    name: string;
  };
  city: {
    name: string;
  };
  customerClass: {
    name: string;
  };
  customerGroup: {
    name: string;
  };
  distributionChannel: {
    name: string;
    altName: string;
  };
  region: {
    name: string;
  };
  country: {
    name: string;
  };
  district: {
    name: string;
    altName: string;
  };
  paymentTerms: {
    name: string;
  };
  priceList: {
    name: string;
  };
  salesman: {
    name: string;
  };
  creditLimit: number | string;
  currency: {
    name: string;
  };
  parentCustomer: {
    firstName: string;
    lastName: string;
  };
  customerBalance: number | string;
  latitude: string | number;
  longitude: number | string;
  parentCustomerId: number | string;
  DOB: string;
  notes: string;
  name: string;
  total: number;
  avatar: string;
  service: string;
  dueDate: string;
  address: string;
  company: string;
  contact: string;
  avatarColor?: string;
  issuedDate: string;
  companyEmail: string;
  balance: string | number;
  invoiceStatus: InvoiceStatus;
  ageGroup: string;
  gender: string;
  companyName: string;
};

export type InvoicePaymentType = {
  iban: string;
  totalDue: string;
  bankName: string;
  country: string;
  swiftCode: string;
};

export type SingleInvoiceType = {
  invoice: InvoiceType;
  paymentDetails: InvoicePaymentType;
};
