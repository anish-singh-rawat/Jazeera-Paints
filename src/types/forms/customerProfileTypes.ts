const defaultValues = (val: string) => {
    return {
        "field": val,
        "defaultValues": "",
        "isEnable": true,
        "isMandatory": true,
        "isVisible": true,
    }
};

export const customerProfiledefaultValues: any = {
    "firstname": defaultValues("firstname"),
    "lastname": defaultValues("lastname"),
    "mobilenumber": defaultValues("mobilenumber"),
    "email": defaultValues("email"),
    "gender": defaultValues("gender"),
    "agegroup": defaultValues("agegroup"),
    "dob": defaultValues("dob"),
    "country": defaultValues("country"),
    "region": defaultValues("region"),
    "city": defaultValues("city"),
    "district": defaultValues("district"),
    "street": defaultValues("street"),
    "tags": defaultValues("tags"),
    "customercode": defaultValues("customercode"),
    "customertype": defaultValues("customertype"),
    "customergroup": defaultValues("customergroup"),
    "customerclass": defaultValues("customerclass"),
    "distributionchannel": defaultValues("distributionchannel"),
    "customerdivision": defaultValues("customerdivision"),
    "parentcustomer": defaultValues("parentcustomer"),
    "latlong": defaultValues("latlong"),
    "salesman": defaultValues("salesman"),
    "status": defaultValues("status"),
    "taxnumber": defaultValues("taxnumber"),
    //"businesstaxgroup": defaultValues("businesstaxgroup"),
    "basictax":defaultValues("basictax"),
    'paymentterms': defaultValues("paymentterms"),
    'creditlimit': defaultValues("creditlimit"),
    'pricelist': defaultValues("pricelist"),
    'creditbalance': defaultValues("creditbalance"),
    'currency': defaultValues("currency"),
    'externalreference': defaultValues("externalreference"),
    'companyname': defaultValues("companyname"),
};

export const getProfileValues = (additionalFields: any) => {
    let dynamicObject: any = {};

    additionalFields?.data?.forEach((item: any) => {
        let name = item?.name
        dynamicObject[name] = defaultValues(name)
    });

    return {
        ...dynamicObject
    }
};

export const translation: any = {
    "firstname": "FIRST_NAME",
    "lastname": "LAST_NAME",
    "mobilenumber": "MOBILE_NUMBER",
    "email": "EMAIL_ID",
    "gender": "GENDER",
    "agegroup": "AGE_GROUP",
    "dob": "DOB",
    "country": "COUNTRY",
    "region": "REGION",
    "city": "CITY",
    "district": "DISTRICT",
    "street": "STREET",
    "tags": "TAGS",
    "customercode": "CUSTOMER_CODE",
    "customertype": "CUSTOMER_TYPE",
    "customergroup": "CUSTOMER_GROUP",
    "customerclass": "CUSTOMER_CLASS",
    "distributionchannel": "DISTRIBUTION_CHANNEL",
    "customerdivision": "CUSTOMER_DIVISION",
    "parentcustomer": "PARENT_CUSTOMER",
    "latlong": "LATITUDE_LONGITUDE",
    "salesman": "SALES_MAN",
    "status": "STATUS",
    "taxnumber": "TAX_NUMBER",
    //"businesstaxgroup": "BUSINESS_TAX_GROUP",
    "basictax":"BASIC_TAX",
    'paymentterms': "PAYMENT_TERMS",
    'creditlimit': "CREDIT_LIMIT",
    'pricelist': "PRICE_LIST",
    'creditbalance': "CREDIT_BALANCE",
    'currency': "CURRENCY",
    'externalreference': "EXTERNAL_REFERANCE",
    'companyname': "COMPANY_NAME"
}