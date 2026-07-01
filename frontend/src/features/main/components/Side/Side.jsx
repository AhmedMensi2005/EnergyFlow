import Sidebar from "./Sidebar";
import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";

export default function Side({activePage,setActivePage}){
    return (
    <Sidebar
      header={<SidebarHeader subTitle="Startup Village" />}
      nav={<SidebarNav activePage={activePage} setActivePage={setActivePage}/>}
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