import { Box, Card, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import Image from "next/image";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Icon from "src/@core/components/icon";
import CommonSelect from "src/components/common/CommonSelect";
import { AppDispatch, RootState } from "src/store";
import { fetchUserTypes } from "src/store/apps/role_permission";
import warning from "../../../public/images/icons/project-icons/info-circle.png";
import AppStorage from "src/app/AppStorage";

const useStyles = makeStyles({
  commonHeaderRoot: {
    padding: "16px 24px",
    border: "1px solid rgba(75, 70, 92, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    borderBottom: "none",
  },
  search: {
    gap: "16px",
  },
  search_button: {
    textTransform: "capitalize",
  },
  actionBtns: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
  },
  createRecordBtn: {
    textTransform: "unset",
    fontSize: "12.5px",
  },
  redSearch: {
    "& input": {
      border: "1px solid red",
    },
  },
});

interface HeaderProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  handleClick: () => void;
  setIsSearchClicked: React.Dispatch<React.SetStateAction<boolean>>;
  isSearchClicked: boolean;
  searchButtonHandleClick: () => void;
  control: () => void;
  setValue: () => void;
  watch: () => void;
  clearErrors: () => void;
  errors: () => void;
  isEditPermissionEnabled: Boolean;
}

const Header = ({
  text,
  setText,
  handleClick,
  setIsSearchClicked,
  isSearchClicked,
  control,
  setValue,
  clearErrors,
  watch,
  errors,
  searchButtonHandleClick,
  isEditPermissionEnabled,
}: HeaderProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (text === "") {
      setText("");
    }
  }, [text]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUserTypes());
  }, []);

  const classes = useStyles();

  useEffect(() => {
    setTimeout(() => {
      setIsSearchClicked(false);
    }, 2000);
  }, [isSearchClicked]);
  const changeLanguage: any = AppStorage.getData("lang");

  const usersPermission = useSelector((state: RootState) =>
    state?.userTypes?.data.map((p) => ({
      ...p,
      ...(changeLanguage === "en-US"
        ? {
            name: t(p?.name.replace(/[^a-zA-Z0-9]/g, "_"))
              ? t(p?.name.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase())
              : p.name,
          }
        : {
            altName: t(p?.altName.replace(/[^a-zA-Z0-9]/g, "_"))
              ? t(p?.altName.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase())
              : p.altName,
          }),
    }))
  );

  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        flexWrap: "wrap",
        margin: "0px",
        width: "96.5%",

        "@media (max-width:750px)": { flexDirection: "column" },
      }}
    >
      <Box
        sx={{
          width: "35%",
          display: "flex",
          gap: "10px",
          "@media (max-width:750px)": { width: "100%" },
        }}
      >
        <Image src={warning} height={20} width={20} alt="header" />
        <p style={{ padding: "0px", margin: "0px" }}>
          {t("ROLE_PERMISSION_HEADER")}
        </p>
      </Box>

      <Box
        sx={{
          width: "30%",
          "@media (max-width:750px)": { width: "100%", marginTop: "7px" },
        }}
      >
        <CommonSelect
          name="typePermission"
          options={usersPermission ?? []}
          control={control}
          label={"Types of Permission"}
          placeholder={"Select type of permission"}
          validateForm={{}}
          required={true}
          errors={errors}
          setValue={setValue}
          noOptionsText={false}
          clearErrors={clearErrors}
          active={true}
          defaultValue={t("ALL")}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          width: "30%",
          marginTop: "15px",
          "@media (max-width:750px)": { width: "100%" },
        }}
      >
        <form style={{ display: "flex", width: "100%" }} onSubmit={handleClick}>
          <TextField
            size="small"
            fullWidth
            type="search"
            sx={{
              mr: 2,
              "& .MuiInputBase-input": {
                height: "23px",
              },
            }}
            value={text}
            error={isSearchClicked && text == ""}
            placeholder={t("SEARCH_BY_ROLE_NAME") as string}
            onChange={(e: any) => setText(e.target.value)}
          />

          <Button
            variant="outlined"
            size="medium"
            className={classes.search_button}
            type="submit"
          >
            <Icon fontSize="1.45rem" icon="tabler:search" />
          </Button>
        </form>
      </Box>
    </Card>
  );
};

export default Header;
