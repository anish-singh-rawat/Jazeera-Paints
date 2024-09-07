// ** React Imports
import { ReactNode, Suspense } from "react";

// ** Next Imports
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Router } from "next/router";

// ** Store Imports
import { Provider } from "react-redux";
import { store } from "src/store";

// ** Loader Import
import NProgress from "nprogress";

// ** Emotion Imports
import type { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

// ** Config Imports
import { defaultACLObj } from "src/configs/acl";
import "src/configs/i18n";
import themeConfig from "src/configs/themeConfig";

// ** Fake-DB Import
import "src/@fake-db";

// ** Third Party Import
import { Toaster } from "react-hot-toast";

// ** Component Imports
import AclGuard from "src/@core/components/auth/AclGuard";
import ThemeComponent from "src/@core/theme/ThemeComponent";
import ToastMessage from "src/components/common/ToastMessage";
import UserLayout from "src/layouts/UserLayout";

import AuthGuard from "src/@core/components/auth/AuthGuard";
import GuestGuard from "src/@core/components/auth/GuestGuard";
import WindowWrapper from "src/@core/components/window-wrapper";

// ** Spinner Import
import Spinner from "src/@core/components/spinner";

// ** Contexts
import {
  SettingsConsumer,
  SettingsProvider,
} from "src/@core/context/settingsContext";
import { AuthProvider } from "src/context/AuthContext";

// ** Styled Components
import ReactHotToast from "src/@core/styles/libs/react-hot-toast";
// ** Utils Imports
import { createEmotionCache } from "src/@core/utils/create-emotion-cache";

// ** Prismjs Styles
import "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism-tomorrow.css";

// ** React Perfect Scrollbar Style
import "react-perfect-scrollbar/dist/css/styles.css";

import "src/iconify-bundle/icons-bundle-react";
// ** Global css styles
import "../../styles/globals.css";


import { LicenseInfo } from '@mui/x-license-pro';
LicenseInfo.setLicenseKey('ed39e125e9d3bcf02baccc16a768d58aTz04MTkzMixFPTE3MzY1MTU4OTMwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
};

type GuardProps = {
  authGuard: boolean;
  guestGuard: boolean;
  children: ReactNode;
};

const clientSideEmotionCache = createEmotionCache();

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });
  Router.events.on("routeChangeError", () => {
    NProgress.done();
  });
  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>;
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>;
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>;
  }
};

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false;
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>
    ));

  const setConfig = Component.setConfig ?? undefined;

  const authGuard = Component.authGuard ?? true;

  const guestGuard = Component.guestGuard ?? false;

  const aclAbilities = Component.acl ?? defaultACLObj;

  return (
    <Suspense fallback={<Spinner />}>
      <Provider store={store}>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>{`${themeConfig.templateName} - Retail POS`}</title>
            <meta
              name="description"
              content={`${themeConfig.templateName} – Unified retail platform`}
            />
            <meta name="keywords" content="Unified retail platform" />
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>

          <AuthProvider>
            <SettingsProvider
              {...(setConfig ? { pageSettings: setConfig() } : {})}
            >
              <SettingsConsumer>
                {({ settings }) => {
                  return (
                    <ThemeComponent settings={settings}>
                      <ToastMessage></ToastMessage>
                      <WindowWrapper>
                        <Guard authGuard={authGuard} guestGuard={guestGuard}>
                          <AclGuard
                            aclAbilities={aclAbilities}
                            guestGuard={guestGuard}
                          >
                            {getLayout(<Component {...pageProps} />)}
                          </AclGuard>
                        </Guard>
                      </WindowWrapper>
                      <ReactHotToast>
                        <Toaster
                          position={settings.toastPosition}
                          toastOptions={{ className: "react-hot-toast" }}
                        />
                      </ReactHotToast>
                    </ThemeComponent>
                  );
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </AuthProvider>
        </CacheProvider>
      </Provider>
    </Suspense>
  );
};

export default App;
