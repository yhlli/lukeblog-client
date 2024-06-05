import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { address } from "../Header";


export default function EditBio(){
    const {id} = useParams();
    const [content,setContent] = useState('');
    const [redirect,setRedirect] = useState(false);

    async function addBio(ev){
        const data = new FormData();
        data.set('content', content);
        ev.preventDefault();
        console.log(content);
        const response = await fetch(`${address}/user/editbio/${id}`, {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
        if (response.ok){
            setRedirect(true);
        }
    }

    if (redirect){
        return <Navigate to={`/user/${id}`} />
    }

    return(
        <form onSubmit={addBio}>
            <input type="text" 
                placeholder="Bio..."
                value={content}
                onChange={ev=>{setContent(ev.target.value)}} />
            <button id="createbtn" style={{marginTop:'5px'}}>Edit Bio</button>
        </form>
    );
}