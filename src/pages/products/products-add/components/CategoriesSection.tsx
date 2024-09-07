import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  FormControl,
  Grid,
  Typography,
  Theme,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import CommonSelect from "src/components/common/CommonSelect";
import { AppDispatch, RootState } from "src/store";
import { Control } from "react-hook-form";
import MultiTagInput from "src/components/common/MultiTagInput";
import { useEffect, useState } from "react";
import CreateNewDropdownOption from "./CreateNewDropdownOption";
import { ProductSubcategoryBySearch } from "src/store/apps/product/product-sub-category";
import { makeStyles } from "@mui/styles";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  control: Control<any, any>;
  clearErrors: Function;
  errors: Object;
  setValue: Function;
  setTag: Function;
  tag: any[];
  custom?: number;
  getValues: any;
}

const useStyle = makeStyles({
  addedTagText: {
    "& .MuiChip-outlined": {
      backgroundColor: (theme: Theme) => theme.palette.mode === "light" ? "#DBEDFB" : "rgba(135, 130, 150, 0.87)",
    }
  }
});

const CategoriesSection: React.FC<Props> = ({
  control,
  clearErrors,
  errors,
  setValue,
  setTag,
  tag,
  custom = 3,
  getValues,
}: Props) => {
  const { t } = useTranslation();

  return (
    <CategoriesSectionForm
      control={control}
      clearErrors={clearErrors}
      errors={errors}
      setValue={setValue}
      setTag={setTag}
      tag={tag}
      custom={custom}
      getValues={getValues}
    />
  );
};

export default CategoriesSection;

const CategoriesSectionForm = ({
  control,
  clearErrors,
  errors,
  setValue,
  setTag,
  tag,
  custom = 3,
  getValues,
}: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const productDropdown: any =
    useSelector((state: RootState) => state.productdropdown) ?? [];

  const [itemNameToAdd, setItemNameToAdd] = useState("");
  const [openCreateNewOptionModal, setOpenCreateNewOptionModal] = useState(false);
  const [fieldID, setFieldID] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<
    string | number
  >("");
  const [subCategories, setSubcategories] = useState<any>([]);
  const [isSubCategoryLoading, setIsSubCategoryLoading] =
    useState<boolean>(false);
  const [newCategoryId, setNewCategoryId] = useState<any>();

  const theme = useTheme();
  const classes = useStyle(theme);

  const getSubCategoryBySelectedCategoryId = async (categoryId: number, isClearSelection: boolean = true) => {
    setIsSubCategoryLoading(true);
    try {
      const responseData: any = await dispatch(
        ProductSubcategoryBySearch(categoryId)
      );
      const subCategories = responseData?.payload?.data
      if(Array.isArray(subCategories)){
        const filteredSubCategories = subCategories.filter((item:any)=> item?.active)
        setSubcategories(filteredSubCategories);
      }
      // clear default selection of sub category
      if (isClearSelection) setValue("productSubCategory", null);
      setIsSubCategoryLoading(false);
    } catch (error) {
      setIsSubCategoryLoading(false);
    }
  };

  const getSubCategoryBySelectedCategory = () => {
    const getSelectedCategoryOption = productDropdown?.Productcategory?.filter(
      (item: any) => item?.code == selectedCategoryCode
    );
    if (getSelectedCategoryOption?.length) {
      getSubCategoryBySelectedCategoryId(getSelectedCategoryOption[0]?.id);
    }
  };

  useEffect(() => {
    if (selectedCategoryCode) {
      getSubCategoryBySelectedCategory();
    }
  }, [selectedCategoryCode]);

  // update the field selection with created new drop down option
  const updateCreatedOption = (fieldID: string, updateObj: any) => {
    switch (fieldID) {
      case "FAMILY":
        setValue("productFamily", updateObj);
        break;
      case "CATEGORY":
        setValue("productCategory", updateObj);
        getSubCategoryBySelectedCategoryId(updateObj?.id);
        setNewCategoryId(updateObj?.id);
        break;
      case "SUB_CATEGORY":
        setValue("productSubCategory", updateObj);
        getSubCategoryBySelectedCategoryId(updateObj?.productCategoryId, false);
        break;
      case "BRAND":
        setValue("productBrand", updateObj);
        break;
      case "GROUP":
        setValue("productGroup", updateObj);
        break;
      case "DIVISION":
        setValue("productDivision", updateObj);
        break;
      default:
        break;
    }
  };

  const handleNewItemData = (itemData: any) => {
    const newCreatedCategory = productDropdown.Productcategory?.filter(
      (item: any) => item.id == newCategoryId
    );
    if (newCreatedCategory?.length === 1)
      setSelectedCategoryCode(newCreatedCategory[0]?.code);
    setItemNameToAdd(itemData);
  };

  return (
    <>
      <Grid sx={{ flexGrow: 1 }} container spacing={5}>
        <Grid item md={custom} sx={{ mt: "20px" }}>
          <CommonSelect
            id="GROUP"
            control={control}
            customText={true}
            clearErrors={clearErrors}
            disabled={false}
            defaultValue={""}
            errors={errors}
            func={setItemNameToAdd}
            handleModel={() => {
              setOpenCreateNewOptionModal(true);
              setFieldID("GROUP");
              setTitle("GROUP");
            }}
            label={"GROUP"}
            name="productGroup"
            noOptionsText={true}
            options={productDropdown.Productgroups}
            placeholder={t("SELECT_GROUP")}
            validateForm={{}}
            required={false}
            setSelectedFieldType={""}
            setValue={setValue}
            sx={{ width: 300 }}
          />
        </Grid>

        <Grid item md={custom}>
          <CommonSelect
            id={"CATEGORY"}
            control={control}
            customText={true}
            clearErrors={clearErrors}
            defaultValue={""}
            disabled={false}
            errors={errors}
            func={setItemNameToAdd}
            handleModel={() => {
              setOpenCreateNewOptionModal(true);
              setFieldID("CATEGORY");
              setTitle("CATEGORY");
            }}
            label={"PRODUCT_CATEGORY"}
            name="productCategory"
            options={productDropdown.Productcategory ?? []}
            placeholder={t("SELECT_CATEGORY")}
            required={true}
            setValue={setValue}
            setSelectedFieldType={setSelectedCategoryCode}
            sx={{ width: 300 }}
            validateForm={{}}
            value={itemNameToAdd}
          />
        </Grid>

        <Grid item md={custom}>
          {isSubCategoryLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress color="inherit" size={20} />
            </div>
          ) : (
            <CommonSelect
              id={"SUB_CATEGORY"}
              control={control}
              customText={true}
              clearErrors={clearErrors}
              disabled={getValues("productCategory")?.id ? false : true}
              errors={errors}
              func={handleNewItemData}
              handleModel={() => {
                setOpenCreateNewOptionModal(true);
                setFieldID("SUB_CATEGORY");
                setTitle("SUB_CATEGORY");
                const getSelectedCategoryOption =
                  productDropdown?.Productcategory?.filter(
                    (item: any) => item?.id == newCategoryId
                  );
                let categoryCode = getValues("productCategory")?.code;
                if (!categoryCode)
                  categoryCode = getSelectedCategoryOption[0]?.code;
                setSelectedCategoryCode(categoryCode);
              }}
              label={"SUB_CATEGORY"}
              name="productSubCategory"
              noOptionsText={true}
              options={subCategories ?? []}
              placeholder={t("SELECT_SUB_CATEGORY")}
              required={true}
              setValue={setValue}
              sx={{ width: 300 }}
              validateForm={{}}
            />
          )}
        </Grid>

        <Grid item md={custom} >
          <CommonSelect
            id={"FAMILY"}
            control={control}
            clearErrors={clearErrors}
            customText={true}
            defaultValue={""}
            disabled={false}
            errors={errors}
            func={setItemNameToAdd}
            handleModel={() => {
              setOpenCreateNewOptionModal(true);
              setFieldID("FAMILY");
              setTitle("FAMILY");
            }}
            label={"Product Family"}
            name="productFamily"
            noOptionsText={true}
            options={productDropdown.Productfamily ?? []}
            placeholder={t("SELECT_FAMILY")}
            required={false}
            setValue={setValue}
            setSelectedFieldType={""}
            validateForm={{}}
          />
        </Grid>
        
        <Grid item md={custom}>
          <CommonSelect
            id={"BRAND"}
            control={control}
            customText={true}
            clearErrors={clearErrors}
            disabled={false}
            defaultValue={""}
            errors={errors}
            func={setItemNameToAdd}
            handleModel={() => {
              setOpenCreateNewOptionModal(true);
              setFieldID("BRAND");
              setTitle("BRAND");
            }}
            label={"Brand"}
            name="productBrand"
            noOptionsText={true}
            options={productDropdown.productbrands ?? []}
            placeholder={t("SELECT_BRAND")}
            validateForm={{}}
            required={false}
            setSelectedFieldType={""}
            setValue={setValue}
            sx={{ width: 300 }}
          />
        </Grid>

        <Grid item md={custom}>
          <CommonSelect
            id="DIVISION"
            control={control}
            customText={true}
            clearErrors={clearErrors}
            defaultValue={""}
            disabled={false}
            errors={errors}
            func={setItemNameToAdd}
            handleModel={() => {
              setOpenCreateNewOptionModal(true);
              setFieldID("DIVISION");
              setTitle("DIVISION");
            }}
            label={"Product Division"}
            name="productDivision"
            noOptionsText={true}
            options={productDropdown.productdivisions ?? []}
            placeholder={t("SELECT_DIVISION")}
            required={false}
            setValue={setValue}
            setSelectedFieldType={""}
            validateForm={{}}
          />
        </Grid>

        <Grid item md={custom} sx={{ paddingBottom: "15px" }}>
          <label>{t("TAGS")}</label>
          <FormControl
            fullWidth
            id="Tags_information"
            className={classes.addedTagText}
            sx={{
              mb: 1,
              position: "relative",
              padding: "0 0 20px",
            }}
          >
            <MultiTagInput tagOptions={tag} setTagOptions={setTag} />
          </FormControl>
        </Grid>
      </Grid>
      <Box>
        {openCreateNewOptionModal && (
          <CreateNewDropdownOption
            fieldID={fieldID}
            itemNameToAdd={itemNameToAdd}
            openCreateNewOptionModal={openCreateNewOptionModal}
            setOpenCreateNewOptionModal={setOpenCreateNewOptionModal}
            selectedCategoryCode={selectedCategoryCode}
            title={title}
            updateCreatedOption={updateCreatedOption}
          />
        )}
      </Box>
    </>
  );
};
