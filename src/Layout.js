import Header from "./Header";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout(){
    return(
        <main>
            <div className="layout-container">
                <Sidebar />
                <Header />
                <Outlet />
            </div>
        </main>
    );
}