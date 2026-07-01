import HeaderStructure from "./headerStructure";
import "./styleHeader.css";
export default function Header(){
    return(
        <HeaderStructure
            title="test"
            username="Test"
            role="admin"
            avatar="https://i.pravatar.cc/40"
        />
    );
}