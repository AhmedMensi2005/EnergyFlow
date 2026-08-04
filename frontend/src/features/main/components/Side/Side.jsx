import Sidebar from "./Sidebar";
import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";

<<<<<<< HEAD
export default function Side({ activePage, setActivePage }) {

    const user = JSON.parse(
        localStorage.getItem("user")
=======
export default function Side({activePage,setActivePage,onExport}){

    

    return (
    <Sidebar
      header={<SidebarHeader subTitle="Startup Village" />}
      nav={<SidebarNav activePage={activePage} setActivePage={setActivePage} onExport={onExport}/>}
      footer={
        <SidebarFooter
            username="Name"
            role="Role"
            avatar="https://i.pravatar.cc/40"
        />
      }
    />

    
>>>>>>> origin/feature/devices
    );

    const initials = user?.username
    ? user.username
          .split(" ")
          .map(word => word[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
    : "?";

    return (

        <Sidebar

            header={
                <SidebarHeader
                    subTitle="Startup Village"
                />
            }

            nav={
                <SidebarNav
                    activePage={activePage}
                    setActivePage={setActivePage}
                />
            }

            footer={
                <SidebarFooter
                    username={user?.username || "Unknown"}
                    role={user?.role || ""}
                    avatar={initials}
                />
            }

        />

    );

}