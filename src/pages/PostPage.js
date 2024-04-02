import { useContext, useEffect, useState } from "react";
import { address } from "../Header";
import { Link, Navigate, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import Comment from "../Comment";


export default function PostPage() {
    const [postInfo,setPostInfo] = useState(null);
    const {userInfo} = useContext(UserContext);
    const [comment,setComment] = useState('');
    const [comments,setComments] = useState('');
    const [redirect,setRedirect] = useState(false);
    const {id} = useParams();
    useEffect(()=>{    
        fetch(`${address}/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    setPostInfo(postInfo);
                });
            });
    }, []);
    
    useEffect(()=>{
        fetch(`${address}/comment/${id}`)
            .then(response => {
                response.json().then(comments =>{
                    setComments(comments);
                })
            });
    },[]);

    async function deletePost(ev){
        ev.preventDefault();
        const response = await fetch(`${address}/post/${id}`, {
            method: 'DELETE',
            body: id,
        })
        if (response.ok) setRedirect(true);
    }

    async function addComment(ev){
        ev.preventDefault();
        const data = new FormData();
        data.set('comment', comment);
        data.set('postId', id);
        const response = await fetch(`${address}/comment/${id}`, {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
        if (response.ok){
            const newComment = await response.json();
            setComments([...comments, newComment]);
            setComment('');
        }
    }

    async function deleteComment(e){
        const response = await fetch(`${address}/comment/${e}`, {
            method: 'DELETE',
        })
        if (response.ok){
            setComments(comments.filter(comment => comment._id !== e));
        }
    }

    if (redirect){
        return <Navigate to={'/'} />
    }
    
    if (!postInfo) return '';

    return (
        <div className="post-page">
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            <div className="author">
                <p className="by">by </p>
                <Link to={`/user/${postInfo.author.username}`} className="author">{postInfo.author.username}</Link>
            </div>
            
            {/* <div className="author">by {postInfo.author.username}</div> */}
            {userInfo !== null && userInfo.id === postInfo.author._id && (
                <div className="edit-row">
                    <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Edit Post
                    </Link>
                    {userInfo !== null && userInfo.id === postInfo.author._id && (
                        <Link className="edit-btn" onClick={deletePost}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Delete Post
                        </Link>
                    )}
                </div>
            )}
            <div className="image">
                <img src={`${address}/${postInfo.cover}`} alt="" />
            </div>
            <div dangerouslySetInnerHTML={{__html:postInfo.content}} />
            {comments.length > 0 && (
                <p style={{textAlign: "center", marginTop: "50px", marginLeft: "0px", border: "1px solid white",}}>Comments</p>
            )}

            {comments.length > 0 && comments.map(comment => (
                <div className="commentbar">
                    <Comment {...comment} key={comment._id} deleteComment={deleteComment} />
                </div>
            ))}

            {userInfo !== null && (
                <form className="commentForm" onSubmit={addComment}>
                    <input type="text" 
                        placeholder="Comment"
                        value={comment}
                        onChange={ev => setComment(ev.target.value)} />
                    <button id="createbtn" style={{marginTop:'5px'}}>Add Comment</button>
                </form>
            )}
        </div>
    );
}