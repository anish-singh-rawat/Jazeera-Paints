// ** Next Import
import Link from "next/link";

// ** MUI Imports
import IconButton from "@mui/material/IconButton";
import Box, { BoxProps } from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";

// ** Type Import
import { LayoutProps } from "src/@core/layouts/types";

// ** Custom Icon Import
import Icon from "src/@core/components/icon";

// ** Configs
import themeConfig from "src/configs/themeConfig";

interface Props {
  navHover: boolean;
  collapsedNavWidth: number;
  hidden: LayoutProps["hidden"];
  navigationBorderWidth: number;
  toggleNavVisibility: () => void;
  settings: LayoutProps["settings"];
  saveSettings: LayoutProps["saveSettings"];
  navMenuBranding?: LayoutProps["verticalLayoutProps"]["navMenu"]["branding"];
  menuLockedIcon?: LayoutProps["verticalLayoutProps"]["navMenu"]["lockedIcon"];
  menuUnlockedIcon?: LayoutProps["verticalLayoutProps"]["navMenu"]["unlockedIcon"];
}

// ** Styled Components
const MenuHeaderWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingRight: theme.spacing(4.5),
  transition: "padding .25s ease-in-out",
  minHeight: theme.mixins.toolbar.minHeight,
}));

const HeaderTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  lineHeight: "24px",
  fontSize: "1.875rem !important",
  color: "#c4c4c4",
  mb: "4px",
  transition: "opacity .25s ease-in-out, margin .25s ease-in-out",
}));

const VerticalNavHeader = (props: Props) => {
  // ** Props
  const {
    hidden,
    navHover,
    settings,
    saveSettings,
    collapsedNavWidth,
    toggleNavVisibility,
    navigationBorderWidth,
    menuLockedIcon: userMenuLockedIcon,
    navMenuBranding: userNavMenuBranding,
    menuUnlockedIcon: userMenuUnlockedIcon,
  } = props;

  // ** Hooks & Vars
  const theme = useTheme();
  const { mode, navCollapsed } = settings;

  const LinkStyled = styled(Link)(
    navCollapsed
      ? {
          display: "none",
        }
      : { display: "flex", alignItems: "center", textDecoration: "none" }
  );

  const menuCollapsedStyles =
    navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 };

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userNavMenuBranding) {
        return 0;
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 32) / 8;
      }
    } else {
      return 4.5;
    }
  };

  const conditionalColors = () => {
    if (mode === "semi-dark") {
      return {
        "& .MuiTypography-root, & .MuiIconButton-root": {
          color: `rgba(${theme.palette.customColors.dark}, 0.87)`,
        },
      };
    } else {
      return {
        "& .MuiTypography-root, & .MuiIconButton-root": {
          color: "text.primary",
        },
      };
    }
  };

  const MenuLockedIcon = () =>
    userMenuLockedIcon || <Icon icon="tabler:indent-decrease" />;

  const MenuUnlockedIcon = () =>
    userMenuUnlockedIcon || <Icon icon="tabler:indent-increase" />;

  return (
    <MenuHeaderWrapper
      className="nav-header"
      sx={{ pl: menuHeaderPaddingLeft(), ...conditionalColors() }}
    >
      {userNavMenuBranding ? (
        userNavMenuBranding(props)
      ) : (
        <LinkStyled href="/">
          <svg
            width="124"
            height="40"
            viewBox="0 0 164 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M125.466 17.32H120.602C119.509 17.32 118.611 16.4351 118.611 15.3566C118.611 14.2782 119.509 13.3933 120.602 13.3933H129.951C131.128 13.3933 132.082 12.453 132.082 11.2916V9.13462C132.082 7.97318 131.128 7.03296 129.951 7.03296H120.602C115.962 7.03296 112.178 10.7662 112.178 15.3428C112.178 19.9195 115.92 23.6112 120.546 23.6527H125.382C126.475 23.6527 127.372 24.5376 127.372 25.6161C127.372 26.6946 126.475 27.5795 125.382 27.5795H114.967C113.79 27.5795 112.837 28.5197 112.837 29.6811V31.8381C112.837 32.9995 113.79 33.9398 114.967 33.9398H125.382C127.638 33.9398 129.741 33.0825 131.339 31.5063C132.937 29.93 133.806 27.8422 133.806 25.6299C133.806 21.1086 130.063 17.3753 125.466 17.32Z"
              fill="#3586C7"
            />
            <path
              d="M40.1323 7.00562C32.5772 7.00562 26.4238 13.0479 26.4238 20.4728C26.4238 27.8978 32.5772 33.9401 40.1323 33.9401C42.4871 33.9401 44.7999 33.3455 46.8463 32.2117C46.8884 32.1979 46.9164 32.1703 46.9585 32.1426L48.0518 31.4374C48.5984 31.0641 48.9348 30.4419 48.9488 29.7921C48.9629 29.1284 48.6685 28.5062 48.1359 28.1052L46.2716 26.6534C45.5848 26.1141 44.6317 26.0588 43.8748 26.5013L43.7346 26.5843C42.5011 27.3032 41.0994 27.6489 39.6697 27.5521C35.8852 27.3171 32.9136 24.2199 32.9136 20.4867C32.9136 16.5737 36.1515 13.3936 40.1463 13.3936C40.3706 13.3936 40.6088 13.3936 40.8331 13.4212L43.4262 13.6701L39.7258 18.3435C39.0109 19.2423 39.1651 20.542 40.0762 21.261L41.8143 22.6298C42.2628 22.9755 42.8235 23.1414 43.3982 23.0723C43.9589 23.0031 44.4775 22.7266 44.8279 22.2841L50.8551 14.6518C51.4579 13.8913 51.4438 12.8128 50.8271 12.0662C48.22 8.88605 44.2392 7.00562 40.1323 7.00562Z"
              fill="#3586C7"
            />
            <path
              d="M97.5698 7.00562C90.0147 7.00562 83.8613 13.0479 83.8613 20.4728C83.8613 27.8978 90.0147 33.9401 97.5698 33.9401C99.9246 33.9401 102.237 33.3455 104.284 32.2117C104.326 32.1979 104.354 32.1703 104.396 32.1426L105.489 31.4374C106.036 31.0641 106.372 30.4419 106.386 29.7921C106.4 29.1284 106.106 28.5062 105.573 28.1052L103.709 26.6534C103.022 26.1141 102.069 26.0588 101.312 26.5013L101.172 26.5843C99.9386 27.3032 98.5369 27.6489 97.1072 27.5521C93.3227 27.3171 90.3511 24.2199 90.3511 20.4867C90.3511 16.5737 93.589 13.3936 97.5838 13.3936C97.8081 13.3936 98.0463 13.3936 98.2706 13.4212L100.864 13.6701L97.1633 18.3435C96.4484 19.2423 96.6026 20.542 97.5137 21.261L99.2518 22.6298C99.7003 22.9755 100.261 23.1414 100.836 23.0723C101.396 23.0031 101.915 22.7266 102.265 22.2841L108.293 14.6518C108.895 13.8913 108.881 12.8128 108.265 12.0662C105.657 8.88605 101.663 7.00562 97.5698 7.00562Z"
              fill="#3586C7"
            />
            <path
              d="M75.4418 8.19471L68.4334 20.7632C68.153 21.261 67.4242 21.261 67.1438 20.7632L60.1214 8.19471C59.7149 7.4619 58.958 7.00562 58.131 7.00562H55.8182C54.0521 7.00562 52.9448 8.98284 53.8279 10.5729L64.1723 29.1145L66.1907 32.751C67.0597 34.3134 68.4894 34.3134 69.3585 32.751L71.3769 29.1284L81.7213 10.5867C82.6184 8.99666 81.5111 7.00562 79.745 7.00562H77.4322C76.6052 7.00562 75.8483 7.4619 75.4418 8.19471Z"
              fill="#3586C7"
            />
            <path
              d="M152.63 27.4965C152.35 27.5242 152.056 27.5518 151.775 27.5518C147.794 27.5518 144.543 24.3578 144.543 20.4172V17.8731H149.392C150.57 17.8731 151.523 16.9329 151.523 15.7714V13.573C151.523 12.4116 150.57 11.4713 149.392 11.4713H144.543V9.13462C144.543 7.97318 143.589 7.03296 142.412 7.03296H140.183C139.006 7.03296 138.053 7.97318 138.053 9.13462V20.4034C138.053 27.856 144.206 33.9259 151.761 33.9259C152.196 33.9259 152.644 33.9121 153.079 33.8706C154.172 33.7738 154.999 32.8613 154.999 31.7828V29.5705C154.999 28.976 154.733 28.3952 154.284 27.9943C153.822 27.5933 153.219 27.4136 152.616 27.4827L152.63 27.4965Z"
              fill="#3586C7"
            />
            <path
              d="M19.8911 7.04694C13.5695 8.27752 9 13.9188 9 20.2929V31.8383C9 32.9997 9.95314 33.9399 11.1306 33.9399H13.3592C14.5366 33.9399 15.4898 32.9997 15.4898 31.8383V20.2929C15.4898 17.0575 17.326 14.6931 20.4377 13.6838C21.6151 13.3104 22.6103 13.3381 23.5354 13.3381C24.4605 13.3381 24.6147 12.7297 24.6147 11.9278V9.10712C24.6147 8.4711 24.6147 7.84889 24.04 7.36496C23.6335 7.04694 23.213 7.00546 22.9327 7.00546C22.5122 7.00546 20.2415 6.97781 19.9051 7.04694H19.8911Z"
              fill="#3586C7"
            />
          </svg>
          {/* <HeaderTitle
            variant="h6"
            sx={{
              ...menuCollapsedStyles,
              ...(navCollapsed && !navHover ? {} : { ml: 2.5 }),
            }}
          >
            {themeConfig.templateName}
          </HeaderTitle> */}
        </LinkStyled>
      )}

      {hidden ? (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={toggleNavVisibility}
          sx={{
            p: 0,
            backgroundColor: "transparent !important",
            color: `${
              mode === "semi-dark"
                ? `rbga(${theme.palette.customColors.dark}, 0.6)`
                : theme.palette.text.secondary
            } !important`,
          }}
        >
          <Icon icon="tabler:x" fontSize="1.25rem" />
        </IconButton>
      ) : userMenuLockedIcon === null &&
        userMenuUnlockedIcon === null ? null : (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={() =>
            saveSettings({ ...settings, navCollapsed: !navCollapsed })
          }
          sx={{
            p: 0,
            backgroundColor: "transparent !important",
            "& svg": {
              fontSize: "1.25rem",
              ...menuCollapsedStyles,
              transition: "opacity .25s ease-in-out",
            },
          }}
        >
          {navCollapsed ? MenuUnlockedIcon() : MenuLockedIcon()}
        </IconButton>
      )}
    </MenuHeaderWrapper>
  );
};

export default VerticalNavHeader;
