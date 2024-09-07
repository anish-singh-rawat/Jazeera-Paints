import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

interface DataItem {
  id: number;
  name: string;
  type: string;
  columns: string[];
}

interface AccordionWithDataProps {
  data: DataItem[];
  onItemSelect: (item: DataItem) => void;
}

const AccordionWithData: React.FC<AccordionWithDataProps> = ({
  data,
  onItemSelect,
}) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const toggleExpansion = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const handleCheckboxChange = (id: number, item: DataItem) => {
    setSelectedItems(
      selectedItems.includes(id)
        ? selectedItems.filter((item) => item !== id)
        : [...selectedItems, id]
    );
    onItemSelect(item);
  };

  const products = data.filter((item) => item.type === "PRODUCT");
  const customers = data.filter((item) => item.type === "CUSTOMER");
  const enterprise = data.filter((item) => item.type === "ENTERPRISE");

  return (
    <>
      <Accordion
        expanded={expandedItem === 1}
        onChange={() => toggleExpansion(1)}
      >
        <AccordionSummary
          expandIcon={
            expandedItem === 1 ? <ExpandMoreIcon /> : <ChevronRightIcon />
          }
          onClick={() => toggleExpansion(1)}
        >
          <Typography>Products</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {products.map((product) => (
              <ListItem key={product.id}>
                <Checkbox
                  checked={false}
                  onChange={() => handleCheckboxChange(product.id, product)}
                  onClick={(event) => event.stopPropagation()}
                />
                <ListItemText primary={product.name} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expandedItem === 2}
        onChange={() => toggleExpansion(2)}
      >
        <AccordionSummary
          expandIcon={
            expandedItem === 2 ? <ExpandMoreIcon /> : <ChevronRightIcon />
          }
          onClick={() => toggleExpansion(2)}
        >
          <Typography>Customers</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {customers.map((customer) => (
              <ListItem key={customer.id}>
                <Checkbox
                  checked={false}
                  onChange={() => handleCheckboxChange(customer.id, customer)}
                  onClick={(event) => event.stopPropagation()}
                />
                <ListItemText primary={customer.name} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expandedItem === 3}
        onChange={() => toggleExpansion(3)}
      >
        <AccordionSummary
          expandIcon={
            expandedItem === 3 ? <ExpandMoreIcon /> : <ChevronRightIcon />
          }
          onClick={() => toggleExpansion(3)}
        >
          <Typography>Enterprise</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {enterprise.map((enterprise) => (
              <ListItem key={enterprise.id}>
                <Checkbox
                  checked={false}
                  onChange={() =>
                    handleCheckboxChange(enterprise.id, enterprise)
                  }
                  onClick={(event) => event.stopPropagation()}
                />
                <ListItemText primary={enterprise.name} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default AccordionWithData;
