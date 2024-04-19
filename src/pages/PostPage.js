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
    const [favoritePosts, setFavoritePosts] = useState(new Set());
    const [refresh, setRefresh] = useState(false);

    /*
    This hook fetches the post, and if user is logged in, passes info to fetch
    the favoritePosts list and sets it
    */
    useEffect(()=>{
        let url = `${address}/post/${id}`;
        if (userInfo) url += `?user=${userInfo.id}`;
        fetch(url)
            .then(response => {
                response.json().then(postInfo => {
                    setPostInfo(postInfo.data);
                    if (postInfo && postInfo.favPosts){
                        setFavoritePosts(new Set(postInfo.favPosts));
                    }else{
                        setFavoritePosts(new Set());
                    }
                });
            });
    }, [refresh]);
    
    //fetches the comments on the post
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

    async function addFavorite(ev){
        const response = await fetch(`${address}/post/favorite/${id}?user=${userInfo.id}`, {
            method: 'POST',
        });
        if (response.ok){
            setFavoritePosts(new Set([...favoritePosts, id]));
        }
        setRefresh(!refresh);
    }

    async function removeFavorite(){
        const response = await fetch(`${address}/post/favorite/${id}?user=${userInfo.id}`, {
            method: 'DELETE',
        });
        if (response.ok){
            setFavoritePosts(new Set([...favoritePosts].filter(postId => postId !== id)));
        }
        setRefresh(!refresh);
    }
    
    function isFavorite(){
        //converts set to array and loops through
        return Array.from(favoritePosts).find(item => item._id === id) !== undefined;
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
            <div>
                <p className="view">{(postInfo.views)} 
                    <svg className="eye" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </p>
            </div>
            {userInfo !== null && (
                <div className="edit-row">
                    {userInfo.id === postInfo.author._id && (
                        <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            Edit Post
                        </Link>
                    )}
                    {!isFavorite() && (
                        <Link className="edit-btn" onClick={addFavorite}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                            Add to Favorites
                        </Link>
                    )}
                    {isFavorite() && favoritePosts.size > 0 && (
                        <Link className="edit-btn" onClick={removeFavorite}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>
                            Remove from Favorites
                        </Link>
                    )}
                    {userInfo.id === postInfo.author._id && (
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