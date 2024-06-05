import Header from "./Header";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout(){
    return(
        <>
            <Sidebar />
            <main>
                <div className="layout-container">
                    <Header />
                    <Outlet />
                </div>
            </main>
        </>
        
    );
}