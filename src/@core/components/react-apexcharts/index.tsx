// ** Next Import
import dynamic from "next/dynamic";

// ! To avoid 'Window is not defined' error
const ReactApexchart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function ReactApexcharts(props: any) {
  return <ReactApexchart {...props} />;
}
