import { v4 } from "uuid";

export interface Product {
  deleteId: string|number;
  active: boolean;
  companyId: number;
  conversion: boolean;
  endDate: string;
  image: string;
  isTaxesIncluded: boolean;
  minimumPrice: number;
  price: number;
  productId: number;
  sku: string|number;
  startDate: string;
  status: boolean;
  tenantId: number;
  UOMId: Record<string,any>;
  productName: string;
  id: string;

}


export const fakeData: Product[] = [
  {
    "active": true,
    "companyId": 123,
    "conversion": true,
    "endDate": "2023-12-31T23:59:59.999Z",
    "image": "",
    "isTaxesIncluded": false,
    "minimumPrice": 10.99,
    "price": 29.99,
    "productId": 456,
    "sku": 789,
    "startDate": "2023-01-01T00:00:00.000Z",
    "status": true,
    "tenantId": 987,
    "UOMId": 654,
    productName: "Dummy 1",
    id: v4()
  },
  {
    "active": false,
    "companyId": 456,
    "conversion": false,
    "endDate": "2023-11-30T23:59:59.999Z",
    "image": "",
    "isTaxesIncluded": true,
    "minimumPrice": 5.99,
    "price": 19.99,
    "productId": 789,
    "sku": 123,
    "startDate": "2023-02-01T00:00:00.000Z",
    "status": false,
    "tenantId": 654,
    "UOMId": 321,
    productName: "Dummy 2",
    id: v4()
  }
]


//50 us states array
export const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "Puerto Rico",
];
