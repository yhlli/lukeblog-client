import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { address } from "../Header";

export default function GroceryPage(){
    const {userInfo} = useContext(UserContext);
    const [grocery, setGrocery] = useState([]);
    useEffect(()=>{
        fetch(`${address}/${userInfo.id}/grocerylist`, {
            method: 'GET',
            credentials: 'include',
        }).then(response=>{response.json().then(
            grocery=>{
                setGrocery(grocery);
            }
        )});
    },[]);
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