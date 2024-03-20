import { useEffect, useState } from "react";
import Post from "../Post";
import { address } from "../Header";

export default function IndexPage(){
    const [posts,setPosts] = useState([]);
    useEffect(()=>{
        fetch(address+'/post').then(response=>{
            response.json().then(posts=>{
                posts.forEach(function (postItem){
                    var co = postItem.cover;
                    if (String(co).indexOf('/') > -1){
                        postItem.cover = 'uploads\\default.jpg';
                    } 
                })
                setPosts(posts);
            });
        });
    },[]);

    return(
        <>
            {posts.length > 0 && posts.map(post => (
                <Post {...post} />
            ))}
        </>
    );
}