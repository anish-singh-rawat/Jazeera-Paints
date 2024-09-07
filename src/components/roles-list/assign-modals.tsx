import { Checkbox, Divider, TextField, useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "src/store";
import { fetchusers } from "src/store/apps/roles";
import {
  clearUsers,
  deleteUnassigned,
  updateUserAssign,
} from "src/store/apps/roles_ids/assign_users";
import { toggleId, toggleIdClear } from "src/store/apps/roles_ids/roles_ids";
import crossIcon from "../../../public/images/icons/project-icons/cross_icon.png";
import CloseButton from "../../../public/images/icons/project-icons/CloseButton.png";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  height: "80%",
  boxShadow: 24,
  width: "70%",
  overflow: "hidden",
};

interface AssignModalProps {
  open: boolean;
  handleClose: () => void;
  checkedUsers: any[];
  setCheckedUsers: (users: any[]) => void;
}

export default function AssignModal({
  open,
  handleClose,
  checkedUsers,
  setCheckedUsers,
}: AssignModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchusers());
  }, []);

  const getUerDetails = useSelector((state: any) => state?.roles?.data?.role);

  // Check if getUerDetails is undefined before using it
  const [getUsers, setUsers] = useState(getUerDetails);
  const [searchData, setSearchData] = useState(
    getUerDetails ? [...getUerDetails] : []
  );
  const { t } = useTranslation();

  useEffect(() => {
    setUsers(getUerDetails);
    setSearchData(getUerDetails);
  }, [getUerDetails]);

  const handleChange = (e: any) => {
    if (e.target.value.length > 1) {
      const handleUsers = searchData.filter(
        (item) =>
          item?.firstName
            ?.toLocaleLowerCase()
            .includes(e.target.value.toLocaleLowerCase()) ||
          item?.email
            ?.toLocaleLowerCase()
            .includes(e.target.value.toLocaleLowerCase()) ||
          item?.mobileNumber.includes(e.target.value.toLocaleLowerCase())
      );
      setUsers(handleUsers);
    } else {
      setUsers(searchData);
    }
  };

  const ids = useSelector((state: any) => state);

  const assignusers = useSelector((state: any) => state.assign_users);

  const handleChecked = (event: any, assignIds: any, item: any) => {
    const isChecked = event.target.checked;

    setUsers((prevUsers) =>
      prevUsers.map((d) =>
        d.id === item.id ? { ...d, checked: isChecked } : d
      )
    );

    if (isChecked) {
      setCheckedUsers((prevCheckedUsers): any => [
        ...prevCheckedUsers,
        item.id,
      ]);
    } else {
      setCheckedUsers((prevCheckedUsers) =>
        prevCheckedUsers.filter((userId) => userId !== item.id)
      );
    }

    dispatch(toggleId(assignIds));
    dispatch(updateUserAssign(item));
  };

  const handleDelete = (id: any) => {
    dispatch(deleteUnassigned(id));
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, checked: false } : user
      )
    );

    // Remove the user from the checked users array
    setCheckedUsers((prevCheckedUsers) =>
      prevCheckedUsers.filter((userId) => userId !== id)
    );
  };

  const handleClear = () => {
    dispatch(toggleIdClear());
    dispatch(clearUsers());
    setCheckedUsers([]);
  };

  const isLoading = useSelector((state) => state.roles.loading);

  const theme = useTheme();
  const assignedmodal = {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    marginTop: "10px",
    background: "#F5F5F5",
    justifyContent: "space-between",
    padding: "15px",
    borderRadius: "4px",
    scrollBehavior: "smooth",
  };

  const savebutton = {
    position: "sticky",
    bottom: "0",
    height: "80px",
    width: "100%",
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    zIndex: "99999999999",
  };
  return (
    <div className="hide-scrollbar">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Button
            sx={{
              position: "absolute",
              top: "7%",
              right: "12.5%",
              zIndex: 1,
            }}
            onClick={handleClose}
          >
            <Image src={CloseButton} height={40} width={40} alt="img" />
          </Button>
          <Box sx={style}>
            <Typography
              sx={{
                textAlign: "center",
                padding: "20px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              {t("ASSIGN_ROLE_TITLE")}
              <Typography fontSize={"0.7em"} color={"secondary"}>
                {t("ROLE_INITMATION_TEXT")}
              </Typography>
            </Typography>
            <Divider orientation="horizontal" flexItem></Divider>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%",
                paddingBottom: "30px",
                overflow: "hidden",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  width: "50%",
                  padding: "20px",
                  height: "75%",

                  overflowY: "scroll",
                  paddingRight: "1px",
                  boxSizing: "content-box",
                  overscrollBehavior: "smooth",
                }}
              >
                {/* <TextField
                  size="small"
                  sx={{ width: "90%" }}
                  onChange={handleChange}
                  placeholder={t("SEARCH_BY_NAME_EMAIL")}
                /> */}

                {isLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  Array.isArray(getUsers) &&
                  getUsers?.map((item, index) => {
                    const isLastItem = index === getUsers.length - 1;

                    return (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "20px",
                            alignItems: "center",
                            marginTop: "20px",
                            scrollBehavior: "smooth",
                            ...(isLastItem && {
                              paddingBottom: "40px",
                            }),
                          }}
                        >
                          <Checkbox
                            onChange={(event) =>
                              handleChecked(event, item.id, item)
                            }
                            checked={checkedUsers.includes(item.id)}
                          />
                          <Avatar
                            alt="Remy Sharp"
                            src={item.image}
                            sx={{ bgcolor: "#DEEBFG" }}
                          >
                            {item?.firstName?.charAt(0)}{" "}
                          </Avatar>
                          <div>
                            <Typography
                              sx={{ fontWeight: "600", fontSize: "15px" }}
                            >
                              {item.firstName}
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: "400",
                                fontSize: "13px",
                                color: "#b6b0c9",
                              }}
                            >
                              {item.mobileNumber}
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: "400",
                                fontSize: "13px",
                                color: "#b6b0c9",
                              }}
                            >
                              {item.email}
                            </Typography>
                          </div>
                        </Box>
                      </>
                    );
                  })
                )}

                {getUsers.length == 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      fontSize: "15px",
                      fontWeight: "600",
                    }}
                  >
                    {t("NO_USERS_FOUND")}
                  </Box>
                )}
              </Box>
              <Divider orientation="vertical" flexItem></Divider>
              <Box
                sx={{
                  width: "50%",
                  height: "81%",
                  overflowY: "scroll",
                  paddingRight: "1px",
                  boxSizing: "content-box",
                  overscrollBehavior: "smooth",
                }}
              >
                <div
                  style={{
                    margin: "20px",
                    paddingBottom: "30px",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <Typography sx={{ fontSize: "13px", fontWeight: "700" }}>
                      {assignusers.length} Assigned Users
                    </Typography>
                    <Button
                      onClick={handleClear}
                      color={"error"}
                      disabled={!assignusers.length}
                    >
                      {t("CLEAR_ALL")}
                    </Button>
                  </div>

                  {assignusers?.map((item: any, index: any) => {
                    return (
                      <>
                        <Box
                          sx={
                            theme.palette.mode == "dark"
                              ? {
                                  ...assignedmodal,
                                  ...(index === item.length - 1 && {
                                    paddingBottom: "300px",
                                  }),
                                  background: "rgb(48,52,70)",
                                }
                              : {
                                  ...assignedmodal,
                                  ...(index === item.length - 1 && {
                                    paddingBottom: "300px",
                                  }),
                                  background: "rgb(243,243,243)",
                                }
                          }
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "20px",
                              overscrollBehavior: "smooth",
                            }}
                          >
                            <Avatar
                              alt="Remy Sharp"
                              src={item?.image}
                              sx={{ bgcolor: "#DEEBFG" }}
                            >
                              {item.firstName?.charAt(0)}
                            </Avatar>
                            <div>
                              <Typography
                                sx={{ fontWeight: "600", fontSize: "15px" }}
                              >
                                {item.firstName}
                              </Typography>
                              <Typography
                                sx={{
                                  fontWeight: "400",
                                  fontSize: "13px",
                                  color: "#b6b0c9",
                                }}
                              >
                                {item?.mobileNumber}
                              </Typography>
                              <Typography
                                sx={{
                                  fontWeight: "400",
                                  fontSize: "13px",
                                  color: "#b6b0c9",
                                }}
                              >
                                {item.email}
                              </Typography>
                            </div>
                          </div>

                          <div style={{ cursor: "pointer" }}>
                            <Image
                              onClick={() => handleDelete(item.id)}
                              src={crossIcon}
                              height={14}
                              width={14}
                              alt="role-img"
                            />
                          </div>
                        </Box>
                      </>
                    );
                  })}
                </div>
              </Box>
            </div>
            <Box
              sx={
                theme.palette.mode == "dark"
                  ? { ...savebutton, background: "rgb(48,52,70)" }
                  : { ...savebutton, background: "rgb(243,243,243)" }
              }
            >
              <Button
                sx={{ marginRight: "20px" }}
                variant="contained"
                onClick={handleClose}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
