import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  ListItemText,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonSelect from "src/components/common/CommonSelect";
import { RootState } from "src/store";
import { useSelector } from "react-redux";
import { defaultRecordsValues } from "src/types/forms/promotion/externalPromotion/externalPromotionTypes";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const useStyles = makeStyles({
  commonSelect: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  errorMsg: {
    color: "#EA5455",
    margin: 0,
    marginTop: "4px",
  },
});

interface ConditionalRecordHeaderProps {
  setSelectedFieldType: string | any;
  setSelectedLegalEntityId: string | any;
  selectedFieldType: string;
  externalPromotionColumn: any;
  onSubmitForm: any;
  userProfileData: any;
}

const ConditionalRecordHeader = ({
  selectedFieldType,
  setSelectedFieldType,
  setSelectedLegalEntityId,
  onSubmitForm,
  userProfileData,
}: ConditionalRecordHeaderProps) => {
  const [item, setItem] = useState(defaultRecordsValues);

  const [newValue, setNewValue] = useState([]);

  const schema = yup.object().shape({
    code: yup.string(),
    name: yup.string(),
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: item,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue("companyId", userProfileData?.company);
    setValue("legalEntityId", userProfileData?.legalEntity);
  }, [item, setValue]);

  const { t } = useTranslation();

  const classes = useStyles();

  const externalPromotion: any = useSelector(
    (state: RootState) => state.externalPromotion
  );

  const handleSelectionChange = (event: any, newValue: any) => {
    setNewValue(newValue);
  };

  useEffect(() => {
    setNewValue([]);
  }, [selectedFieldType]);

  const onSubmit = async (data: any, event: any) => {
    data.companyId = 1;
    data.legalEntityId = 1;
    (data.externalPromotionHeader =
      newValue.length > 0
        ? newValue.map((item: any) => item.id).join(",")
        : ""),
      (data.promotionType = data?.promotionType?.code);
    onSubmitForm({ selectedFieldType, ...data });
  };

  const onErrors = (data: any) => {
    console.log(data, "errors");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onErrors)}>
      <Box
        component={"div"}
        display={"flex"}
        flexDirection={"column"}
        p={8}
        gap={3}
      >
        <Box component={"div"} display={"flex"} gap={"14px"}>
          <Box component={"div"} style={{ width: "25%" }}>
            <CommonSelect
              name="companyId"
              options={[userProfileData?.company] || []}
              control={control}
              label={"COMPANY"}
              // placeholder={"Select type of permission"}
              validateForm={{}}
              required={true}
              errors={errors}
              setValue={setValue}
              noOptionsText={false}
              clearErrors={clearErrors}
              active={true}
              defaultValue={""}
              disabled
              // setSelectedFieldType={setSelectedFieldType}
            />
          </Box>

          <Box component={"div"} style={{ width: "25%" }}>
            <CommonSelect
              name="legalEntityId"
              options={externalPromotion?.legalEntity || []}
              control={control}
              label={"LEGAL_ENTITY"}
              // placeholder={"Select type of permission"}
              validateForm={{}}
              required={true}
              errors={errors}
              setValue={setValue}
              noOptionsText={false}
              clearErrors={clearErrors}
              active={true}
              // defaultValue={t("ALL")}
              // disabled
              // setSelectedFieldType={setSelectedFieldType}
              setSelectedLegalEntityId={setSelectedLegalEntityId}
            />
          </Box>

          <Box component={"div"} style={{ width: "25%" }}>
            <CommonSelect
              name="promotionType"
              options={externalPromotion?.lookUpData || []}
              control={control}
              label={"CONDITION_TYPE"}
              validateForm={{}}
              required={true}
              errors={errors}
              setValue={setValue}
              defaultValue={[]}
              noOptionsText={false}
              clearErrors={clearErrors}
              setSelectedFieldType={setSelectedFieldType}
            />
          </Box>
          <Box component={"div"} style={{ width: "25%" }}>
            <div className={classes.commonSelect}>
              <label>{t("KEY_COMBINATION_HEADER")}</label>
              <FormControl>
                <Autocomplete
                  multiple
                  id="checkboxes-tags"
                  options={[...(externalPromotion?.data || [])].sort((a, b) =>
                    newValue.some((item: any) => item.id === a.id)
                      ? -1
                      : newValue.some((item: any) => item.id === b.id)
                      ? 1
                      : 0
                  )}
                  disableCloseOnSelect
                  getOptionLabel={(option: any) => option?.name || ""}
                  // filterSelectedOptions
                  renderOption={(props, option: any, { selected }) => (
                    <li {...props} key={option.id}>
                      <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="medium" />}
                        checkedIcon={<CheckBoxIcon fontSize="medium" />}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      <ListItemText primary={option?.name} />
                    </li>
                  )}
                  value={newValue}
                  onChange={handleSelectionChange}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label={
                        newValue.length > 0
                          ? `${newValue.length}/${externalPromotion?.data.length} Selected`
                          : ""
                      }
                      InputLabelProps={{
                        style: newValue.length > 0 ? { color: "#2196f3" } : {},
                      }}
                      size="small"
                    />
                  )}
                  renderTags={() => null}
                  disabled={selectedFieldType === "all"}
                />
              </FormControl>
            </div>
          </Box>
        </Box>
        <Box component={"div"} display={"flex"} justifyContent={"flex-end"}>
          <Button
            type="submit"
            variant="contained"
            size="medium"
            sx={{ paddingY: 2, paddingX: 9, fontSize: "12px" }}
          >
            {t("GO")}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default ConditionalRecordHeader;
