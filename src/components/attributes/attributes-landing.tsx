import { Box, Card } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { axiosInstance } from "src/configs/axios";
import { defaultValues } from "src/types/forms/customerAttributeTypes";
import AttributesForm from "./attributes-form";
import CustomerAttributesTable from "./AttributesTable";
import CustomerAttributesTabs from "./AttributesTabs";
import { buildAttributeSequenceMappingCode, buildAttributeUrl, tabLabels } from "./utils";
import { useDispatch } from "react-redux";
import { sequenceMappingCodeSearch } from "src/store/apps/sequenceMapping/sequenceMapping";
import { AppDispatch } from "src/store";

type attributeType = "Product" | "Customer";

interface GenericAttributesLandingProps {
  readonly attribute: attributeType;
}
export default function GenericAttributesLanding(
  props: GenericAttributesLandingProps
) {
  const [attributeData, setAttributeData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentAttributeValue, setCurrentAttributeValue] =
    useState(defaultValues);
  const [newPage, setNewPage] = useState(1);
  const [page, setPage] = useState(0);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isNewLoading, setIsNewLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>()

  const getTabId = () => {
    let tabId = 1;
    if (router?.query?.tabId && typeof router?.query?.tabId === "string") {
      if (
        parseInt(router?.query?.tabId) <= 4 &&
        parseInt(router?.query?.tabId) >= 0
      )
        tabId = parseInt(router?.query?.tabId) + 1;
      else {
        const query = { ...router.query };
        query["tabId"] = "0";
        router.replace({ query: query });
      }
    }
    return tabId;
  };

  const resetPagination = () => {
    if (page > 0) setPage(0);
    setNewPage(1);
  };

  const tableData = useMemo(() => {
    if (searchValue) {
      const searchedText = searchValue.toLowerCase();
      const filteredData = attributeData.filter((attribute: any) => {
        const activeText = attribute?.active ? "active" : "inactive";
        if (
          attribute?.code?.toLowerCase()?.includes(searchedText) ||
          attribute?.name?.toLowerCase()?.includes(searchedText) ||
          attribute?.altName?.toLowerCase()?.includes(searchedText) ||
          attribute?.externalReference?.toLowerCase()?.includes(searchedText) ||
          activeText===searchedText
        ) {
          return attribute;
        }
      });
      resetPagination();
      return filteredData;
    } else {
      resetPagination();
      return attributeData;
    }
  }, [searchValue, attributeData]);

  const endPoint = buildAttributeUrl(props.attribute, getTabId() as any);
  const sequenceMappingCode = buildAttributeSequenceMappingCode(props.attribute, getTabId() as any);

  const fetchAttributes = async () => {
    setIsLoading(true);
    setAttributeData([]);
    try {
      const response = await axiosInstance.get(endPoint);
      if (Array.isArray(response.data?.data))
        setAttributeData(response.data?.data);
      setIsLoading(false);
      dispatch(sequenceMappingCodeSearch({ entityType: sequenceMappingCode }))
    } catch (e) {
      console.log(e, "error while fetching attribute");
      setIsLoading(false);
    }
  };

  const newOrUpdateAttributesCallback = () => {
    setCurrentAttributeValue(defaultValues);
    setIsOpenDrawer(false);
    setIsEdit(false);
    fetchAttributes()
  };

  const handleEditPage = (item: any) => {
    setCurrentAttributeValue(item);
    setIsEdit(true);
    setIsOpenDrawer(true);
  };

  const handleDeleteAttribute = async (id: any) => {
    try {
      const response = await axiosInstance.delete(`${endPoint}/${id}`);
      if (!response.data?.error) {
        resetPagination();
        fetchAttributes();
      }
    } catch (err) {
      console.log(err, "error while deleted attribute");
    }
  };

  const handleOpenNewAttribute = () => {
    setIsEdit(false);
    setCurrentAttributeValue(defaultValues);
    setIsOpenDrawer(true);
  };

  useEffect(() => {
    fetchAttributes();
    resetPagination();
  }, [router.query?.tabId]);

  return (
    <>
      <Card>
        <Box sx={{ marginBottom: 1 }}>
          <CustomerAttributesTabs
            tabLabels={tabLabels}
            currentTab={getTabId()}
            setSearchValue={setSearchValue}
          />
        </Box>
        <CustomerAttributesTable
          data={tableData}
          isLoading={isLoading}
          attributeType={props.attribute}
          selectedRecord={() => { }}
          handleEditPage={handleEditPage}
          handleDeleteAttribute={handleDeleteAttribute}
          handleOpenNewAttribute={handleOpenNewAttribute}
          page={page}
          setPage={setPage}
          newPage={newPage}
          setNewPage={setNewPage}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </Card>
      <AttributesForm
        attributeSuccessCallback={newOrUpdateAttributesCallback}
        attributeType={props.attribute}
        attributeValue={currentAttributeValue}
        currentAttributeDataSet={attributeData}
        handleCloseDrawer={newOrUpdateAttributesCallback}
        isEdit={isEdit}
        isNewLoading={isNewLoading}
        isOpenDrawer={isOpenDrawer}
        setIsNewLoading={setIsNewLoading}
        tabId={getTabId()}
      />
    </>
  );
}
