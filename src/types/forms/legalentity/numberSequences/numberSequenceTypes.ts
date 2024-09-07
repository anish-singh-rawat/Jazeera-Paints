export const defaultValues: GroupItem = {
    id: "",
    active: true,
    altName: "",
    code: "Auto Generated",
    name: "",
    largestNum: "",
    smallestNum: "",
    nextSequence: "",
    //tenantId: "",
    //companyId: "",
    // createdOn: "",
    // createdBy: "",
    // updatedOn: "",
    // updatedBy: "",
    externalReference: "",
    //totalProducts: "",
  };
  
  export type NumerSequenceDataTableType = {
    data: [];
    handleEditPage: Function;
    groupItem: GroupItem;
    setGroupItem: Function;
    selectedRecord: Function;
    isLoading: boolean;
  };
  
  export type GroupItem = {
    id: string;
    active: boolean;
    altName: string;
    code: string;
    name: string;
    largestNum: string,
    smallestNum: string,
    nextSequence: string,
    //tenantId: string;
    //companyId: string;
   // createdOn: string;
   // createdBy: string;
   // updatedOn: string;
   // updatedBy: string;
    externalReference: string;
   // totalProducts: string;
  };
  