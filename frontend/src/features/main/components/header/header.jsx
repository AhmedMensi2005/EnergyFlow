import HeaderStructure from "./headerStructure";
import "./styleHeader.css";
export default function Header({label}){
    return(
        <HeaderStructure
            title={label}
            username="Test"
            role="admin"
            avatar="https://i.pravatar.cc/40"
        />
    );
}