// ** React Imports
import { ReactNode, useEffect, useState } from "react";

// ** Next Import
import { useRouter } from "next/router";
import useTranslations from "src/hooks/useTranslations";
import { AuthValuesType } from "src/context/types";
import { useAuth } from "src/hooks/useAuth";

interface Props {
  children: ReactNode;
}

const WindowWrapper = ({ children }: Props) => {
  // ** State
  const [windowReadyFlag, setWindowReadyFlag] = useState<boolean>(false);
  const router = useRouter();
  useTranslations();

  useEffect(
    () => {
      if (typeof window !== "undefined") {
        setWindowReadyFlag(true);
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  );

  if (windowReadyFlag) {
    return <>{children}</>;
  } else {
    return null;
  }
};

export default WindowWrapper;
