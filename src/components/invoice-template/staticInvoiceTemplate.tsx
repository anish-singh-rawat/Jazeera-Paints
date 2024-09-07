import { useEffect, useLayoutEffect, useState } from "react";
import { AppDispatch, RootState } from "src/store";
import { useDispatch, useSelector } from "react-redux";
import { Card, Grid, Button, Checkbox } from "@mui/material";
import ThermalInvoiceHtmlString from "./thermalInvoiceHtmlString";
import InvoiceHtmlString from "./invoiceHtmlString";
// import { createRoot } from "react-dom";
import { axiosInstance as axios } from "src/configs/axios";
import { useTranslation } from "react-i18next";
import AppEvent from "src/app/AppEvent";
import { invoiceSave } from "src/store/apps/invoiceTemplate/invoiceTemplate";
//import InvoiceTable from "./invoice-table";
import { useRouter } from "next/router";
//import AppStorage from "src/app/AppStorage";
import Link from "next/link";

interface FormData {
  code: string;
  name: string;
  altName: string;
  externalReference: string;
  active: boolean;
  template: string;
  companyId: number;
  tenantId: number;
  templateType: string;
}

const StaticInvoiceTemplate: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    code: "uid16524",
    name: "form",
    altName: "formAltName",
    externalReference: "ref",
    active: true,
    template: "<p>Your HTML string goes here</p>",
    companyId: 132543,
    tenantId: 462677,
    templateType: "",
  });
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
  const [selectedComponent, setSelectedComponent] =
    useState<React.ReactElement | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string>("");

  const { t } = useTranslation();
  // const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // const handleButtonClick = (templateType:string) => {
  //   setIsSaveButtonEnabled(true);
  //   setFormData((prevFormData) => ({ ...prevFormData, templateType }));

  //   // Dynamically select the component based on the template type
  //   if (templateType === 'A4') {
  //     setSelectedComponent(<InvoiceHtmlString onClick={handleButtonClick} />);
  //   } else if (templateType === 'Thermal') {
  //     setSelectedComponent(<ThermalInvoiceHtmlString onClick={handleButtonClick} />);
  //   }
  // };

  // use in future for getting data
  const invoiceTemplate: any = useSelector(
    (state: RootState) => state.invoiceTemplate
  );

  // const handleCreateToHtmlClick = async () => {
  //   try {
  //     const getHtmlString = async () => {
  //       // Create a container element
  //       const container = document.createElement("div");

  //       // Create a root and render the React component into the containe
  //       const root = createRoot(container);
  //       root.render(selectedComponent);

  //       // Wait for the rendering to complete
  //       await new Promise((resolve) => setTimeout(resolve, 0));

  //       // Return the HTML string
  //       return container.innerHTML;
  //     };

  //     const formatHtml = (htmlString: string) => {
  //       const parser = new DOMParser();
  //       const doc = parser.parseFromString(htmlString, "text/html");
  //       const formattedHtml = new XMLSerializer().serializeToString(
  //         doc.documentElement
  //       );
  //       return formattedHtml;
  //     };

  //     const newHtmlString = await getHtmlString();
  //     const formattedHtml = formatHtml(newHtmlString);

  //     const newGeneratedHtmlString = `
  //           <!DOCTYPE html>
  //           <html lang="en">
  //           <head>
  //             <meta charset="UTF-8">
  //             <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //             <title>New HTML File</title>
  //           </head>
  //           <body>
  //             ${formattedHtml}
  //           </body>
  //           </html>
  //         `;
  //     //const compressedHtml = encodeURIComponent(generatedHtml);
  //     // Save the HTML content to a file or use it as needed
  //     //downloadFile(newGeneratedHtmlString, "new_file.html");

  //     setGeneratedHtml(newGeneratedHtmlString);
  //     // Call the post request function
  //     // await sendPostRequest(newGeneratedHtmlString);

  //     return newGeneratedHtmlString;
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  // const downloadFile = (content: any, fileName: any) => {
  //   const blob = new Blob([content], { type: "text/html" });
  //   const link = document.createElement("a");
  //   link.href = window.URL.createObjectURL(blob);
  //   link.download = fileName;
  //   link.click();
  // };
  //let res;
  // const sendPostRequest = async (htmlString: string) => {
  //   const data = {
  //     ...formData,
  //     template: htmlString,
  //   };
  //   try {
  //     const response = await dispatch(invoiceSave(data));
  //     AppEvent.messageEmit({
  //       type: response?.payload?.message ? "success" : "error",
  //       message: response?.payload?.message
  //         ? response?.payload?.message
  //         : response?.payload?.error?.message,
  //     });
  //   } catch (error:any) {
  //     console.error("Error sending POST request:", error.message);
  //     // Handle the error or provide user feedback
  //   }
  // };

  // useEffect(() => {
  //   if (generatedHtml && selectedComponent ) {
  //     sendPostRequest(generatedHtml);
  //   }
  // }, [generatedHtml]);

  // const handleSaveButtonClick = async () => {
  //   try {
  //     console.log("handleSaveButtonClick called");
  //     // Call handleCreateToHtmlClick to get the generated HTML string
  //     await handleCreateToHtmlClick();
  //     setIsSaveButtonEnabled(false);
  //     console.log("save button clicked....")
  //   } catch (error: any) {
  //     console.error("Error creating HTML:", error.message);
  //     // Handle the error or provide user feedback
  //   }
  // };

  const handleCheckboxChange = (templateType: string) => {
    setIsSaveButtonEnabled(true);
    setFormData((prevFormData) => ({ ...prevFormData, templateType }));

    // Dynamically select the component based on the template type
    if (templateType === "A4") {
      setSelectedComponent(<InvoiceHtmlString />);
    } else if (templateType === "Thermal") {
      setSelectedComponent(<ThermalInvoiceHtmlString />);
    }
  };

  // const handleEditButtonClick = () => {
  //   // router.push('edit-invoice');
  //   if (formData.templateType) {
  //     router.push(`/invoicetemplate/edit-invoice/${formData.templateType}`);
  //   } else {
  //     console.error("Please select a template type before editing.");
  //   }
  // };

  return (
    <Card>
      {/* <InvoiceTable
        data={[
          {name:"test name",id:1},
          {name:"test name2",id:2}
        ]}
        // selectedRecord={selectedRecord}
        // handleEditPage={handleEditPage}
        // isLoading={translationList?.isLoading}
        // setItem={setItem}
        // item={item}
      /> */}
      <div style={{ padding: "20px" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Checkbox
              checked={formData.templateType === "A4"}
              onChange={() => handleCheckboxChange("A4")}
            />
            <span>A4</span>
          </Grid>
          <Grid item>
            <Checkbox
              checked={formData.templateType === "Thermal"}
              onChange={() => handleCheckboxChange("Thermal")}
            />
            <span>Thermal</span>
          </Grid>
          <Grid item>
            {/* <Button variant="contained" onClick={handleSaveButtonClick} disabled={!isSaveButtonEnabled}>
              {t("SAVE")}
            </Button> */}
          </Grid>
          <Grid item>
            <Link
              href="/invoicetemplate/edit-invoice/[templateType]"
              as={`/invoicetemplate/edit-invoice/${formData.templateType}`}
            >
              <Button variant="contained" disabled={!isSaveButtonEnabled}>
                {t("EDIT")}
              </Button>
            </Link>
          </Grid>
        </Grid>
      </div>
      <div style={{ display: "flex" }}>
        <InvoiceHtmlString />
        <ThermalInvoiceHtmlString />
      </div>
    </Card>
  );
};

export default StaticInvoiceTemplate;
