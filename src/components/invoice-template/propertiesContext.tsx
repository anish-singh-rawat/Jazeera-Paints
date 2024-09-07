import React, { createContext, useState, ReactNode } from 'react';
import { File, Blob } from "web-file-polyfill"

export interface Margin {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface TemplateProperties {
    margins: Margin;
    font : string;
    labelColor : string;
    generalLabelColor : string;
    customerLabelColor: string;
    totalLabelColor: string;
    paymentLabelColor: string;
    fontColor : string;
    paymentFontColor: string;
    fontSize : number;
    paperWidth : number;
    paperHeight : number;
    orientation: 'portrait' | 'landscape';
    templateName : string;
    backgroundColor : string;
    showBackgroundColor : boolean;
    backgroundImage? : File;
    backgroundImageUrl? : string;
    imagePosition : string;
    backgroundHeaderImage? : File;
    backgroundHeaderImageUrl? : string;
    headerBackgroundColor : string;
    headerContent : string;
    headerImagePosition : string;
    footerContent : string;
    footerFontSize : number;
    footerFontColor : string;
    backgroundFooterImage? : File;
    backgroundFooterImageUrl? : string;
    footerImagePosition: string;
    footerBackgroundColor: string;
    showLogo: boolean;
    showName: boolean;
    showAddress: boolean;
    organizationFontSize : number;
    organizationFontColor : string;
    customerFontColor : string;
    customerFontSize : number;
    customerLabelFontSize: number;
    logoSize : number;
    showDocumentTitle :  boolean;
    documentTitleFontSize : number;
    documentTitleColor : string;
    showInvoiceDate :  boolean;
    showDueDate : boolean;
    showShippingDate : boolean;
    showCashier : boolean;
    invoiceNumberFontSize : number;
    invoiceNumberColor : string;
    invoiceDate : string;
    dueDate : string;
    shippingDate : string;
    cashier : string;
    invoiceDateArabic : string;
    dueDateArabic : string;
    shippingDateArabic : string;
    cashierArabic : string;
    showTableHeaderBackgrondColor : boolean;
    tableHeaderFontSize : number;
    tableHeaderBackgroundColor : string;
    tableHeaderFontColor : string;
    showTableRowBackgrondColor : boolean;
    tableRowFontSize : number;
    tableRowBackgroundColor : string;
    tableRowFontColor : string;
    documentTitleBackgroundColor : string;
    showTableColumn : boolean;
    showTableBorder : number;
    tableBorderColor : string;
    descriptionWidth : number;
    serviceWidth : number;
    quantityWidth : number;
    priceWidth : number;
    totalWidth :number;
    discountWidth :number;
    vatWidth : number;
    netAmountWidth : number;
    showDescriptionColumn : boolean;
    showServiceColumn : boolean;
    showQuantityColumn : boolean;
    showPriceColumn : boolean;
    showTotalColumn : boolean;
    showDiscountColumn : boolean;
    showVatColumn : boolean;
    showNetAmountColumn : boolean;
    showPaymentHeaderBackgroundColor : boolean,
    showNoteHeaderBackgroundColor: boolean,
    paymentHeaderBackgroundColor : string;
    noteBackgroundColor : string;
    showTotalBackgroundColor : boolean;
    totalBackgroundColor : string;
    totalFontSize : number;
    totalFontColor : string;
    subTotalFontSize : number;
    subTotalBackgroundColor : string;
    subTotalFontColor : string;
    showSubTotal : boolean;
    subTotal : string;
    subTotalArabic : string;
    showTotalDiscount : boolean;
    totalDiscount : string;
    totalDiscountArabic : string;
    showVAT : boolean;
    vatPercentage : string;
    vatPercentageArabic : string;
    showTotalAmount : boolean;
    totalAmount : string;
    totalAmountArabic : string;
    paymentHeaderFontSize : number;
    paymentHeaderFontColor : string;
    paymentDetailsBackgroundColor : string;
    paymentDetailsFontSize : number;
    paymentDetailsFontColor : string;
    noteHeaderFontSize: number,
    noteHeaderBackgroundColor: string,
    noteHeaderFontColor: string,
    noteDetailsFontSize: number,
    noteDetailsBackgroundColor: string,
    noteDetailsFontColor: string,
    showReception: boolean,
    reception: string,
    receptionArabic: string,
    showSeller: boolean,
    seller: string,
    sellerArabic: string,
    showCompany: boolean,
    company: string,
    companyArabic: string,
    showQRDetails: boolean,
    qrDetails: string,
    qrDetailsArabic: string,
    showThanksMessage: boolean,    
    thanksMessage: string,
    thanksMessageArabic:string,
    thanksMessageFontSize: number,
    thanksMessageFontColor: string,
    lastSelectedTableRowBackgroundColor: string,
    // Add other template properties here
}

const paperSizes = {
    A4: { width: 595, height: 842 },
    A5: { width: 420, height: 595 },
    Letter: { width: 612, height: 791 }
}

interface TemplatePropertiesContextProps {
    templateProperties: TemplateProperties;
    updateTemplateProperties: (updates: Partial<TemplateProperties>) => void;
}

const defaultTemplateProperties: TemplateProperties = {
    margins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 },
    font : 'Public Sans',
    labelColor : '#000000',
    generalLabelColor : '#000000',
    customerLabelColor: '#000000',
    totalLabelColor: '#000000',
    paymentLabelColor: '#000000',
    fontColor : '#000000',
    paymentFontColor: '#000000',
    fontSize : 8,
    paperWidth: paperSizes.A4.width,
    paperHeight: paperSizes.A4.height,
    orientation: 'portrait', 
    templateName: "Default Template Name",
    backgroundColor:'#ffffff',
    showBackgroundColor : false,
    backgroundImage: new File([], ""),
    backgroundImageUrl: "",
    imagePosition: 'center center',
    backgroundHeaderImage : new File([],""),
    backgroundHeaderImageUrl : "",
    headerBackgroundColor : '#ffffff',
    headerContent : "",
    headerImagePosition : 'center center',
    footerContent : "",
    footerFontSize : 8,
    footerFontColor : '#000000',
    backgroundFooterImage: new File([],''),
    backgroundFooterImageUrl: "",
    footerImagePosition: 'center center',
    footerBackgroundColor: '#ffffff',
    showLogo: true,
    showName: true,
    showAddress: true,
    organizationFontSize : 8,
    organizationFontColor : "#000000",
    customerFontColor : '#000000',
    customerFontSize : 8,
    customerLabelFontSize: 8,
    logoSize : 5,
    showDocumentTitle : true,
    documentTitleFontSize : 10,
    documentTitleColor : '#000000',
    documentTitleBackgroundColor : '#e0e0e0',
    showInvoiceDate : true,
    showDueDate : true,
    showShippingDate : true,
    showCashier : true,
    invoiceDate : "Invoice Date",
    invoiceNumberFontSize : 8,
    invoiceNumberColor : "#000000",
    dueDate : "Due Date",
    shippingDate : "Shipping Date",
    cashier : "Cashier",
    invoiceDateArabic : "تاريخ الفاتورة",
    dueDateArabic : "تاريخ الاستحقاق",
    shippingDateArabic : "تاريخ الشحن",
    cashierArabic : "أمين الصندوق",
    showTableHeaderBackgrondColor : true,
    tableHeaderFontSize : 8,
    tableHeaderBackgroundColor : "#e0e0e0",
    tableHeaderFontColor : "#000000",
    showTableRowBackgrondColor : false,
    tableRowFontSize : 8,
    tableRowBackgroundColor : "#ffffff",
    tableRowFontColor : "#000000",
    showTableColumn : true,
    showTableBorder : 0.5,
    tableBorderColor : '#000000',
    descriptionWidth : 30,
    serviceWidth : 10,
    quantityWidth : 10,
    priceWidth : 10,
    totalWidth :10,
    discountWidth :10,
    vatWidth : 10,
    netAmountWidth : 10,
    showDescriptionColumn : true,
    showServiceColumn : true,
    showQuantityColumn : true,
    showPriceColumn : true,
    showTotalColumn : true,
    showDiscountColumn : true,
    showVatColumn : true,
    showNetAmountColumn : true,
    showPaymentHeaderBackgroundColor: true,
    showNoteHeaderBackgroundColor: true,
    paymentHeaderBackgroundColor : '#e0e0e0',
    noteBackgroundColor : '#e0e0e0',
    showTotalBackgroundColor : false,
    totalBackgroundColor : '#ffffff',
    totalFontSize : 9,
    totalFontColor : '#000000',
    subTotalFontSize : 8,
    subTotalBackgroundColor : '#ffffff',
    subTotalFontColor : '#000000',
    showSubTotal : true,
    subTotal : 'Sub Total',
    subTotalArabic : 'المجموع الفرعي',
    showTotalDiscount : true,
    totalDiscount : 'Total Discount',
    totalDiscountArabic : 'إجمالي الخصم',
    showVAT : true,
    vatPercentage : 'VAT 15%',
    vatPercentageArabic : 'الضريبة 15%',
    showTotalAmount : true,
    totalAmount : 'Total Amount',
    totalAmountArabic : 'المبلغ الإجمالي',
    paymentHeaderFontSize: 7,
    paymentHeaderFontColor : '#000000',
    paymentDetailsBackgroundColor : '#ffffff',
    paymentDetailsFontSize : 7,
    paymentDetailsFontColor : '#000000',
    noteHeaderFontSize: 7,
    noteHeaderBackgroundColor: '#e0e0e0',
    noteHeaderFontColor: '#000000',
    noteDetailsFontSize: 7,
    noteDetailsBackgroundColor: '#ffffff',
    noteDetailsFontColor: '#000000',
    showReception: true,
    reception: 'Reception',
    receptionArabic: 'الاستقبال',
    showSeller: true,
    seller: 'Seller',
    sellerArabic: 'البائع',
    showCompany: true,
    company: 'Company',
    companyArabic: 'الشركة',
    showQRDetails: true,
    qrDetails: 'Scan QR for Order Details',
    qrDetailsArabic: 'امسح رمز الاستجابة السريعة للحصول على تفاصيل الطلب',
    showThanksMessage: true,    
    thanksMessage: 'Thanks for shopping! Visit Again',
    thanksMessageArabic:'شكرا للتسوق! زورونا مرة اخرى!',
    thanksMessageFontSize:7,
    thanksMessageFontColor:'#000000',
    lastSelectedTableRowBackgroundColor: '#ffffff'
    //other default props
};

const defaultContextValue: TemplatePropertiesContextProps = {
    templateProperties: defaultTemplateProperties,
    updateTemplateProperties: () => { /* Default empty function */ }
};

export const TemplatePropertiesContext = createContext<TemplatePropertiesContextProps>(defaultContextValue);

export const TemplatePropertiesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [templateProperties, setTemplateProperties] = useState<TemplateProperties>(defaultTemplateProperties);

    const updateTemplateProperties = (updates: Partial<TemplateProperties>) => {
        //console.log("Updating template properties:", updates);
        setTemplateProperties(prev => ({ ...prev, ...updates }));
    };
    
    //console.log("Providing context:", templateProperties);

    return (
        <TemplatePropertiesContext.Provider value={{ templateProperties, updateTemplateProperties }}>
            {children}
        </TemplatePropertiesContext.Provider>
    );
};
