import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Checkbox, Switch, Typography, Grid, Button, Box, Card } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import  { paymentMethodsCreate, 
          paymentMethodsList,  
          paymentMethodsUpdate, 
          storesUpdate,
          storesGetById
        } from 'src/store/apps/storeSettings/storeSettings';
// Translation
import { t } from "i18next";

// Next Import
import { useRouter } from "next/router";

//Utils
import { Key } from "src/@core/layouts/utils";
import { AppDispatch, RootState } from 'src/store';
import CommonFormActionButtons from 'src/components/common/CommonFormActionButtons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AppEvent from 'src/app/AppEvent';
import CommonSwitch from 'src/components/common/CommonSwitch';
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
 grid:{
 "& .MuiDataGrid-columnHeaderTitle": {
   fontSize: "12px",
   fontWeight: 600,
   letterSpacing: "1px",
   whiteSpace: "normal",
   lineHeight: "normal",
  
  },
}}));

const PaymentMethods: React.FC = () => {
  const [localPaymentMethods, setLocalPaymentMethods] = useState<PaymentMethod[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { t } = useTranslation();
  const classes = useStyles();

  interface PaymentMethod {
    id: number;
    method: string;
    status: boolean;
    image: string;
    code: string; //to resove the error for code
    cashDrawer?: boolean;
    cashRoundup?: boolean;
    // Add additional fields as necessary
  }

  const storeSettingsStore: any = useSelector(
    (state: RootState) => state.storeSettingsStore
  );

  const storeCreateResponse: any = useSelector(
    (state: RootState) => state.storeSettingsStore.res
  );

  useEffect(() => {
    dispatch(paymentMethodsList());
  }, [dispatch]);

useEffect(() => {
  const isEditMode = !!storeSettingsStore.dataById && !!storeSettingsStore.dataById.id;

  if (isEditMode) {
    // Edit mode logic
    const storePaymentMethods = storeSettingsStore.dataById?.storePaymentMethodMapping || [];
    if (storePaymentMethods.length === 0) {
      // No payment methods for the store, use the default list
      const defaultPaymentMethods = storeSettingsStore.paymentData.map((method:any) => ({
        id: method?.id,
        method: method?.name,
        status: false,
        image: method?.image,
        code: method?.code,
        cashDrawer: method?.code === 'CASH' ? false : null,
        cashRoundup: method?.code === 'CASH' ? false : null,
      }));
      setLocalPaymentMethods(defaultPaymentMethods);
    }else{
      const updatedPaymentMethods = storePaymentMethods.map((method:any) => ({
        id: method?.paymentMethodId,
        method: method?.paymentMethods?.name,
        status: method?.status,
        image: method?.paymentMethods?.image,
        code: method?.paymentMethods?.code,
        cashDrawer: method?.paymentMethods?.code === 'CASH' ? method?.cashDrawer : null,
        cashRoundup: method?.paymentMethods?.code === 'CASH' ? method?.cashRoundup : null,
      }));
      setLocalPaymentMethods(updatedPaymentMethods);
    } 
  }else {
    // Create mode logic
    if (storeSettingsStore.paymentData) {
      const defaultPaymentMethods = storeSettingsStore.paymentData.map((method:any) => ({
        id: method?.id,
        method: method?.name,
        status: false,
        image: method?.image,
        code: method?.code,
        cashDrawer: method?.code === 'CASH' ? false : null,
        cashRoundup: method?.code === 'CASH' ? false : null,
      }));
      setLocalPaymentMethods(defaultPaymentMethods);
    }
  }
}, [storeSettingsStore.paymentData, storeSettingsStore.dataById]);

  const handleStatusChange = (id: number) => {
    setLocalPaymentMethods(localPaymentMethods.map(item => item.id === id ? { ...item, status: !item.status } : item));
  };

  const handleCashDrawerChange = (id: number, checked: boolean) => {
    setLocalPaymentMethods(localPaymentMethods.map(item => item.id === id ? { ...item, cashDrawer: checked } : item));
  };

  const handleCashRoundupChange = (id: number, checked: boolean) => {
    setLocalPaymentMethods(localPaymentMethods.map(item => item.id === id ? { ...item, cashRoundup: checked } : item));
  };

  const columns: any = [
    {
      field: "method",
      headerName: t("METHOD"),
      width: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Box display="flex" alignItems="center">
          <img src={params.row.image} alt={params.value} style={{ marginRight: 8 ,width: 40, height: 24}} />
          <Typography>{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: t("STATUS"),
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <CommonSwitch 
          active={localPaymentMethods.find((item) => item.id === params.id)?.status || false}
          statusChange={() => handleStatusChange(params.id as number)}
        />
      ),
    },
    {
      field: 'cashDrawer',
      headerName: t("CASH DRAWER"),
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        const isEnabled = localPaymentMethods.find((item) => item.id === params.id)?.status || false;
        return(
          params.value !== null && 
          (
          <Checkbox 
            checked={localPaymentMethods.find((item) => item.id === params.id)?.cashDrawer || false} 
            disabled={!isEnabled}
            onChange={(e) => handleCashDrawerChange(params.id as number, e.target.checked)}
          />
          )
        );
      },
    },
    {
      field: 'cashRoundup',
      headerName: t("CASH ROUNDUP"),
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => {
        const isEnabled = localPaymentMethods.find((item) => item.id === params.id)?.status || false;
        return(
          params.value !== null && (
          <Checkbox 
            checked={localPaymentMethods.find((item) => item.id === params.id)?.cashRoundup || false} 
            disabled={!isEnabled}
            onChange={(e) => handleCashRoundupChange(params.id as number, e.target.checked)}
          />
          )
        )
      },
    },
    // Add additional columns as necessary
  ];

  const { reset, handleSubmit } = useForm({
    defaultValues: localPaymentMethods,
    mode: "onChange"
  });

  const onSubmit = async () => {
    const isEditMode = !!storeSettingsStore.dataById && !!storeSettingsStore.dataById.id;
    const storeId = isEditMode ? storeSettingsStore.dataById.id : storeCreateResponse?.id;
  
    if (!storeId) {
      console.error('Store ID is not available');
      return;
    }
  
    const paymentMethodSettings = localPaymentMethods.map(method => {
      // Start with the common fields
      const methodPayload = {
        storeId: storeId,
        paymentMethodId: method.id,
        status: method.status,
        cashDrawer: method.status ? method.cashDrawer : false,
        cashRoundup: method.status ? method.cashRoundup : false,
      };
  
      // Add 'id' for existing payment methods in edit mode
      if (isEditMode) {
        const existingMethod = storeSettingsStore.dataById?.storePaymentMethodMapping?.find((pm:any) => pm.paymentMethodId === method.id);
        if (existingMethod) {
          methodPayload.id = existingMethod.id; // Use the id from the existing mapping
        }
      }
  
      return methodPayload;
    });
  
    try {
      const response = await dispatch(storesUpdate({ id: storeId, paymentMethodSettings }));
      if (response?.payload?.message) {
        router.push('/general-setup/stores');
      } else {
        throw new Error(response?.payload?.error?.message || 'Operation failed');
      }
    } catch (error:any) {
      console.error('Error during operation:', error);
    }
  };
  
  const handleCloseDrawer = () => {
    router.back();
    // setOpen(false);
    reset();
  };

  return (
    <>
      {/*header card as of now commenting */}
      {/* <Card style={{marginBottom:'20px'}}>
         <Grid container display={"flex"} flexDirection={"column"} sx={{ p: 6 }}>
          <Typography variant={"h6"}>{t(Key("PAYMENT_METHODS"))}</Typography>
          <Typography variant="body2">
            {t(Key("CASH_CARDS_GIFT_CARDS"))}
          </Typography>
        </Grid>
      </Card> */}
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card style={{marginBottom:'20px'}}> 
          <Box style={{width: '100%'}} className={classes.grid}> 
            <DataGrid
              autoHeight
              rows={localPaymentMethods}
              columns={columns}
              disableSelectionOnClick
              pageSize={localPaymentMethods.length} // to remove pagination
              rowsPerPageOptions={[localPaymentMethods.length]} // to remove pagination
              components={{
                Pagination: () => null,
              }}
            />
          </Box>
        </Card>
        <Card style={{ display: "flex", justifyContent: "flex-end" }}>
          <CommonFormActionButtons
              handleCloseDrawer={handleCloseDrawer}
              // disabled={storeSettingsStore.isLoading}
            />
        </Card>
      </form>
    </>
  );
};

export default PaymentMethods;
