import Sidebar from "./Sidebar";
import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";

export default function Side(){
    return (
    <Sidebar
      header={<SidebarHeader subTitle="Startup Village" />}
      nav={<SidebarNav />}
      footer={
        <SidebarFooter
            username="Name"
            role="Role"
            avatar="https://i.pravatar.cc/40"
        />
      }
    />
    
    );
}