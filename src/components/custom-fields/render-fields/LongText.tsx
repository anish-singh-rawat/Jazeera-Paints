import { Box, Checkbox, FormControlLabel } from "@mui/material";
import React from "react";
import CommonInput from "src/components/common/CommonInput";
// import { EditorState, ContentState, convertFromHTML } from "draft-js";
import { t } from "i18next";

// ** Styled Component Imports
// import { EditorWrapper } from "src/@core/styles/libs/react-draft-wysiwyg";

// ** Styles
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { makeStyles } from "@mui/styles";
import { Controller } from "react-hook-form";
// import ReactDraftWysiwyg from "src/@core/components/react-draft-wysiwyg";
import CommonTextArea from "src/components/common/CommonTextArea";

const useStyles = makeStyles({
  container: {
    display: "flex",
    gap: "20px",
    padding: "0 30px",
    marginBottom: "12px",
  },
  radioContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0px",

    "& .MuiFormControlLabel-root": {
      height: "30px",
    },
  },
  radioError: {
    color: "#EA5455",
    fontSize: "12px",
    marginTop: "-2px",
  },
});

const longText = (props: any) => {
  const {
    control,
    errors,
    item,
    setValue,
    editorState,
    setEditorState,
    ...other
  } = props;
  const classes = useStyles();
  let contentStateJSON = "";

  // const onEditorStateChange = (newEditorState: EditorState) => {
  //   setEditorState(newEditorState);
  //   contentStateJSON = editorState.getCurrentContent().getPlainText();
  // };

  return (
    <>
      <Box
        style={{
          display: "flex",
          gap: "20px",
          padding: "0 30px",
          marginBottom: "18px",
        }}
      >
        <CommonInput
          name="minLenth"
          id="minLenth"
          label="Min Length"
          required={true}
          control={control}
          errors={errors}
          type={"number"}
          defaultValue={item?.minLenth}
        />
        <CommonInput
          name="maxLength"
          id="maxLength"
          label="Max Length"
          required={true}
          control={control}
          type={"number"}
          errors={errors}
          defaultValue={item?.maxLength}
        />
      </Box>
      <Box
        style={{
          padding: "0 30px",
          marginBottom: "12px",
        }}
      >
        <CommonTextArea
          name="defaultValue"
          id="defaultValue"
          label={"Default Value"}
          type={"string"}
          control={control}
          errors={errors}
          placeholder="Default Value"
          defaultValue={item.defaultValue}
          rows={6}
        />
        {/* not required as of now */}
        {/* <EditorWrapper>
          <ReactDraftWysiwyg
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={onEditorStateChange}
            placeholder="Write your message..."
            toolbar={{
              options: [
                "inline",
                "blockType",
                "fontSize",
                "fontFamily",
                "list",
                "textAlign",
                "colorPicker",
                "link",
                "embedded",
                "emoji",
                "image",
                "remove",
                "history",
              ],
              inline: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
                options: [
                  "bold",
                  "italic",
                  "underline",
                  "strikethrough",
                  "monospace",
                  "superscript",
                  "subscript",
                ],
              },
              blockType: {
                inDropdown: true,
                options: [
                  "Normal",
                  "H1",
                  "H2",
                  "H3",
                  "H4",
                  "H5",
                  "H6",
                  "Blockquote",
                  "Code",
                ],
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
              },
              fontSize: {
                icon: 12,
                options: [
                  8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96,
                ],
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
              },
              fontFamily: {
                options: [
                  "Arial",
                  "Georgia",
                  "Impact",
                  "Tahoma",
                  "Times New Roman",
                  "Verdana",
                ],
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
              },
              list: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
                options: ["unordered", "ordered", "indent", "outdent"],
                // unordered: { icon: unordered, className: undefined },
                // ordered: { icon: ordered, className: undefined },
                // indent: { icon: indent, className: undefined },
                // outdent: { icon: outdent, className: undefined },
              },
              textAlign: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
                options: ["left", "center", "right", "justify"],
                // left: { icon: left, className: undefined },
                // center: { icon: center, className: undefined },
                // right: { icon: right, className: undefined },
                // justify: { icon: justify, className: undefined },
              },
              colorPicker: {
                icon: "rgb(97,189,109)",
                className: undefined,
                component: undefined,
                popupClassName: undefined,
                colors: [
                  "rgb(97,189,109)",
                  "rgb(26,188,156)",
                  "rgb(84,172,210)",
                  "rgb(44,130,201)",
                  "rgb(147,101,184)",
                  "rgb(71,85,119)",
                  "rgb(204,204,204)",
                  "rgb(65,168,95)",
                  "rgb(0,168,133)",
                  "rgb(61,142,185)",
                  "rgb(41,105,176)",
                  "rgb(85,57,130)",
                  "rgb(40,50,78)",
                  "rgb(0,0,0)",
                  "rgb(247,218,100)",
                  "rgb(251,160,38)",
                  "rgb(235,107,86)",
                  "rgb(226,80,65)",
                  "rgb(163,143,132)",
                  "rgb(239,239,239)",
                  "rgb(255,255,255)",
                  "rgb(250,197,28)",
                  "rgb(243,121,52)",
                  "rgb(209,72,65)",
                  "rgb(184,49,47)",
                  "rgb(124,112,107)",
                  "rgb(209,213,216)",
                ],
              },
              link: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                popupClassName: undefined,
                dropdownClassName: undefined,
                showOpenOptionOnHover: true,
                defaultTargetOption: "_self",
                options: ["link", "unlink"],
                // link: { icon: link, className: undefined },
                // unlink: { icon: unlink, className: undefined },
                linkCallback: undefined,
              },
              emoji: {
                // icon: emoji,
                className: undefined,
                component: undefined,
                popupClassName: undefined,
                emojis: [
                  "😀",
                  "😁",
                  "😂",
                  "😃",
                  "😉",
                  "😋",
                  "😎",
                  "😍",
                  "😗",
                  "🤗",
                  "🤔",
                  "😣",
                  "😫",
                  "😴",
                  "😌",
                  "🤓",
                  "😛",
                  "😜",
                  "😠",
                  "😇",
                  "😷",
                  "😈",
                  "👻",
                  "😺",
                  "😸",
                  "😹",
                  "😻",
                  "😼",
                  "😽",
                  "🙀",
                  "🙈",
                  "🙉",
                  "🙊",
                  "👼",
                  "👮",
                  "🕵",
                  "💂",
                  "👳",
                  "🎅",
                  "👸",
                  "👰",
                  "👲",
                  "🙍",
                  "🙇",
                  "🚶",
                  "🏃",
                  "💃",
                  "⛷",
                  "🏂",
                  "🏌",
                  "🏄",
                  "🚣",
                  "🏊",
                  "⛹",
                  "🏋",
                  "🚴",
                  "👫",
                  "💪",
                  "👈",
                  "👉",
                  "👉",
                  "👆",
                  "🖕",
                  "👇",
                  "🖖",
                  "🤘",
                  "🖐",
                  "👌",
                  "👍",
                  "👎",
                  "✊",
                  "👊",
                  "👏",
                  "🙌",
                  "🙏",
                  "🐵",
                  "🐶",
                  "🐇",
                  "🐥",
                  "🐸",
                  "🐌",
                  "🐛",
                  "🐜",
                  "🐝",
                  "🍉",
                  "🍄",
                  "🍔",
                  "🍤",
                  "🍨",
                  "🍪",
                  "🎂",
                  "🍰",
                  "🍾",
                  "🍷",
                  "🍸",
                  "🍺",
                  "🌍",
                  "🚑",
                  "⏰",
                  "🌙",
                  "🌝",
                  "🌞",
                  "⭐",
                  "🌟",
                  "🌠",
                  "🌨",
                  "🌩",
                  "⛄",
                  "🔥",
                  "🎄",
                  "🎈",
                  "🎉",
                  "🎊",
                  "🎁",
                  "🎗",
                  "🏀",
                  "🏈",
                  "🎲",
                  "🔇",
                  "🔈",
                  "📣",
                  "🔔",
                  "🎵",
                  "🎷",
                  "💰",
                  "🖊",
                  "📅",
                  "✅",
                  "❎",
                  "💯",
                ],
              },
              embedded: {
                // icon: embedded,
                className: undefined,
                component: undefined,
                popupClassName: undefined,
                embedCallback: undefined,
                defaultSize: {
                  height: "auto",
                  width: "auto",
                },
              },
              image: {
                // icon: image,
                className: undefined,
                component: undefined,
                popupClassName: undefined,
                urlEnabled: true,
                uploadEnabled: true,
                alignmentEnabled: true,
                uploadCallback: undefined,
                previewImage: false,
                inputAccept:
                  "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                alt: { present: false, mandatory: false },
                defaultSize: {
                  height: "auto",
                  width: "auto",
                },
              },
              remove: {
                // icon: eraser,
                className: undefined,
                component: undefined,
              },
              history: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
                options: ["undo", "redo"],
                // undo: { icon: undo, className: undefined },
                // redo: { icon: redo, className: undefined },
              },
            }}
          />
        </EditorWrapper> */}
      </Box>
      <Box className={classes.container}>
        <div className={classes.radioContainer}>
          <Controller
            control={control}
            name={`required`}
            defaultValue={item?.required}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                label={t("REQUIRED")}
                control={<Checkbox checked={value} onChange={onChange} />}
              />
            )}
          />
        </div>
        <div className={classes.radioContainer}>
          <Controller
            control={control}
            name={`visible`}
            defaultValue={item?.visible}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                label={t("VISIBLE")}
                control={<Checkbox checked={value} onChange={onChange} />}
              />
            )}
          />
        </div>
        {/* <div className={classes.radioContainer}>
          <Controller
            control={control}
            name={t(`SEARCHABLE`)}
            defaultValue={item?.searchable}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                label="Searchable"
                control={<Checkbox checked={value} onChange={onChange} />}
              />
            )}
          />
        </div> */}
      </Box>
    </>
  );
};

export default longText;
