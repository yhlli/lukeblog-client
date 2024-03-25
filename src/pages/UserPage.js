import { useContext, useEffect, useState } from "react";
import { address } from "../Header";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function UserPage(){
    const {userInfo} = useContext(UserContext);
    const [aboutMe, setaboutMe] = useState(null);
    const {id} = useParams();
    useEffect(()=>{
        fetch(`${address}/user/${id}`)
            .then(response=>{
                response.json().then(aboutMe => {
                    setaboutMe(aboutMe);
                });
            });
    },[]);
    return (
        <div className="profile">
            <h1>{id}</h1>
            {aboutMe !== null && (
                <div className="bio" dangerouslySetInnerHTML={{__html:aboutMe[0].content}} />
            )}
            { userInfo !== 'not logged in' && userInfo.username === id && (
                <Link className="edit-btn" to={`/user/editbio/${id}`}>Edit Profile</Link>
            )}
        </div>
    );
}