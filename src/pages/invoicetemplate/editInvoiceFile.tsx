import { Card, Grid,Button } from '@mui/material';
import React,{useEffect, useState, useContext} from 'react';
import {NextPage} from 'next';
import { useRouter } from 'next/router';
import InvoiceHtmlString from 'src/components/invoice-template/invoiceHtmlString';
import ThermalInvoiceHtmlString from 'src/components/invoice-template/thermalInvoiceHtmlString';
import InvoiceSidebar from 'src/components/invoice-template/invoiceSidebar';
import { useTranslation } from "react-i18next";
import { AppDispatch, RootState } from "src/store";
import { useDispatch, useSelector } from "react-redux";
import { createRoot } from "react-dom/client";
import { invoiceSave } from "src/store/apps/invoiceTemplate/invoiceTemplate";
import { TemplatePropertiesProvider, TemplatePropertiesContext } from 'src/components/invoice-template/propertiesContext';

interface EditInvoiceProps {
    templateType: string;
  }

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

  const EditInvoiceFile: React.FC<EditInvoiceProps> = ({ templateType}) => {

    const [formData, setFormData] = useState<FormData>({
        code: "uid16524",
        name: "form",
        altName: "formAltName",
        externalReference: "ref",
        active: true,
        template: "<p>Your HTML string goes here</p>",
        companyId: 132543,
        tenantId: 462677,
        templateType: ""
      });
    const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<React.ReactElement | null>(null);
    const [generatedHtml, setGeneratedHtml] = useState<string>("");

    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const {templateProperties, updateTemplateProperties} = useContext(TemplatePropertiesContext);
      //console.log("updating name",templateProperties)
    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            templateType,
          }));  
        setSelectedComponent(templateType == 'A4' ? <InvoiceHtmlString /> : <ThermalInvoiceHtmlString />);
      }, [templateType,templateProperties]);

    const handleCreateToHtmlClick = async () => {
        try {
          const getHtmlString = async () => {
            // Create a container element
            const container = document.createElement("div");
            const root = createRoot(container);
            root.render(selectedComponent);
    
            // Wait for the rendering to complete
            await new Promise((resolve) => setTimeout(resolve, 0));
            return container.innerHTML;
          };
    
          const formatHtml = (htmlString: string) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, "text/html");
            const formattedHtml = new XMLSerializer().serializeToString(
              doc.documentElement
            );
            return formattedHtml;
          };
    
          const newHtmlString = await getHtmlString();
          const formattedHtml = formatHtml(newHtmlString);
    
          const newGeneratedHtmlString = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>New HTML File</title>
                </head>
                <body>
                  ${formattedHtml}
                </body>
                </html>
              `;
          // Save the HTML content to a file or use it as needed
          //downloadFile(newGeneratedHtmlString, "new_file.html");
    
          setGeneratedHtml(newGeneratedHtmlString);
          // Call the post request function
          // await sendPostRequest(newGeneratedHtmlString);
    
          return newGeneratedHtmlString;
        } catch (error) {
          throw error;
        }
      };
    
      const downloadFile = (content: any, fileName: any) => {
        const blob = new Blob([content], { type: "text/html" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      };
    
      const sendPostRequest = async (data: FormData) => {
        try {
            // Directly use the 'data' argument to make the POST request
            const response = await dispatch(invoiceSave(data));
          
        } catch (error: any) {
            console.error("Error sending POST request:", error.message);
        }
      };
    
      const handleSaveButtonClick = async () => {
        // console.log("Current template name on save:", templateProperties.templateName)
        try {
          const generatedHtml = await handleCreateToHtmlClick();
          const updatedFormData = {
            ...formData,
            name: templateProperties.templateName,  
            template: generatedHtml
        };
          await sendPostRequest(updatedFormData);
        } catch (error: any) {
          console.error("Error creating HTML:", error.message);
        }
      };

    return (
    <Card style={{ overflow: 'auto'}}>
    {/* <Card> */}
      <Grid container spacing={2} style={{padding:'20px'}} >
        <Grid item xs={5}>
          {/* Render the sidebar component */}
          <InvoiceSidebar />
        </Grid>
        <Grid item xs={7} >
        <Grid item >
            <Button variant="contained" onClick={handleSaveButtonClick}>
                {t("SAVE")}
            </Button>
        </Grid>
          <Grid item >
              {selectedComponent}
          </Grid>
        </Grid>
      </Grid>
    </Card>
    );
  };

export default EditInvoiceFile;