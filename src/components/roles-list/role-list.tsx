import { Box, Button, Card, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Role } from "src/store/apps/roles";
import { v4 as uuidv4 } from "uuid";
import RoleAvatar from "./role-avatar";
import { getTotalUser } from "src/@core/utils/general";
interface UserType {
  id: number;
  name: string;
  altName: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  userName: string;
  image: string;
}

interface itemObject {
  id: number;
  name: string;
  active: boolean;
  userType: UserType[];
  totalUsers: number;
  users: User[];
}
const RoleList = ({
  searchData,
  isCreatePermissionEnabled,
  isEditPermissionEnabled,
}: {
  searchData: Role[];
  isCreatePermissionEnabled: Boolean;
  isEditPermissionEnabled: Boolean;
}) => {
  const { t } = useTranslation();
  const avatars = (item: itemObject | undefined) => {
    return (
      <AvatarGroup
        renderSurplus={(surplus) => (
          <span style={{ fontSize: "12px", fontWeight:800 }}>
            +{surplus}
          </span>
        )}
        max={4}
        sx={{
          marginLeft:'15px',
          justifyContent: "unset",
          marginRight: "5px",
          "& .MuiAvatar-root": {
            width: "32px",
            height: "32px",
          },
        }}
      >
        {Array.isArray(item?.users) &&
          item?.users.map((item, index) => {
            return <RoleAvatar item={item} key={index} />;
          })}
      </AvatarGroup>
    );
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
          // width: "100%",
          // minWidth: "285px",
          justifyContent: "start",
        }}
      >
        <Card
          sx={{
            width: "31%",
            height: "110px",
            minWidth: "285px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
            "@media (max-width:950px)": { width: "47%" },
            "@media (max-width:750px)": { width: "96.5%" },
          }}
        >
          <Button
            disabled={!isCreatePermissionEnabled}
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            <Link
              href={`roles/create-role`}
              style={{ textDecoration: "none", color: "white" }}
            >
              {t("ADD_NEW_ROLE")}
            </Link>
          </Button>

          <Typography>{t("ADD_ROLE_TXT")}</Typography>
        </Card>

        {Array.isArray(searchData) &&
          searchData?.map((item) => {
            return (
              <>
                <Card
                  key={uuidv4()}
                  sx={{
                    width: "31%",
                    minWidth: "285px",
                    height: "110px",
                    padding: "10px",
                    "@media (max-width:950px)": { width: "47%" },
                    "@media (max-width:750px)": { width: "96.5%" },
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: "400",
                        marginLeft: "12px",
                        width: "40%",
                        visibility: item?.totalUsers ? "visible" : "hidden",
                        "@media (max-width:750px)": { width: "80%" },
                      }}
                    >
                      {getTotalUser(item.totalUsers, t)}
                    </Typography>
                    {avatars(item as any)}
                  </Box>

                  <Box sx={{ marginLeft: "12px", marginBottom: "15px" }}>
                    <Typography
                      sx={{
                        fontWeight: "600",
                        fontSize: "18px",
                        textTransform: "capitalize",
                      }}
                    >
                      {item?.name}
                    </Typography>
                    <Link href={`roles/create-role/?id=${item.id}&isEdit=true`}>
                      <Button variant="text" sx={{ padding: 0, margin: 0 }}>
                        {t("VIEW_PERMISSIONS")}
                      </Button>
                    </Link>
                  </Box>
                </Card>
              </>
            );
          })}
      </Box>
    </>
  );
};

export default RoleList;
