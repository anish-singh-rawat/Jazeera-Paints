import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import ReactDraftWysiwyg from "src/@core/components/react-draft-wysiwyg";
import { EditorState, ContentState, convertFromHTML, convertToRaw } from "draft-js";
import { EditorWrapper } from "src/@core/styles/libs/react-draft-wysiwyg";
import { useTranslation } from "react-i18next";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
// import DOMPurify from 'dompurify';

type LargeTextInputProps = {
  setValue?: Function | any;
  type?: string;
  value?: string;
  editModeValue?: string;
};

export default function LargeTextInput({
  setValue,
  type,
  value = "",
  editModeValue = ""
}: LargeTextInputProps) {
  const { t } = useTranslation();

  const getInitialState = (defaultValue: any) => {
    if (defaultValue) {
      const blocksFromHtml = htmlToDraft(defaultValue);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      return EditorState.createWithContent(contentState);
    } else {
      return EditorState.createEmpty();
    }
  };

  const [editorState, setEditorState] = useState(getInitialState(value));

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    setValue && setValue(type, draftToHtml(convertToRaw(newEditorState.getCurrentContent())));
  };

  useEffect(() => {
    if (editModeValue) {
      const newState = getInitialState(editModeValue);
      setEditorState(newState);
    }
  }, [editModeValue]);

  return (
    <Card
      style={{
        marginBottom: "12px",
      }}
    >
      <EditorWrapper>
        <ReactDraftWysiwyg
          editorState={editorState}
          editorStyle={{ minHeight: "300px" }}
          editorClassName="editorClassName"
          onEditorStateChange={onEditorStateChange}
          toolbarClassName="toolbarClassName"
          toolbarStyle={{ padding: "20px 0px 5px 10px" }}
          wrapperClassName="wrapperClassName"
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
            ],
            inline: {
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
              inDropdown: false,
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
              // icon: 12,
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
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
              inDropdown: false,
              options: ["unordered", "ordered", "indent", "outdent"],
              // unordered: { icon: unordered, className: undefined },
              // ordered: { icon: ordered, className: undefined },
              // indent: { icon: indent, className: undefined },
              // outdent: { icon: outdent, className: undefined },
            },
            textAlign: {
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
              inDropdown: false,
              options: ["left", "center", "right", "justify"],
              // left: { icon: left, className: undefined },
              // center: { icon: center, className: undefined },
              // right: { icon: right, className: undefined },
              // justify: { icon: justify, className: undefined },
            },
            colorPicker: {
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
              className: undefined,
              component: undefined,
              popupClassName: undefined,
              dropdownClassName: undefined,
              defaultTargetOption: "_self",
              inDropdown: false,
              options: ["link"],
              // link: { icon: link, className: undefined },
              // unlink: { icon: unlink, className: undefined },
              linkCallback: undefined,
              showOpenOptionOnHover: true,
            },
          }}
        />
      </EditorWrapper>
    </Card>
  );
}
