// ** React Imports
import { useEffect } from "react";

// ** Next Imports
import { useRouter } from "next/router";

// ** Spinner Import
import Spinner from "src/@core/components/spinner";

// ** Hook Imports
import useTranslations from "src/hooks/useTranslations";
import { ROOT_BASE_API } from "src/store/apps";
import { useAuth } from "src/hooks/useAuth";

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = (role: string) => {
  if (role === "client") return "/acl";
  else return "/dashboards/analytics";
};

const Home = () => {
  // ** Hooks

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const homeRoute = getHomeRoute("changeAfter");

    // Redirect user to Home URL
    router.replace(homeRoute);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Spinner />;
};

export default Home;
