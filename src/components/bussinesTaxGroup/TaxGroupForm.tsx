import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Key } from "src/@core/layouts/utils";
import CommonDrawerHeader from "src/components/common/CommonDrawerHeader";
import CommonFormActionButtons from "src/components/common/CommonFormActionButtons";
import CommonInput from "src/components/common/CommonInput";
import CommonSwitch from "src/components/common/CommonSwitch";
import { taxGroupValidateSchema } from "src/components/tax-configuration/business-tax-group/componentConfig";
import {
  CreateTaxGroupPayload,
  SingleTaxGroup,
  TaxGroup,
  TaxGroupsList,
  TaxGroupsListType,
  createTaxGroup,
  fetchTaxGroups,
  updateTaxGroup,
} from "src/store/apps/tax-configuration/tax-groups";
import { useStyles } from "./taxGroupsConfig";

interface TaxGroupsFormProps {
  handleCloseDrawer: () => void;
  item?: SingleTaxGroup;
}

type FormValues = {
  name: string;
  altName: string;
  externalReference: string;
  id: number;
  code: string;
  active: boolean;
  taxGroupType: string;
};

const TaxGroupsForm = (props: TaxGroupsFormProps) => {
  const { handleCloseDrawer, item } = props;
  const [switchActive, setSwitchActive] = useState<boolean>(true);
  const classes = useStyles();
  const { t } = useTranslation();
  const groups: TaxGroup[] = useSelector(
    (state: RootState) => state.taxGroupSlice.data.taxGroups
  );
  const listData: TaxGroupsListType[] = useSelector(
    (state: RootState) => state.taxGroupSlice.data.listGroups
  );

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
    register,
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: yupResolver(taxGroupValidateSchema(listData, item)),
  });

  useEffect(() => {
    if (!item) return;
    setValue("name", item?.name);
    setValue("altName", item?.altName);
    setValue("externalReference", item?.externalReference);
    setValue("id", item?.id);
    setValue("code", item?.code);
    setSwitchActive(item?.active ?? true);
    setValue("taxGroupType", item?.taxGroupType);
  }, [
    item?.name,
    item?.altName,
    item?.externalReference,
    item?.id,
    item?.code,
    item?.active,
    item?.taxGroupType,
    setValue,
  ]);

  const dispatch = useDispatch<AppDispatch>();

  const onErrors = (data: any) => {
    console.log(data, "errors...");
  };

  const onSubmit = async (data: FormValues, event: any) => {
    let res: any = {};
    const createPayload: CreateTaxGroupPayload = {
      active: switchActive,
      altName: data.altName,
      code: data.code,
      externalReference: data.externalReference,
      name: data.name,
      taxGroupType: data.taxGroupType,
    };
    if (!item?.id) {
      res = await dispatch(createTaxGroup(createPayload));
    } else {
      res = await dispatch(updateTaxGroup({ ...createPayload, id: item?.id }));
    }
    handleCloseDrawer();
    await dispatch(TaxGroupsList());
    reset();
  };

  const handleChange = (e: any) => {
    if (e?.target?.name === "name") {
      clearErrors("altName");
      setValue("altName", e?.target?.value);
    }
  };

  useEffect(() => {
    async function fetch() {
      await dispatch(fetchTaxGroups()).catch(console.error);
    }
    fetch();
  }, []);

  return (
    <>
      <div className={classes.drawerWrapper}>
        <CommonDrawerHeader
          title={item?.id ? t("EDIT_TAX_GROUP") : t("NEW_TAX_GROUP")}
          handleClose={handleCloseDrawer}
        />
        <form
          className={classes.form}
          onSubmit={handleSubmit(onSubmit, onErrors)}
          onChange={handleChange}
        >
          <div className={classes.formContent}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label> {t("TAX_GROUP_TYPE")}</label>
              <FormControl>
                {/* <InputLabel id="revest-taxgrouptype-simple-select-label">
                {t("TAX_GROUP_TYPE")}
              </InputLabel> */}
                <Select
                  labelId="revest-taxgrouptype-simple-select-label"
                  id="demo-simple-select"
                  placeholder={t("TAX_GROUP_TYPE")}
                  {...register("taxGroupType")}
                  // required={true}
                  sx={{ height: "40px" }}
                  error={!!errors?.taxGroupType}
                  defaultValue={item?.taxGroupType}
                  onChange={() => clearErrors()}
                >
                  {groups.map((g) => (
                    <MenuItem value={g.code} key={g.id}>
                      {t(g?.code)}
                    </MenuItem>
                  ))}
                </Select>

                <FormHelperText
                  sx={{
                    color: "#EA5455",
                    margin: 0,
                    marginTop: "4px",
                  }}
                >
                  {" "}
                  {t(Key(errors["taxGroupType"]?.message))}
                </FormHelperText>
              </FormControl>
            </div>
            <CommonInput
              name="code"
              id="code"
              label="Code"
              control={control}
              errors={errors}
              required={true}
              defaultValue={item?.code}
            />

            <CommonInput
              name="name"
              id="name"
              label="Name"
              required={true}
              control={control}
              errors={errors}
              defaultValue={item?.name}
            />
            <CommonInput
              name="altName"
              id="altName"
              label="Alternate Name"
              required={true}
              control={control}
              errors={errors}
              defaultValue={item?.altName}
            />

            <CommonInput
              name="externalReference"
              id="externalReference"
              label="Reference"
              control={control}
              errors={errors}
              defaultValue={item?.externalReference}
            />
            <>
              <div>
                <div style={{ marginLeft: "-12px", marginTop: "-8px" }}>
                  <CommonSwitch
                    active={switchActive}
                    setActive={setSwitchActive}
                    statusChange={() => ({})}
                  />{" "}
                  {switchActive ? t("ACTIVE") : t("INACTIVE")}
                </div>
              </div>
            </>
          </div>
          <CommonFormActionButtons handleCloseDrawer={handleCloseDrawer} />
        </form>
      </div>
    </>
  );
};

export default TaxGroupsForm;
