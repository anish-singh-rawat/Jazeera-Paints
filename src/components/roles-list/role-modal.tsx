import { Checkbox, Divider, TextField, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getName } from "src/@core/utils/general";
import { AppDispatch, RootState } from "src/store";
import {
  addAssignedUser,
  clearAssignedUsers,
  deleteAssignedUser,
  removeAssignedUser,
} from "src/store/apps/add-user";
import { fetchusers } from "src/store/apps/roles";
import { toggleId } from "src/store/apps/roles_ids/roles_ids";
import { getUserassigned } from "src/store/apps/user_assign/user-assign-list";
import CloseButton from "../../../public/images/icons/project-icons/CloseButton.png";
import crossIcon from "../../../public/images/icons/project-icons/cross_icon.png";
import RoleAvatar from "./role-avatar";

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

interface AssignRoleProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleOpen: () => void;
  handleClose: () => void;
  checkedUsers: any[]; // Adjust the type based on your actual data structure
  setCheckedUsers: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function AssignRole({
  open,
  setOpen,
  handleOpen,
  handleClose,
  checkedUsers,
  setCheckedUsers,
}: any) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchusers());
  }, []);

  const getUserDetails = useSelector(
    (state: any) => state?.UserUnAssigned?.data
  );
  const getUerAssign = useSelector((state: any) => state?.UserAssigned?.data);

  const [checkedState, setCheckedState] = useState({});
  const [getUsers, setUsers] = useState(
    Array.isArray(getUserDetails) ? getUserDetails : []
  );
  const [searchData, setSearchData] = useState();
  const [data, setData] = useState(
    Array.isArray(getUerAssign) ? [...getUerAssign] : []
  );

  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();

  useEffect(() => {
    setUsers(getUserDetails);
    setSearchData(getUserDetails);
  }, [getUserDetails]);

  const getUerAssignUsers = useSelector(
    (state: RootState) => state?.assignedUsersReducer?.data
  );

  const handleChange = (e) => {
    if (e.target.value.length > 1) {
      const handleUsers = searchData.filter(
        (item: any) =>
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

  useEffect(() => {
    setData(getUerAssign);
  }, [getUerAssign]);

  const handleChecked = (
    event: React.ChangeEvent<HTMLInputElement>,
    assignIds: any,
    item: any
  ) => {
    const isChecked = event.target.checked;

    dispatch(isChecked ? addAssignedUser(item) : removeAssignedUser(item));
    dispatch(toggleId(assignIds));

    setCheckedState((prevState) => ({
      ...prevState,
      [item.id]: isChecked,
    }));
  };

  const handleDelete = (items: any) => {
    dispatch(deleteAssignedUser(items.id));
    // setData(deleteItem);
    setCheckedState((prevState: any) => {
      const newState = { ...prevState };
      delete newState[items.id];
      return newState;
    }); // Dispatch the action to delete by ID
  };

  const handleClick = () => {
    dispatch(clearAssignedUsers());
    setCheckedState({});
  };

  useEffect(() => {
    dispatch(getUserassigned(id));
  }, []);
  const theme = useTheme();
  const assigneduser = {
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
    background: "#F0F0F0",
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
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
            <Image alt={""} src={CloseButton} height={40} width={40} />
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
              {t("ASSIGN_ROLE_TO_USERS")}
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
                  height: "81%",
                  overflowY: "scroll",
                  paddingRight: "1px",
                  boxSizing: "content-box",
                  overscrollBehavior: "smooth",
                }}
              >
                <TextField
                  size="small"
                  sx={{ width: "96%" }}
                  onChange={handleChange}
                  placeholder={t("SEARCH_BY_NAME_EMAIL") as string}
                />

                {Array.isArray(getUsers) &&
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
                            checked={checkedState[item.id] || false}
                          />
                          <RoleAvatar item={item} />
                          <div>
                            <Typography
                              sx={{
                                fontWeight: "600",
                                fontSize: "15px",
                                textTransform: "capitalize",
                              }}
                            >
                              {getName(item?.firstName, item?.lastName)}
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
                  })}

                {getUsers?.length == 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      height: "280px",
                      width: "96%",
                      fontWeight: "600",
                      alignItems: "center",
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
                {getUerAssignUsers && !getUerAssignUsers?.length ? (
                  <Typography
                    color={"secondary"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {t("NO_ASSIGN_TEXT")}
                  </Typography>
                ) : (
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
                        {getUerAssignUsers?.length} Assigned Users
                      </Typography>
                      <Button
                        role="button"
                        onClick={handleClick}
                        color={
                          !getUerAssignUsers?.length ? "secondary" : "error"
                        }
                      >
                        {t("CLEAR_ALL")}
                      </Button>
                    </div>

                    {Array.isArray(getUerAssignUsers) &&
                      getUerAssignUsers?.map((item, index) => {
                        return (
                          <>
                            <Box
                              sx={
                                theme.palette.mode == "dark"
                                  ? {
                                      ...assigneduser,
                                      ...(index === item.length - 1 && {
                                        paddingBottom: "300px",
                                      }),
                                      background: "rgb(48,52,70)",
                                    }
                                  : {
                                      ...assigneduser,
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
                                <RoleAvatar item={item} />

                                <div>
                                  <Typography
                                    sx={{
                                      fontWeight: "600",
                                      fontSize: "15px",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {getName(item?.firstName, item?.lastName)}
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
                                    {item?.email}
                                  </Typography>
                                </div>
                              </div>

                              <Image
                                style={{ cursor: "pointer" }}
                                src={crossIcon}
                                onClick={() => handleDelete(item)}
                                height={24}
                                width={24}
                                alt="role-img"
                              />
                            </Box>
                          </>
                        );
                      })}
                  </div>
                )}
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
                sx={{ marginRight: "20px", textTransform: "none" }}
                variant="contained"
                onClick={handleClose}
              >
                {t("SAVE")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
