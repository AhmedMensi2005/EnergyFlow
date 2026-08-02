import HeaderStructure from "./headerStructure";
import "./styleHeader.css";

export default function Header({label}) {

    const user = JSON.parse(
        localStorage.getItem("user")
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

        <HeaderStructure
            title={label}
            username={user?.username || "Unknown"}
            role={user?.role || ""}
            avatar={initials}
        />

    );
}