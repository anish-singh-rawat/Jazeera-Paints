import { Card } from '@mui/material';
import React,{useEffect} from 'react';
import {NextPage} from 'next';
import { useRouter } from 'next/router';
import { TemplatePropertiesProvider,TemplatePropertiesContext } from 'src/components/invoice-template/propertiesContext';
import EditInvoiceFile from '../editInvoiceFile';
// const Child1 = (props) => {
//     const data =  React.useContext(TemplatePropertiesContext); // Access the shared name value and update function
//     console.log(data)
//     return <div>child 1 - Name: </div>;
//   };
  
//   const Child2 = (props) => {
//     const data =  React.useContext(TemplatePropertiesContext); // Access the shared name value and update function
//     console.log(data)
  
//     // const handleNameChange = (e) => {
//     //   updateName(e.target.value); // Update the shared name value
//     // };
  
//     return (
//       <div>
//         a
//         {/* child 2 - Name: <input value={name} onChange={handleNameChange} /> */}
//       </div>
//     );
//   };
const InvoiceTemplateEdit = () => {
    const router = useRouter();
    const { templateType } = router.query;
  
    return (
        <TemplatePropertiesProvider>
            <div>
                {/* Render the EditInvoice component based on templateType */}
                <EditInvoiceFile templateType={templateType as string} />
                {/* <Child1 /> */}
            </div>
        </TemplatePropertiesProvider>
    );
  };
  
  export default InvoiceTemplateEdit;