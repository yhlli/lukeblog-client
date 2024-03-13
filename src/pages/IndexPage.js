import { useEffect, useState } from "react";
import Post from "../Post";
import { address } from "../Header";

export default function IndexPage(){
    const [posts,setPosts] = useState([]);
    useEffect(async ()=>{
        await fetch(address+'/post').then(response=>{
            response.json().then(posts=>{
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