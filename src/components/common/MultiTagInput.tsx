import { Autocomplete, Chip, TextField } from "@mui/material";
import React, { useState, useRef } from "react";
import { makeStyles } from "@mui/styles";
import checkItemAvailability from "src/utils/checkItemAvailable";
import { Key } from "src/@core/layouts/utils";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  customMultiTag: {
    "& .MuiChip-outlined": {
      background: "#DBEDFB",
      borderRadius: "5px",
      border: "none",
      position: "relative",
    },
  },
  tag: {
    cursor: "pointer",
    color: "#fff",
    background: "#3586C7",
    padding: "4px 8px",
    borderRadius: "6px",
  },
  tagBox: {
    marginTop: "12px",
    position: "absolute",
  },
});

// =========== utils =====

const MultiTagInput = (props: any) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { tagOptions, setTagOptions } = props;
  const [tag, setTag] = useState<string>("");

  return (
    <div className={classes.customMultiTag}>
      <Autocomplete
        multiple
        id="tags-filled"
        options={[]}
        value={tagOptions}
        inputValue={tag}
        freeSolo
        onInputChange={(e: any, value: any, reason: any) => {
          if (reason === 'clear') {
            setTag("");
          }
        }}
        onChange={(event: any, value: any) => {
          if (value.length > 0) {
            if (value[value.length - 1].trim() !== "") {
              setTagOptions(value);
              setTag("");
            }
          } else {
            setTagOptions(value);
            setTag("");
          }
        }}
        renderTags={(value, getTagProps) => {
          return value.map((option: any, index) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
            />
          ));
        }}
        renderInput={(params) => {
          if (params?.inputProps?.value === "") {
            setTag("");
          }
          return (
            <TextField
              {...params}
              variant="outlined"
              id="tag"
              placeholder={t("TAGS")!}
              onChange={(event: any) => {
                setTag(event.target.value.trimStart());
              }}
            />
          );
        }}
      />
      {tag && (
        <div className={classes.tagBox}>
          <span
            onClick={() => {
              if (!checkItemAvailability(tag, tagOptions)) {
                if (tag.trim() !== "") {
                  setTagOptions([...tagOptions, tag.trim()]);
                  setTag("");
                }
              }
            }}
            className={classes.tag}
          >
            +{t("ADD")}
          </span>
          <strong> "{tag}" </strong>
          <span>{t(Key("as a New Tag"))}</span>
        </div>
      )}
    </div>
  );
};

export default MultiTagInput;
