import { useContext, useEffect, useState } from "react";
import { address } from "../Header";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";

export default function PostPage() {
    const [postInfo,setPostInfo] = useState(null);
    const {userInfo} = useContext(UserContext);
    const {id} = useParams();
    useEffect(()=>{    
        fetch(`${address}/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    setPostInfo(postInfo);
                });
            });
    }, []);

    if (!postInfo) return '';
    return (
        <div className="post-page">
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            <div className="author">by {postInfo.author.username}</div>
            {userInfo !== null && userInfo.id === postInfo.author._id && (
                <div className="edit-row">
                    <a className="edit-btn" href="">Edit Post</a>
                </div>
            )}
            <div className="image">
                <img src={`${address}/${postInfo.cover}`} alt="" />
            </div>

            <div dangerouslySetInnerHTML={{__html:postInfo.content}} />
        </div>
    );
}