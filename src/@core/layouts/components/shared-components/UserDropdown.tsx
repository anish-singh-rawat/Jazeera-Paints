// ** React Imports
import { useState, SyntheticEvent, Fragment } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** MUI Imports
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import { setUserName, setPassword } from "src/store/apps/form/formdataSlice";
import { useDispatch } from "react-redux";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Context
import { useAuth } from "src/hooks/useAuth";

// ** Type Imports
import { Settings } from "src/@core/context/settingsContext";
import { useTranslation } from "react-i18next";

interface Props {
  settings: Settings;
}

// ** Styled Components
const BadgeContentSpan = styled("span")(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

const MenuItemStyled = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  "&:hover .MuiBox-root, &:hover .MuiBox-root svg": {
    color: theme.palette.primary.main,
  },
}));

const UserDropdown = (props: Props) => {
  const { user } = useAuth();
  // ** Props
  const { settings } = props;

  // ** States
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  // ** Hooks
  const router = useRouter();
  const { logout } = useAuth();
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  // ** Vars
  const { direction } = settings;

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url);
    }
    setAnchorEl(null);
  };

  const styles = {
    px: 4,
    py: 1.75,
    width: "100%",
    display: "flex",
    alignItems: "center",
    color: "text.primary",
    textDecoration: "none",
    "& svg": {
      mr: 2.5,
      color: "text.primary",
    },
  };

  const handleLogout = () => {
    logout();
    handleDropdownClose();
    dispatch(setUserName(""));
    dispatch(setPassword(""));
  };

  const changeLanguage: any = localStorage.getItem("i18nextLng");

  const handleShowKeys = () => {
    handleDropdownClose();
    i18n.changeLanguage(changeLanguage === "en-US" ? "key-KEY" : "en-US");
  };

  return (
    <Fragment>
      <Badge
        overlap="circular"
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: "pointer" }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Avatar
          alt="John Doe"
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src="/images/avatars/1.png"
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ "& .MuiMenu-paper": { width: 230, mt: 4.5 } }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: direction === "ltr" ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: direction === "ltr" ? "right" : "left",
        }}
      >
        <Box sx={{ py: 1.75, px: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Badge
              overlap="circular"
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <Avatar
                alt="John Doe"
                src="/images/avatars/1.png"
                sx={{ width: "2.5rem", height: "2.5rem" }}
              />
            </Badge>
            <Box
              sx={{
                display: "flex",
                ml: 2.5,
                alignItems: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{ fontWeight: 500, textTransform: "capitalize" }}
              >{`${user?.firstName} ${user?.lastName}`}</Typography>
              <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                {user?.role?.name}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: (theme) => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon="tabler:user-check" />
            My Profile
          </Box>
        </MenuItemStyled>
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon="tabler:mail" />
            Inbox
          </Box>
        </MenuItemStyled>
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon="tabler:message-2" />
            Chat
          </Box>
        </MenuItemStyled>
        <Divider sx={{ my: (theme) => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon="tabler:settings" />
            Settings
          </Box>
        </MenuItemStyled>
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon="tabler:currency-dollar" />
            Pricing
          </Box>
        </MenuItemStyled>
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <Icon icon="tabler:help" />
            FAQ
          </Box>
        </MenuItemStyled>
        <Divider sx={{ my: (theme) => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled
          onClick={handleShowKeys}
          sx={{ py: 2, "& svg": { mr: 2, fontSize: "1.375rem" } }}
        >
          <Icon
            icon={
              changeLanguage === "en-US"
                ? "tabler:key"
                : "basil:eye-closed-solid"
            }
          />
          {changeLanguage === "en-US"
            ? "Show Translation Keys"
            : "Hide Translation Keys"}
        </MenuItemStyled>
        <MenuItemStyled
          onClick={handleLogout}
          sx={{ py: 2, "& svg": { mr: 2, fontSize: "1.375rem" } }}
        >
          <Icon icon="tabler:logout" />
          Logout
        </MenuItemStyled>
      </Menu>
    </Fragment>
  );
};

export default UserDropdown;
