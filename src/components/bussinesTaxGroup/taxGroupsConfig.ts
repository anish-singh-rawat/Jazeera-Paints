import { makeStyles } from "@mui/styles";
import { TFunction } from "i18next";
import { transformViewDates } from "src/utils/transformViewDates";
import viewObjectTransform, {
  ViewObjectTransformKeyMapping,
} from "src/utils/viewObjectTransform";

export const useStyles = makeStyles({
  drawerWrapper: {
    height: "100vh",
  },
  form: {
    height: "calc(100vh - 80px)",
  },
  formContent: {
    height: "calc(100% - 80px)",
    overflow: "auto",
    padding: "16px 24px 8px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  viewContent: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: "8px",
    rowGap: "24px",
    margin: "24px 0",
    paddingBottom: "24px",
    borderBottom: "6px solid #3586C7",
    borderRadius: "0px 0px 6px 6px",
  },
  viewContent_label: {
    color: "#a7a5aa",
    fontWeight: 400,
    fontSize: "15px",
  },
  viewContent_value: {
    color: "#6f6b7d",
    fontWeight: 600,
    fontSize: "15px",
  },
  downLoadBtn: {
    display: "flex",
    justifyContent: "flex-end",
  },
});

export interface TaxGroupsInputs {
  code: string;
  id: string;
  name: string;
  altName: string;
  active: boolean;
  externalReference: string;
  totalCustomers: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
}

const viewTableStr: ViewObjectTransformKeyMapping[] = [
  {
    key: "code",
    name: "CODE",
  },
  {
    key: "name",
    name: "NAME",
  },
  {
    key: "altName",
    name: "ALTERNATE_NAME",
  },
  {
    key: "externalReference",
    name: "REFERENCE",
  },
  {
    key: "createdOn",
    name: "CREATED_ON",
    transform(value) {
      return transformViewDates(value);
    },
  },
  {
    key: "updatedOn",
    name: "MODIFIED_ON",
    transform(value) {
      return transformViewDates(value);
    },
  },
  {
    key: "Created",
    name: "CREATED_BY",
  },
  {
    key: "modified",
    name: "MODIFIED_BY",
  },
];

export const viewObjectData = (record: Record<string, any>, t: TFunction) =>
  viewObjectTransform(record, t, viewTableStr);
