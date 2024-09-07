// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";

// ** Third Party Imports
import axios from "axios";

// ** Type Imports
import { ProjectListDataType } from "src/types/apps/userTypes";

interface CellType {
  row: ProjectListDataType;
}
const Img = styled("img")(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: "50%",
  marginRight: theme.spacing(2.5),
}));

const columns = [
  {
    flex: 0.35,
    minWidth: 250,
    field: "projectTitle",
    headerName: "Project",
    renderCell: ({ row }: CellType) => (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Img src={row.img} alt={`project-${row.projectTitle}`} />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontWeight: 500, color: "text.secondary" }}>
            {row.projectTitle}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.disabled" }}>
            {row.projectType}
          </Typography>
        </Box>
      </Box>
    ),
  },
  {
    flex: 0.2,
    minWidth: 126,
    field: "totalTask",
    headerName: "Total Tasks",
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: "text.secondary" }}>{row.totalTask}</Typography>
    ),
  },
  {
    flex: 0.25,
    minWidth: 180,
    headerName: "Progress",
    field: "progressValue",
    renderCell: ({ row }: CellType) => (
      <Box sx={{ width: "100%" }}>
        <Typography
          sx={{ mb: 1.5, color: "text.secondary" }}
        >{`${row.progressValue}%`}</Typography>
        <LinearProgress
          sx={{ height: 8 }}
          variant="determinate"
          value={row.progressValue}
          color={row.progressColor}
        />
      </Box>
    ),
  },
  {
    flex: 0.2,
    minWidth: 110,
    field: "hours",
    headerName: "Hours",
    renderCell: ({ row }: CellType) => (
      <Typography
        sx={{ color: "text.secondary" }}
      >{`${row.hours}h`}</Typography>
    ),
  },
];

const InvoiceListTable = () => {
  // ** State
  const [value, setValue] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(7);
  const [data, setData] = useState<ProjectListDataType[]>([]);

  // useEffect(() => {
  //   axios
  //     .get("/apps/users/project-list", {
  //       params: {
  //         q: value,
  //       },
  //     })
  //     .then((res) => setData(res.data));
  // }, [value]);

  const projectListData: ProjectListDataType[] = [
    {
      id: 1,
      hours: "18:42",
      progressValue: 78,
      totalTask: "122/240",
      progressColor: "success",
      projectType: "React Project",
      projectTitle: "BGC eCommerce App",
      img: "/images/icons/project-icons/react.png",
    },
    {
      id: 2,
      hours: "20:42",
      progressValue: 18,
      totalTask: "9/56",
      progressColor: "error",
      projectType: "Figma Project",
      projectTitle: "Falcon Logo Design",
      img: "/images/icons/project-icons/figma.png",
    },
    {
      id: 3,
      hours: "120:87",
      progressValue: 62,
      totalTask: "290/320",
      progressColor: "primary",
      projectType: "VueJs Project",
      projectTitle: "Dashboard Design",
      img: "/images/icons/project-icons/vue.png",
    },
    {
      id: 4,
      hours: "89:19",
      progressValue: 8,
      totalTask: "7/63",
      progressColor: "error",
      projectType: "Xamarin Project",
      projectTitle: "Foodista Mobile App",
      img: "/images/icons/project-icons/xamarin.png",
    },
    {
      id: 5,
      hours: "230:10",
      progressValue: 49,
      totalTask: "120/186",
      progressColor: "warning",
      projectType: "Python Project",
      projectTitle: "Dojo React Project",
      img: "/images/icons/project-icons/python.png",
    },
    {
      id: 6,
      hours: "342:41",
      progressValue: 92,
      totalTask: "99/109",
      progressColor: "success",
      projectType: "Sketch Project",
      projectTitle: "Blockchain Website",
      img: "/images/icons/project-icons/sketch.png",
    },
    {
      id: 7,
      hours: "12:45",
      progressValue: 88,
      totalTask: "98/110",
      progressColor: "success",
      projectType: "HTML Project",
      projectTitle: "Hoffman Website",
      img: "/images/icons/project-icons/html5.png",
    },
  ];

  return (
    <Card>
      <CardHeader title="User's Projects List" />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Typography variant="body2" sx={{ mr: 2 }}>
            Search:
          </Typography>
          <TextField
            size="small"
            placeholder="Search Project"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Box>
      </CardContent>
      <DataGrid
        autoHeight
        rows={projectListData}
        rowHeight={60}
        columns={columns}
        pageSize={pageSize}
        disableSelectionOnClick
        rowsPerPageOptions={[7, 10, 25, 50]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      />
    </Card>
  );
};

export default InvoiceListTable;
