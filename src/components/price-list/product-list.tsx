import {
  Checkbox,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from "@mui/material";
import Image from "next/image";
import ListItemIcon from "@mui/material/ListItemIcon";
interface ProductListProps {
  isChecked: boolean;
  item: any;
  handleCheckedProducts: (checked: any) => void;
}

const ProductList = ({
  isChecked,
  item,
  handleCheckedProducts,
}: ProductListProps) => {
  return (
    <>
      <ListItem>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={isChecked}
            tabIndex={-1}
            onChange={() => handleCheckedProducts(item)}
            // inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemAvatar>
          {!item?.image ? (
            <Skeleton
              animation={false}
              variant="rectangular"
              width={40}
              height={40}
              sx={{ background: item?.hexCode }}
            />
          ) : (
            <Image
              alt={item?.shortName}
              src={item?.image}
              height={40}
              width={40}
              style={{ borderRadius: "4px" }}
            />
          )}
        </ListItemAvatar>
        <ListItemText
          primary={item?.shortName}
          secondary={`${item?.altShortName ?? ""} | ${item?.code ?? ""}`}
        />
      </ListItem>
    </>
  );
};

export default ProductList;
