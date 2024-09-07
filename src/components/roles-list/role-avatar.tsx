import { Avatar } from "@mui/material";
import { getNameInitials } from "src/@core/utils/general";

export default function RoleAvatar({ item }: { item: Record<string, any> }) {
    return <Avatar
        alt="Remy Sharp"
        src={item?.image}
        sx={{ bgcolor: "#DEEBF6", color: "#3586C7", textTransform: "uppercase", width: "32px",
        height: "32px", }}
    >
        {getNameInitials(item?.firstName, item?.lastName)}
    </Avatar>
}