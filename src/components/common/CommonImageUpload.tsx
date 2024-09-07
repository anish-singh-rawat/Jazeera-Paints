import { Box, Button, Card, Divider, Theme, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { ChangeEvent, DragEvent, useRef } from "react";
import { useTranslation } from "react-i18next";
import Icon from "src/@core/components/icon";

const productImageUploadContainer = {
  width: "100%",
  minHeight: "250px",
  // border: "2px dashed #DBDADE",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  cursor: "pointer",
  textAlign: "center",
  borderRadius: "5px",
}

const productImageCard = {
  backgroundColor: (theme: Theme) => theme.palette.mode === "light" ? "rgba(255, 255, 255, 1)" : "#25293C",
  borderRadius: "5px",
}

const dragAndDropContainer = {
  paddingTop: "15px",
}

const iconSec = {
  display: "flex", flexDirection: "column", justifyContent: "center", gap: "5px", alignItems: "center",
}

const uploadIcon = {
  border: "none", color: (theme: Theme) => theme.palette.mode === "light" ? "#3586C7" : "rgba(228, 230, 244, 0.87);",
  cursor: "pointer", background: "none",
  "&:hover": {
    backgroundColor: (theme: Theme) => theme.palette.mode === "light" ? "rgba(250, 250, 250, 1)" : "rgb(47,51,73)",
  }
}

const dragAndDropText = {
  textAlign: "center", paddingBottom: "15px",
}

const divide = {
  border: "1px, solid ,black", gap: "10px",
}

const browseFileToUploadImg = {
  display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center",
  padding: "15px 10px 15px 10px", gap: "10px",
}

const browseBtn = {
  background: "var(--light-opacity-color-extra-dark-16, rgba(75, 75, 75, 0.16))",
  color: (theme: Theme) => theme.palette.mode === "light" ? "black" : "#ffff",
  border: "none", textTransform: "none", fontSize: "13px",
  "&:hover": {
    background: "var(--light-opacity-color-extra-dark-16, rgba(75, 75, 75, 0.16))",
    border: "none",
  },
}

const colorMode = {
  backgroundColor: (theme: Theme) => theme.palette.mode === "light" ? "rgba(250, 250, 250, 1)" : "rgb(47,51,73)",
}

type CommonImageUploadCallback = (images: string[] | string, file: any) => void;

const CommonImageUpload = ({ cb, custom = false, size = 5 }: { cb: CommonImageUploadCallback, custom?: boolean, size?: number }) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    if (files.length > 0) {
      let file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (imageUrl) cb(imageUrl, file);
      };
      reader.readAsDataURL(files[0]);
      // files.forEach((file) => {
      //   const reader = new FileReader();

      //   reader.onload = (event) => {
      //     const imageUrl = event.target?.result as string;
      //     imageUrls.push(imageUrl);

      //     if (imageUrls.length === files.length) {
      //       cb(imageUrls);
      //     }
      //   };

      //   reader.readAsDataURL(file);
      // });
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    if (files.length > 0) {
      let file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (imageUrl) cb(imageUrl, file);
      };
      reader.readAsDataURL(files[0]);

      //const imageUrls: string[] = [];

      //uncomment when we are uploading multiple files
      // files.forEach((file) => {
      //   const reader = new FileReader();
      //   reader.onload = (event) => {
      //     const imageUrl = event.target?.result as string;
      //     imageUrls.push(imageUrl);

      //     if (imageUrls.length === files.length) {
      //       cb(imageUrls);
      //     }
      //   };

      //   reader.readAsDataURL(file);
      // });
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box
      sx={{
        ...productImageUploadContainer
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleBoxClick}
    >
      <Box className="dropzone" style={{ width: "100%" }} ref={boxRef}>
        {!custom ? <>
          <Button
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            <Image
              src={"/images/logos/downloadIcon.png"}
              alt="Uploaded"
              width={50}
              height={50}
            />
          </Button>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
            {t("DROP_HEADING")}
          </Typography>
          <Typography>{t("DROP_ARTICLE")}</Typography>
        </> :
          <Card sx={{ ...productImageCard }}>
            <Box sx={{ ...dragAndDropContainer, ...colorMode }}>
              <Box sx={{ ...iconSec }}>
                <Button sx={{ ...uploadIcon }} startIcon={<Icon icon="tabler:cloud-upload" style={{ fontSize: "25px" }} />}></Button>
                <Typography sx={{ ...dragAndDropText }}>{t("DRAG_DROP")}</Typography>
              </Box>
              <Divider sx={{ ...divide }}>{t("PRODUCT_IMG_OR")}</Divider>
              <Box sx={{ ...browseFileToUploadImg }}>
                <Button sx={{ ...browseBtn }} variant="outlined" size="small">{t("BROWSE_FILES")}</Button>
                <Typography style={{ padding: "8px 15px" }}>{t("MAXIMUM_FILE_SIZE")} {size} MB</Typography>
              </Box>
            </Box>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
          </Card>
        }
      </Box>
    </Box>
  );
};

export default CommonImageUpload;
