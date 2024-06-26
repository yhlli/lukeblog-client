import { useContext } from "react";
import { UserContext } from "../UserContext";

export default function GroceryPage(){
    const {userInfo} = useContext(UserContext);
    return (
        <>
        {userInfo !== null && (
            <>
            <h1>Hi</h1>
            </>
        )}
        </>
    );
}