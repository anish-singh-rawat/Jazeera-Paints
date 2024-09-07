import React,{useState} from 'react';

import { Drawer, List, ListItem, ListItemText, Toolbar, Collapse, IconButton, Box, Button, Grid, Typography, Card } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import Template from './template';
import TemplatePropeties from './templateProperties';
import FontProperties from './fontProperties';
import BackgroundProperties from './backgroundProperties';
import {HeaderProperties, FooterProperties} from './headerAndFooterProperties';
import { CustomerDetails, OrganisationDetails, DocumentDetails } from './transactionDetails';
import TableProperties from './tableProperties'
import TotalProperties from './totalProperties';
import { NoteDetails, PaymentDetails, SignatureDetails} from './otherProperties';
//import {PaymentDetails} from './otherProperties';

interface items {
    text: string;
    key: string;
  }
  
interface MainMenuItem {
    text: string;
    items: items[];
    key: string;
}

const drawerWidth = 240;
 
const mainMenuItems: MainMenuItem[] = [
    { text: 'General',key:"general", 
      items: ['Template Properties', 'Font', 'Background'].map(text => ({ text,key:text })) },
    { text: 'Header & Footer',key:"headerAndfooter", items: ['Header', 'Footer'].map(text => ({ text, key:text })) },
    { text: 'Transaction Details',key:"transactiondetails", items: ['Organisation Details','Customer Details', 'Document Details'].map(text => ({ text, key:text })) },
    { text: 'Table', key:"table", items: ['Table Properties'].map(text => ({text, key:text})) },
    { text: 'Total',key:"total", items: ['Total Section'].map(text=>({text, key:text})) },
    { text: 'Other Details', key:"otherdetails", items: ['Payment Details','Note', 'Signature'].map(text=>({text, key:text})) }
    
];
 
//export default function Sidebar() {
const InvoiceSidebar: React.FC = () => {
    const [tab, setTab] = useState<string | null>("general");
    const [selectedItem, setSelectedItem] = useState<string | null>("Template Properties");
    const [templateProperties,setTemplateProperties] = useState([
      {key:"Font",value:""}
    ])

  const handleSubMenuToggle = (text: string) => {
    setTab((prev) => (prev === text ? null : text));
  };

  const handleMainMenuClick = (key: string) => {
    setTab(key); 

    const foundMainMenu = mainMenuItems.find(item => item.key === key);
    if (foundMainMenu && foundMainMenu.items.length > 0) {
        setSelectedItem(foundMainMenu.items[0].key);
    } else {
        // If there are no sub-items, clear the selected item
        setSelectedItem(null);
    }
};

//   const handleSubItemClick = (subItem: SubItem) => {
//     // setSelectedSubItem(subItem.text);
//   };

  const expandItem = (key: string) => {
    // Handle the click on a main menu item
    setSelectedItem(prev => prev === key ? null : key);
  };

  const renderSubMenuComponent = (key: string) => {
    switch (key) {
      case 'Template Properties':
        return <TemplatePropeties/>;
      case 'Font':
        return <FontProperties/>;
      case 'Background':
        return <BackgroundProperties />;
      case 'Header':
        return <HeaderProperties />;
      case 'Footer':
        return <FooterProperties />;
      case 'Organisation Details':
        return <OrganisationDetails />;
      case 'Customer Details':
        return <CustomerDetails />;  
      case 'Document Details' :
        return <DocumentDetails />;
      case 'Table Properties' :
        return <TableProperties />
      case 'Total Section' :
        return <TotalProperties />
      case 'Payment Details' :
        return <PaymentDetails />
      case 'Note' : 
        return <NoteDetails />
      case 'Signature' :
        return <SignatureDetails />
      default:
        return null;
    }
  };


  return (
    <Box sx={{ display: 'flex'}} >
      <List sx={{width:'20%',mr: 5}}>
        {mainMenuItems.map((item) => (
          <div key={item.text}>
            <ListItem 
                button 
                onClick={() => handleMainMenuClick(item.key)}
                sx={{
                    bgcolor: tab === item.key ? 'primary.main' : 'transparent',
                    borderRadius: 1,
                    '&:hover': {
                        bgcolor: tab === item.key ? 'primary.main' : '',
                    },
                }}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          </div>
        ))}
      </List>
      <List sx={{width:'75%'}}>
        {mainMenuItems.find((tabInfo) => tabInfo?.key === tab)?.items.map((item) => (
          <div key={item.key}>
            <ListItem button onClick={() => expandItem(item.key)}>
              <ListItemText primary={item.text} />
              {selectedItem === item.key ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </ListItem>
            <Collapse in={selectedItem === item.key} timeout="auto" unmountOnExit>
              {renderSubMenuComponent(item.text)}
            </Collapse>
          </div>
        ))}
      </List>
    </Box>

  );

}

export default InvoiceSidebar;
