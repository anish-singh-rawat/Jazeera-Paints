import { cloneDeep } from "lodash";
import moment from "moment";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import AppEvent from "src/app/AppEvent";
import { AppDispatch, RootState } from "src/store";
import { markValueCreate } from "src/store/apps/mark-value/mark_value";
import { createPrice, getPriceListByID } from "src/store/apps/price-list";
import { getPriceListData } from "src/store/apps/pricelist/price-list";
import { getPriceCodeMapping } from "src/store/apps/pricelist/price-status";
import ResponsiveDialog from "../common/CommonDialog";
import { CopyPriceForm } from "./copy-code-component";
import MarkDownComponent from "./markdown-component";
const prepareCreatePayload = (transform: any, name: any, code: string) => {
  const productPrice = [];
  for (const data of transform?.productPriceList || []) {
    productPrice.push({
      price: data.price,
      UOMId: data?.UOMId,
      sku: data.sku,
      minimumPrice: data.minimumPrice,
      productId: data.productId,
      startDate: moment(data.startDate).format("YYYY-MM-DD"),
      endDate: moment(data.endDate).format("YYYY-MM-DD"),
      active: data.active,
      conversion: data.conversion,
      status: data.status,
      companyId: data.companyId,
      tenantId: data.tenantId,
    });
  }
  return {
    code,
    name,
    altName: name,
    externalReference: transform["externalReference"],
    priceType: transform["priceType"],
    status: "DRAFT",
    active: true,
    currencyId: transform["currency"]?.id,
    productPrice: productPrice,
  };
};

interface AssignModalProps {
  open: boolean;
  handleClose: () => void;
  checkedUsers?: any[];
  setCheckedUsers?: (users: any[]) => void;
  copyPrice?: boolean | any;
  data?: any;
  selectedRowIds: [];
  setOpen: any;
}

export default function MarkDownModal({
  open,
  handleClose,
  copyPrice,
  data,
  selectedRowIds,
  setOpen,
}: AssignModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const pricelist = useSelector((state: RootState) => state.priceListData.data);
  const { t } = useTranslation();
  const [copydata, setCopyData] = useState<{ value: string; error: string }>({
    value: "",
    error: "",
  });
  const [code, setCode] = useState<{ value: string; error: string }>({
    value: "",
    error: "",
  });
  const [value, setValue] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"markUp" | "markDown">("markUp");
  const [changeTab, setChangeTab] = useState<"Percent" | "Value">("Percent");
  const [markupvalueError, setMarkupvalueError] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  const getPriceListCodeStatus = useSelector(
    (state: RootState) => state.priceListStatus.code
  );

  const handleTabClick = (tab: any) => {
    const currentValue = Object.values(value)[0];
    setActiveTab(tab);
    setValue({ [`${tab}${changeTab}`]: currentValue });
  };

  const getCopyError = useMemo(() => {
    if (!copydata.value) return "";
    if (copydata.value.length > 25 || copydata.value.length < 2)
      return t("COPY_NAME_LENGTH_ERROR");
    const isExists = pricelist.find(
      (d) => d?.name?.toLowerCase() == copydata.value.toLowerCase()
    );
    if (isExists) {
      return t("NAME_ALREADY_EXISTS");
    }
    return "";
  }, [copydata.value]);

  const getCodeError = useMemo(() => {
    if (getPriceListCodeStatus) return "";
    if (!code.value) return "";
    if (code.value.length != 5) return t("CODE_LENGTH_ERROR");
    const isExists = pricelist.find((d) => d?.code == code.value);
    if (isExists) {
      return t("CODE_ALREADY_EXISTS");
    }
    return "";
  }, [code.value]);

  function checkCopyError() {
    let result = false;
    if (!copydata.value) {
      setCopyData((p) => ({ ...p, error: t("REQUIRED") }));
      result = true;
    }
    if (!getPriceListCodeStatus) {
      if (!code.value) {
        setCode((p) => ({ ...p, error: t("REQUIRED") }));
        result = true;
      }
    }
    return result;
  }

  const handleCopyRole = async () => {
    setLoadingState(true);
    try {
      if (checkCopyError()) return;

      if (Boolean(getCodeError) || Boolean(getCopyError)) return;

      const id = data.id;
      const pricelListData = await dispatch(getPriceListByID(id));
      const payload = cloneDeep(pricelListData.payload);

      const updated = prepareCreatePayload(payload, copydata.value, code.value);
      if (getPriceListCodeStatus) delete updated.code;
      const res = await dispatch(createPrice(updated));
      setCopyData({ error: "", value: "" });
      setCode({ error: "", value: "" });
      handleClose();
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(getPriceListData()).catch(() => {});
      setLoadingState(false);
    }
  };

  const handleChange = (tab: "Percent" | "Value") => {
    setChangeTab(tab);
    const currentValue = Object.values(value)[0];
    setValue({ [`${activeTab}${tab}`]: currentValue });
  };

  const handleSave = async () => {
    setLoadingState(true);
    try {
      const isCheck = Object.values(value).filter((d) => d.length);
      if (!isCheck.length) {
        setMarkupvalueError(true);
        return;
      }

      let payload = {
        priceList: selectedRowIds,
        ...value,
      };
      let res: any;

      res = await dispatch(markValueCreate(payload));
      handleClose();
    } catch (error) {
      console.error("Error in handleSave:", error);
    } finally {
      setLoadingState(false);
      setValue({});
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]*$/;
    if (!regex.test(e.target.value)) return;

    setValue({
      [`${activeTab}${changeTab}`]: e.target.value,
    });

    if (markupvalueError) setMarkupvalueError(false);
  };

  function clearPrevState() {
    setCode({ error: "", value: "" });
    setCopyData({ error: "", value: "" });
  }

  function clearMarkUpState() {
    setMarkupvalueError(false);
    setValue({
      [`${activeTab}${changeTab}`]: "",
    });
  }

  if (copyPrice)
    return (
      <ResponsiveDialog
        open={open}
        setOpen={setOpen}
        handleSubmit={handleCopyRole}
        loadingState={loadingState}
        dialogBoxTitle={t("COPY_PRICE_LIST")}
        clearPrevState={clearPrevState}
        dialogComponent={() => (
          <CopyPriceForm
            code={code}
            needToSetCode={!getPriceListCodeStatus}
            t={t}
            setCopyData={setCopyData}
            setCode={setCode}
            getCopyError={getCopyError}
            copydata={copydata}
            getCodeError={getCodeError}
          />
        )}
      />
    );

  return (
    <ResponsiveDialog
      open={open}
      setOpen={setOpen}
      dialogBoxTitle={t("MARK_UP_DOWN")}
      handleSubmit={handleSave}
      loadingState={loadingState}
      clearPrevState={clearMarkUpState}
      dialogComponent={() => (
        <MarkDownComponent
          activeTab={activeTab}
          changeTab={changeTab}
          handleChange={handleChange}
          handleInputChange={handleInputChange}
          handleTabClick={handleTabClick}
          markupvalueError={markupvalueError}
          value={value}
        />
      )}
    />
  );
}
