import { Box, Stack } from "@mui/material";
import React from "react";

// ** Icon Imports
import Icon from "src/@core/components/icon";

const Pagination = (props: any) => {
  const {
    classes,
    page,
    firstPage,
    previousPage,
    newPage,
    totalPages,
    pageNumberChange,
    mode,
    lastPage,
    nextPage,
  } = props;
  return (
    <Stack
      sx={{
        position: "absolute",
        bottom: "18px",
        right: "24px",
        direction: "ltr !important",
      }}
    >
      <Box className={classes.buttons}>
        <button
          disabled={page === 0}
          onClick={firstPage}
          className={classes.arrowBtn}
        >
          <Icon icon="tabler:chevrons-left" />
        </button>
        <button
          disabled={page === 0}
          onClick={previousPage}
          className={classes.arrowBtn}
        >
          <Icon icon="tabler:chevron-left" />
        </button>
        <input
          disabled={newPage === totalPages}
          className={classes.input}
          type="text"
          value={newPage || ""}
          onChange={(e) => pageNumberChange(e.target.value)}
          pattern="[0-9]+"
        />
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
        <button className={classes.arrowBtn} onClick={lastPage}>
          {totalPages}
        </button>
        <button
          disabled={page + 1 === totalPages}
          onClick={nextPage}
          className={classes.arrowBtn}
        >
          <Icon icon="tabler:chevron-right" />
        </button>
        <button
          disabled={page + 1 === totalPages}
          onClick={lastPage}
          className={classes.arrowBtn}
        >
          <Icon icon="tabler:chevrons-right" />
        </button>
      </Box>
    </Stack>
  );
};

export default Pagination;
