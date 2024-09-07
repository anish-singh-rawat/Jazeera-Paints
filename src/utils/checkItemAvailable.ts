
function checkItemAvailability(item: any, list: any) {
  return list.includes(item);
}

export const formatColumns = (columns: any) => {
  const allColumns = [
    {
      key: "uuid",
      header: "UUID"
    },
    {
      key: "id",
      header: "ID",
    },
    {
      key: "code",
      header: "CODE",
    },
    {
      key: "name",
      header: "FULL_NAME",
    },
    {
      key: "parentCustomer",
      header: "PARENT_CUSTOMER",
    },
    {
      key: "customerType",
      header: "TYPE",
    },
    {
      key: "customerDivision",
      header: "CUSTOMER_DIVISION",
    },
    {
      key: "mobileNumber",
      header: "MOBILE",
    },
    {
      key: "country",
      header: "COUNTRY",
    },
    {
      key: "region",
      header: "REGION",

    },
    {
      key: "district",
      header: "DISTRICT",
    },
    {
      key: "customerClass",
      header: "CLASS",
    },
    {
      key: "customerGroup",
      header: "GROUP",
    },
    {
      key: "distributionChannel",
      header: "DISTRIBUTION_CHANNEL",
    },
    {
      key: "email",
      header: "EMAIL",
    },
    {
      key: "externalReference",
      header: "REFERENCE",
    },
    {
      key: "notes",
      header: "NOTES",
    },
    {
      key: "paymentTerms",
      header: "PAYMENT_TERMS",
    },
    {
      key: "priceList",
      header: "PRICE_LIST",
    },
    {
      key: "salesman",
      header: "SALESMAN",
    },
    {
      key: "status",
      header: "STATUS",
    },
    {
      key: "street",
      header: "STREET",
    },
    // {
    //   key: "tax",
    //   header: "TAX",
    // },
    {
      key: "taxNumber",
      header: "TAX_NUMBER",
    },
    {
      key: "creditLimit",
      header: "CREDIT_LIMIT",
    },
    {
      key: "customerBalance",
      header: "BALANCE",
    },
    //  {
    //   key: "latLong",
    //   header: "LAT_LONG",
    // },
    {
      key: "dob",
      header: "DOB",
    },
  ];
  const formatedColumns = allColumns.filter((item) => columns.includes(item.key))
  return [{ key: "id", header: "ID" }, ...formatedColumns]
};

export const generalHeaders: any = {
  "firstname": "First Name",
  "lastname": "Last Name",
  "mobilenumber": "Mobile",
  "email": "Email",
  "gender": "Gender",
  "agegroup": "Age Group",
  "dob": "DOB",
  "country": "Select Country",
  "region": "Select Region",
  "city": "Select City",
  "district": "Select District",
  "street": "Street",
  "tags": "Tags",
};

export const advanceHeaders: any = {
  "customercode": "Customer Code",
  "customertype": "Customer Type",
  "customergroup": "Group",
  "customerclass": "Class",
  "distributionchannel": "Distribution Channel",
  "customerdivision": "Division",
  "parentcustomer": "Parent Customer",
  "latlong": "Latitude & Longitude ",
  "salesman": "Sales person",
  "status": "Status ",
  "companyname": "Company name"
};

export const financialHeaders: any = {
  "taxnumber": "Tax Number",
  //"businesstaxgroup": "Business Tax Group",
  "basictax": "Basic Tax",
  'paymentterms': "Payment Terms",
  'creditlimit': "Credit Limit",
  'pricelist': "Price List",
  'creditbalance': "Customer Balance ",
  'currency': "Currency",
  'externalreference': "Reference"
};

export const additionalInfoHeaders: any = {

};

export const dropDowns = [
  "country",
  "region",
  "city",
  "district",
  "customertype",
  "customergroup",
  "customerclass",
  "distributionchannel",
  "customerdivision",
  "parentcustomer",
  "salesman",
  "status",
  //"businesstaxgroup",
  "basictax",
  "paymentterms",
  "pricelist",
  "currency",
  "agegroup",
  "gender"
]

export const fileNameAndType = (str: string = "", substring: string, prefix: string) => {
  const lastIndex = str?.lastIndexOf(substring);

  const before = str?.slice(0, lastIndex);

  const after = str?.slice(lastIndex + 1);

  return {
    "fileType": after,
    "fileName": before,
    "prefix": prefix
  };
}

export function isEmpty(value: any) {
  for (let prop in value) {
    if (value.hasOwnProperty(prop)) return false;
  }
  return true;
}

export default checkItemAvailability;
