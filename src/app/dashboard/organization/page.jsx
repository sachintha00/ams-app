import dynamic from "next/dynamic";

const OrganizationComponent = dynamic(() => import("./organization"), {
  ssr: false,
});

export default function Page() {
  return <OrganizationComponent />;
}
