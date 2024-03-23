import { useEffect } from "react";
import { address } from "../Header";
import { useParams } from "react-router-dom";

export default function UserPage(){
    const { id } = useParams();
    useEffect(()=>{
        fetch(`${address}/user/${id}`).then(response=>{
            response.json().then()
        });
    },[]);

    return (
        <div>{id}</div>
    );
}