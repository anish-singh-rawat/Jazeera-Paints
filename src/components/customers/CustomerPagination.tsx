import { makeStyles } from "@mui/styles";
import React, { useState } from "react";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import { useSettings } from "src/@core/hooks/useSettings";

const useStyles = makeStyles({
  pagination: {
    display: "flex",
    gap: "12px",
    right:"24px",
    flexDirection: ({ direction }: { direction: string }) => direction === "rtl" ? "row-reverse" : "row",
    "& .iconify":{
      transform:({direction}) => (direction === "rtl" ? "rotate(180deg)" : "rotate(0deg)" )
    }
  },
  arrowBtn: {
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    outline: "none",
    // border: "none",
    border: "1px solid rgba(51, 48, 60, 0.22)",
    cursor: "pointer",
    color: "rgba(51, 48, 60, 0.87)",
    background: "white",
    "&:disabled": {
      cursor: "no-drop",
      background: "#ececec",
    },
  },
  input: {
    height: "30px",
    borderRadius: "6px",
    outline: "none",
    border: "1px solid rgba(51, 48, 60, 0.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    background: "white",
    cursor: "pointer",
    "&:disabled": {
      cursor: "no-drop",
      background: "#ececec",
      color: "#000000",
    },
  },
  text: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "30px",
    fontSize: "15px",
    lineHeight: "22px",
    color: "rgba(51, 48, 60, 0.87)",
  },
  countBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    outline: "none",
    border: "1px solid #D9D9D9",
    cursor: "pointer",
    padding: "0 10px",
  },
});

const CustomerPagination = (props: any) => {

  const settings: any = window.localStorage.getItem("settings");

  const mode = JSON.parse(settings)?.mode;
  let contentDirection =  useSettings();
  const { count, setPageState, pageState } = props;
  const [currentPage, setCurrentPage] = useState<number>(1);
  let direction = contentDirection?.settings?.direction;
  const classes = useStyles({direction});

  const lastPage = () => {
    setPageState((old: any) => ({
      ...old,
      page: count,
      isLoading: true,
    }));
    setCurrentPage(1);
  };

  const firstPage = () => {
    setPageState((old: any) => ({
      ...old,
      page: 1,
      isLoading: true,
    }));
    setCurrentPage(1);
  };

  const nextPage = () => {
    if (pageState.page < count) {
      setPageState((old: any) => ({
        ...old,
        page: old.page + 1,
        isLoading: true,
      }));
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (!(pageState.page === 1)) {
      setPageState((old: any) => ({
        ...old,
        page: old.page - 1,
        isLoading: true,
      }));
      setCurrentPage(currentPage - 1);
    }
  };

  const pageNumberChange = (value: any) => {
    if (value === "0" || value <= "0") {
      setPageState({ ...pageState, page: "" });
    } else if (value > count) {
      setPageState({ ...pageState, page: value - 0 });
      setCurrentPage(value);
    } else {
      setPageState({
        ...pageState,
        page: value - 0,
        isLoading: true,
      });
      setCurrentPage(value);
    }
  };

    return (
      <div className={classes.pagination}>
        <button
          onClick={firstPage}
          className={classes.arrowBtn}
          style={
            pageState?.page === 1 || pageState?.page === ""
              ? {
                  background: "rgba(239, 239, 239, 0.3)",
                  color: "rgba(51, 48, 60, 0.87)",
                }
              : { background: "#fff", color: "rgba(51, 48, 60, 0.87)" }
          }
          disabled={pageState?.page === 1 || pageState?.page === ""}
        >
          {" "}
          <Icon icon="tabler:chevrons-left" />
        </button>
        <button
          onClick={previousPage}
          disabled={pageState?.page === 1 || pageState?.page === ""}
          className={classes.arrowBtn}
        >
          <Icon icon="tabler:chevron-left" />
        </button>

        <input
          className={classes.input}
          type="number"
          value={pageState?.page}
          onChange={(e) => pageNumberChange(e?.target?.value)}
          style={{width: (pageState?.page) > 99 ? "65px" : "30px"}}
        />
        {/* {pageState.page === count ||
          (!(pageState.page < count) && (
            <button
              disabled={pageState.page === count || !(pageState.page < count)}
              onClick={nextPage}
              className={classes.input}
              style={{ cursor: "pointer" }}
            >
              {pageState.page + 1}
            </button>
          ))}
        {pageState.page === count ||
          (!(pageState.page < count) && (
            <button
              disabled={pageState.page === count || !(pageState.page < count)}
              onClick={nextPage}
              className={classes.input}
            >
              {pageState.page + 2}
            </button>
          ))} */}
        <span
          className={classes.text}
          style={
            mode === "dark"
              ? { color: "rgba(228, 230, 244, 0.87)" }
              : { color: "rgba(51, 48, 60, 0.87)" }
          }
        >
          of
        </span>
        <button
          disabled={pageState?.page === count}
          className={classes.countBtn}
          onClick={lastPage}
        >
          {count}
        </button>
        <button
          disabled={pageState?.page === count || !(pageState?.page < count)}
          onClick={nextPage}
          className={classes.arrowBtn}
        >
          <Icon icon="tabler:chevron-right" />
        </button>
        <button
          disabled={pageState?.page === count}
          onClick={lastPage}
          style={
            pageState?.page === count
              ? {
                  background: "rgba(239, 239, 239, 0.3)",
                  color: "rgba(51, 48, 60, 0.87)",
                }
              : { color: "rgba(51, 48, 60, 0.87)" }
          }
          className={classes.arrowBtn}
        >
          <Icon icon="tabler:chevrons-right" />
        </button>
      </div>
    );

};

export default CustomerPagination;
