import React from "react";
import CommonHorizontalTabs from "src/components/common/CommonHorizontalTabs";
import Conditions from "./Conditions";
import ConditionRecords from "./ConditionRecords";

const index = () => {
  // Tabs Import
  const tabLabels = ["Conditions", "Condition Records"];
  const tabContents = [<Conditions />, <ConditionRecords />];

  return (
    <>
      <CommonHorizontalTabs tabLabels={tabLabels} tabContents={tabContents} />
    </>
  );
};

export default index;
