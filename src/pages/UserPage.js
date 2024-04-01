import { useContext, useEffect, useState } from "react";
import { address } from "../Header";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import Post from "../Post";

export default function UserPage(){
    const {userInfo} = useContext(UserContext);
    const [aboutMe, setaboutMe] = useState(null);
    const [posts, setPosts] = useState('');
    const {id} = useParams();
    useEffect(()=>{
        fetch(`${address}/user/${id}`)
            .then(response=>{
                response.json().then(aboutMe => {
                    setaboutMe(aboutMe);
                });
            });
    },[]);
    useEffect(()=>{
        fetch(`${address}/user/post/${id}`)
            .then(response=>{
                response.json().then(posts =>{
                    setPosts(posts);
                });
            })
    },[]);
    return (
        <>
            <div className="profile">
                <h1>{id}</h1>
                {aboutMe != null || aboutMe != undefined && (
                    <div className="bio" dangerouslySetInnerHTML={{__html:aboutMe[0].content}} />
                )}
                { userInfo !== 'not logged in' && userInfo.username === id && (
                    <Link className="edit-btn" to={`/user/editbio/${id}`}>Edit Profile</Link>
                )}
            </div>
            <br></br>
            {posts.length > 0 && posts.map(post => (
                <Post {...post} />
            ))}
        </>
        
    );
}