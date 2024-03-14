import { useEffect, useState } from "react";
import { address } from "../Header";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";

export default function PostPage() {
    const [postInfo,setPostInfo] = useState(null);
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
            <div className="image">
                <img src={`${address}/${postInfo.cover}`} alt="" />
            </div>

            <div dangerouslySetInnerHTML={{__html:postInfo.content}} />
        </div>
    );
}