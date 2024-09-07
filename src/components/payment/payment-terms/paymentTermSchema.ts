// paymentTermSchema.ts

import * as yup from "yup";

export interface PaymentTerm {
  id: number;
  paymentMethod: string;
  externalReference: string;
  active: boolean;
  isDeleted: boolean;
  createdOn: string;
  updatedOn: string;
  companyId: number;
  tenantId: number;
  uuid: string;
  code: string;
  name: string;
  altName?: string;
  description?: string;
  isFixedDayOfMonth: boolean;
  noOfDays?: number;
  paymentTermsDiscount?: PaymentTermsDiscount[];
  dayOfMonth?: number;
  data: [];
}

export interface PaymentTermsDiscount {
  id: number;
  uuid: string;
  sno: number;
  noOfDays: number;
  discount: number;
}

export interface Tenant {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
  active: boolean;
}

export interface Company {
  id: number;
  uuid: string;
  code: string;
  name: string;
  altName: string;
  active: boolean;
}

const isCodeUnique = (data: any, value: any) => {
  const matchingItem = data.find((item: any) => item.code === value);
  return !matchingItem;
};

export const paymentTermSchema = (paymentData: PaymentTerm) =>
  yup.object().shape({
    code: yup.string().when("sequenceMapData.autoGeneration", {
      is: false,
      then: yup
        .string()
        .required("REQUIRED")
        .min(2, "Code must be at least 2 characters")
        .max(6, "Code can be at most 6 characters")
        .matches(/^[a-zA-Z0-9]+$/, "Code must be alphanumeric")
        .test("unique-code", "Code already exists", function (value) {
          return isCodeUnique(paymentData.data, value);
        }),
    }),
    name: yup.string().required("Name Field is Required"),
    paymentMethod: yup.string().required("Please select a payment method"),

    paymentStartDates: yup
      .date()
      .when(["paymentMethod"], (paymentMethod, startDateSchema) => {
        if (paymentMethod == "CREDIT") {
          return startDateSchema.required("startDate is required");
        } else {
          return startDateSchema;
        }
      }),

    paymentEndDate: yup
      .date()
      .when(["paymentMethod"], (paymentMethod, schema) => {
        return paymentMethod == "CREDIT"
          ? schema.required("endDate  is required")
          : schema;
      }),
    weekdayOfPayment: yup
      .string()
      .when(["paymentMethod"], (paymentMethod, schema) => {
        return paymentMethod == "END_OF_CURRENT_WEEK"
          ? schema.required("Required")
          : schema;
      }),

    months: yup
      .number()
      .when(["paymentMethod"], (paymentMethod, schema) => {
        return paymentMethod === "CREDIT"
          ? schema.required("Month is required")
          : schema;
      })
      .min(1, "Month must be between 1 and 12")
      .max(12, "Month must be between 1 and 12"),

    days: yup
      .number()
      .nullable()
      .typeError("Days must be a number")
      .when("months", {
        is: (months: any) => months !== undefined,
        then: yup
          .number()
          .test(
            "is-valid-day",
            "Invalid day for selected month",
            function (value: any) {
              const month = this.parent?.months as number;
              if (month !== undefined) {
                const daysInMonth = new Date(
                  new Date().getFullYear(),
                  month,
                  0
                ).getDate();
                return value >= 1 && value <= daysInMonth;
              }
              return false;
            }
          ),
      }),
  });
