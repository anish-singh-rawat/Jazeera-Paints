import CommonCardWithHeader from "src/components/common/CommonCardWithHeader";
import CommonImageUpload from "src/components/common/CommonImageUpload";
import { useTranslation } from "react-i18next";

export default function ProductsImagesSection () {
    const { t } = useTranslation();

    const ProductImage = () => {
        return <CommonImageUpload cb={() => alert()} />
    }

    return <>
    <CommonCardWithHeader
                header={t("PRODUCT_IMAGE")}
                component={<ProductImage />}
            />
    </>
}