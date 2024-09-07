import * as React from "react";
import usePagination from "@mui/material/usePagination";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  listItem: {},
  button: {
    background: "rgba(75, 70, 92, 0.08)",
    border: "none",
    outline: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    height: "34px",
    color: "#4B465C",
  },
  buttonSelected: {
    background: "#3586C7",
    border: "none",
    outline: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    height: "34px",
    color: "#FFF",
  },
});
const List = styled("ul")({
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  gap: "8px",
});

export default function UsePagination(props: any) {
  const { count, handlePageChange } = props;
  const classes = useStyles();

  const { items } = usePagination({
    count: count,
  });

  return (
    <nav>
      <List>
        {items.map(({ page, type, selected, ...item }, index) => {
          let children: any = null;

          if (type === "start-ellipsis" || type === "end-ellipsis") {
            children = "…";
          } else if (type === "page") {
            children = (
              <button
                type="button"
                className={selected ? classes.buttonSelected : classes.button}
                style={{
                  fontWeight: selected ? "bold" : undefined,
                }}
                {...item}
              >
                {page}
              </button>
            );
          } else {
            children = (
              <button
                className={classes.button}
                style={{ textTransform: "capitalize" }}
                type="button"
                {...item}
              >
                {type}
              </button>
            );
          }

          return (
            <li
              className={classes.listItem}
              key={index}
              onClick={() => {
                handlePageChange(index);
              }}
            >
              {children}
            </li>
          );
        })}
      </List>
    </nav>
  );
}
