import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Dialog,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { AppDispatch, RootState } from "src/store";
import { ProductcategoryCreate } from "src/store/apps/product/product-category";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import CommonInput from "src/components/common/CommonInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { productDivisionCreate } from "src/store/apps/products/division/products_division";
import { productBrandsCreate } from "src/store/apps/products/brand/products_brand";
import { productFamilyCreate } from "src/store/apps/products/family/products_family";
import { productGroupCreate } from "src/store/apps/products/group/products_group";
import CommonSelect from "src/components/common/CommonSelect";
import { ProductSubcategoryCreate } from "src/store/apps/product/product-sub-category";
import { ProductTypeCreate } from 'src/store/apps/product/product-type';
import { fetchproductbrandsdropdown, fetchProductcategorydropdown, fetchproductdivisionsdropdown, fetchProductfamilydropdown, fetchProductgroupsdropdown, fetchProductsubcategorydropdown, fetchProductTypedropdown } from 'src/store/apps/product_dropdown/product_dropdown';

const useStyles = makeStyles({
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "30px 65px",
    borderRadius: 6,
  },
  heading: {
    color: "#4B465C",
    fontSize: 18,
    fontWeight: 600,
  },
  overflow: {
    "& .MuiPaper-elevation": {
      overflow: "visible",
    },
  },
  input: {
    "& .css-19jxieg-MuiInputBase-input-MuiOutlinedInput-input": {
      padding: "7px 14px",
      height: 29,
      width: 250,
    },
  },
  select: {
    "& .css-glnyfl-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
      {
        padding: "7px 14px",
        height: 29,
        width: 237,
      },
  },
  btnsec: {
    flexDirection: "row",
    display: "flex",
    gap: "20px",
    justifyContent: "start",
    alignItems: "start",
    alignSelf: "start",
  },
  savebtn: {
    borderRadius: "6px",
    padding: "10px 20px",
    background: "#3586C7",
    width: "91px",
    height: "38px",
    color: "#fff",
  },
  cancelbtn: {
    color: "#ffffff",
    width: "91px",
    height: "38px",
    display: "flex",
    fontSize: "1rem",
    background: "#A8AAAE",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      background: "#A8AAAE !important",
    },
  },
});

interface Props {
  fieldID: string;
  itemNameToAdd: string;
  openCreateNewOptionModal: boolean;
  setOpenCreateNewOptionModal: Function;
  selectedCategoryCode?: string | number;
  title: string;
  updateCreatedOption: Function;
}

const CreateNewDropdownOption: React.FC<Props> = ({
  fieldID,
  itemNameToAdd,
  openCreateNewOptionModal,
  setOpenCreateNewOptionModal,
  selectedCategoryCode,
  title,
  updateCreatedOption
}: Props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();

  const productDropdown: any =
    useSelector((state: RootState) => state.productdropdown) ?? [];

  const [autoCodeGenStatus, setAutoCodeGenStatus] = useState<boolean>(false);
  const selectedCategoryOption = productDropdown?.Productcategory.filter((item: any) => item?.code === selectedCategoryCode);
  const [isAPIReqInProgress, setIsAPIReqInProgress] = useState(false);

  const getAutoGeneratedCodeStatus = async () => {
    let mappingCode = "";
    switch (fieldID) {
      case "CATEGORY":
        mappingCode = "PRODUCT_CATEGORY_CODE";
        break;
      case "FAMILY":
        mappingCode = "PRODUCT_FAMILY_CODE";
        break;
      case "DIVISION":
        mappingCode = "PRODUCT_DIVISION_CODE";
        break;
      case "BRAND":
        mappingCode = "PRODUCT_BRAND_CODE";
        break;
      case "GROUP":
        mappingCode = "PRODUCT_GROUP_CODE";
        break;
      case "SUB_CATEGORY":
        mappingCode = "PRODUCT_SUB_CATEGORY_CODE";
        break;
      case "TYPE":
        mappingCode = "PRODUCT_TYPE_CODE";
        break;
      default:
        break;
    }
    if (mappingCode) {
      setIsAPIReqInProgress(true);
      try {
        const response = await dispatch(
          sequenceMappingCodeSearch({ entityType: mappingCode })
        );
        setIsAPIReqInProgress(false);
        setAutoCodeGenStatus(response?.payload?.autoGeneration);
        if (response?.payload?.autoGeneration) {
          const elemet: any = document.getElementsByName("name");
          elemet[0]?.focus();
        } else {
          const elemet: any = document.getElementsByName("newDropDownOptioncode");
          elemet[0]?.focus();
        }
      } catch (error) {
        setIsAPIReqInProgress(false);
        console.error("Error:", error);
      }
    }
  };

  useEffect(() => {
    getAutoGeneratedCodeStatus();
  }, []);

  function isFieldUnique(currentValue: any, fieldName="code") {
    let isCodeExists = false;
    let currentDropdownData: any = [];
    switch (fieldID) {
      case "FAMILY":
        currentDropdownData = [...productDropdown?.Productfamily];
        break;
      case "CATEGORY":
        currentDropdownData = [...productDropdown?.Productcategory];
        break;
      case "SUB_CATEGORY":
        currentDropdownData = [...productDropdown?.Productsubcategory];
        break;
      case "BRAND":
        currentDropdownData = [...productDropdown?.productbrands];
        break;
      case "GROUP":
        currentDropdownData = [...productDropdown?.Productgroups];
        break;
      case "DIVISION":
        currentDropdownData = [...productDropdown?.productdivisions];
        break;
      case "TYPE":
        currentDropdownData = [...productDropdown?.ProductTypes];
        break;
      default:
        break;
    }
    isCodeExists = currentDropdownData?.some(
      (item: any) => item?.[fieldName] == currentValue?.trim()
    );
    return !isCodeExists;
  }

  let createNewDropdownSchema = yup.object().shape(
    {
      newDropDownOptioncode: yup
        .string()
        .when("newDropDownOptioncode", (currentCode, schema) => {
          if (!autoCodeGenStatus) {
            return yup
              .string()
              .required("REQUIRED")
              .min(2, "Code must be at least 2 characters")
              .max(6, "Code can be at most 6 characters")
              .matches(/^[a-zA-Z0-9]+$/, "Code must be alphanumeric")
              .test("unique-code", "Code already exists", function (value) {
                return isFieldUnique(value, "code");
              });
          } else {
            return yup.string().notRequired();
          }
        }),
      name: yup
        .string()
        .required("REQUIRED")
        .test("unique-name", "Name already exists", function (value) {
          return isFieldUnique(value, "name");
        }),
      altName: yup.string().required("REQUIRED"),
    },
    [["newDropDownOptioncode", "newDropDownOptioncode"]]
  );

  const {
    reset: resetCreateNewDropdown,
    control: controlCreateNewDropdown,
    handleSubmit: handleSubmitCreateNewDropdown,
    setValue: setValueCreateNewDropdown,
    formState: { errors: errorsCreateNewDropdown },
    clearErrors: clearErrorsCreateNewDropdown,
  } = useForm({
    defaultValues: {
      name: itemNameToAdd,
      altName: itemNameToAdd,
      externalReference: ""
    },
    mode: "onChange",
    resolver: yupResolver(createNewDropdownSchema),
  });

  const onSubmit = async (formData: any, e: any) => {
    setIsAPIReqInProgress(true);

    try {
      let postBody: any = {
        name: formData?.name,
        altName: formData?.altName,
        externalReference: formData?.externalReference,
      };
      // If autoCodeGenStatus is true then don't pass this parameter to backend API
      if (!autoCodeGenStatus) {
        postBody.code = formData?.newDropDownOptioncode;
      }
      // Send selected category id for creating sub category
      if (fieldID === "SUB_CATEGORY") {
        postBody.productCategoryId = selectedCategoryOption[0]?.id;
      }

      let createItemDataFunction: any = () => {};
      let getDataFunctionAfterCreation: any = () => {};
      switch (fieldID) {
        case "FAMILY":
          createItemDataFunction = productFamilyCreate(postBody);
          getDataFunctionAfterCreation = fetchProductfamilydropdown();
          break;
        case "CATEGORY":
          createItemDataFunction = ProductcategoryCreate(postBody);
          getDataFunctionAfterCreation = fetchProductcategorydropdown();
          break;
        case "SUB_CATEGORY":
          createItemDataFunction = ProductSubcategoryCreate(postBody);
          getDataFunctionAfterCreation = fetchProductsubcategorydropdown();
          break;
        case "DIVISION":
          createItemDataFunction = productDivisionCreate(postBody);
          getDataFunctionAfterCreation = fetchproductdivisionsdropdown();
          break;
        case "BRAND":
          createItemDataFunction = productBrandsCreate(postBody);
          getDataFunctionAfterCreation = fetchproductbrandsdropdown();
          break;
        case "GROUP":
          createItemDataFunction = productGroupCreate(postBody);
          getDataFunctionAfterCreation = fetchProductgroupsdropdown();
          break;
        case "TYPE":
          createItemDataFunction = ProductTypeCreate(postBody);
          getDataFunctionAfterCreation = fetchProductTypedropdown();
        default:
          break;
      }
      const res = await dispatch(createItemDataFunction);
      // we should call it after creating new item inorder to fetch the fresh list
      if (res?.payload?.message) await dispatch(getDataFunctionAfterCreation);

      setIsAPIReqInProgress(false);
      setOpenCreateNewOptionModal(false);

      updateCreatedOption(fieldID, { ...postBody, id: res?.payload?.id })

     
    } catch (error) {
      setIsAPIReqInProgress(false);
      console.error("Error:", error);
    }
  };

  const onError = (errors: any, e: any) => console.log(errors, e);

  const handleCancelBtn = () => {
    clearErrorsCreateNewDropdown();
    resetCreateNewDropdown();
    setOpenCreateNewOptionModal(false);
  };

  const onErrors = (errorsObj: any) => {
    console.log(errorsObj, "errors");
  };

  const handleChangeCreateNewDropdown = (e: any) => {
    if (e?.target?.name === "name") {
      clearErrorsCreateNewDropdown("altName");
      setValueCreateNewDropdown("altName", e?.target?.value);
    }
  };

  return (
    <Dialog
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={classes.overflow}
      open={openCreateNewOptionModal}
      onClose={() => setOpenCreateNewOptionModal(!openCreateNewOptionModal)}
    >
      <form
        className={classes.form}
        key={2}
        onChange={handleChangeCreateNewDropdown}
      >
        <Box>
          <Typography className={classes.heading}>
            <label>{`${t("CREATE")} ${t(title)}`}</label>
          </Typography>
        </Box>
        <Grid sx={{ flexGrow: 1 }} container spacing={5}>
          <Grid item md={6}>
            {/* display category information */}
            {fieldID === "SUB_CATEGORY" && (
              <CommonSelect
                control={controlCreateNewDropdown}
                clearErrors={clearErrorsCreateNewDropdown}
                defaultValue={selectedCategoryOption[0]?.name}
                disabled={true}
                errors={errorsCreateNewDropdown}
                label={"PRODUCT_CATEGORY"}
                name="productCategory"
                noOptionsText={false}
                options={productDropdown?.Productcategory ?? []}
                placeholder={t("SELECT_CATEGORY")}
                setSelectedFieldType={""}
                setValue={setValueCreateNewDropdown}
                validateForm={{}}
              />
            )}
          </Grid>
        </Grid>

        <div style={{ display: "flex", gap: "24px" }}>
          <CommonInput
            control={controlCreateNewDropdown}
            disabled={autoCodeGenStatus}
            errors={errorsCreateNewDropdown}
            id="code"
            label="Code"
            name="newDropDownOptioncode"
            placeholder={autoCodeGenStatus ? "code" : ""}
            required={!autoCodeGenStatus}
          />
          <CommonInput
            control={controlCreateNewDropdown}
            defaultValue={itemNameToAdd}
            errors={errorsCreateNewDropdown}
            id="name"
            label="Name"
            name="name"
            required={true}
          />
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          <CommonInput
            control={controlCreateNewDropdown}
            defaultValue={itemNameToAdd}
            errors={errorsCreateNewDropdown}
            id="altName"
            label="Alternate Name"
            name="altName"
            required={true}
          />
          <CommonInput
            control={controlCreateNewDropdown}
            errors={errorsCreateNewDropdown}
            id="externalReference"
            label="Reference"
            name="externalReference"
          />
        </div>
        <Stack className={classes.btnsec}>
          <Button
            className={classes.savebtn}
            variant="contained"
            type="button"
            onClick={handleSubmitCreateNewDropdown(
              (data: Object, e: any) => {
                e?.preventDefault(), e?.stopPropagation(), onSubmit(data, e);
              },
              (errors: Object, e?: any) => onError(errors, e)
            )}
          >
            Save
          </Button>
          <Button
            className={classes.cancelbtn}
            variant="contained"
            onClick={() => handleCancelBtn()}
          >
            Cancel
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
};

export default CreateNewDropdownOption;
