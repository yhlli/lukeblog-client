import { useContext, useEffect, useState } from "react";
import { address } from "../Header";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import Post from "../Post";
import Loading from "../Loading";

export default function UserPage(){
    const {userInfo} = useContext(UserContext);
    const [aboutMe, setaboutMe] = useState(null);
    const [posts, setPosts] = useState('');
    const {id} = useParams();

    var [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=>{
        fetch(`${address}/user/${id}`)
            .then(response=>{
                response.json().then(aboutMe => {
                    setaboutMe(aboutMe);
                    console.log(aboutMe);
                });
            });
    },[]);
    useEffect(()=>{
        fetch(`${address}/user/post/${id}?page=${currentPage}`)
            .then(response=>{
                response.json().then(posts =>{
                    setPosts(posts.data);
                    setTotalPages(Math.ceil(posts.totalCount/20));
                });
                setIsLoading(false);
            });
    },[currentPage]);

    function firstPage(){
        setCurrentPage(1);
    }

    function nextPage(){
        setCurrentPage(currentPage + 1);
    }

    function lastPage(){
        setCurrentPage(totalPages);
    }
    
    function prevPage(){
        setCurrentPage(currentPage - 1);
    }

    return (
        <>
            {isLoading ? <Loading /> : (
                <>
                    <div className="profile">
                        <h1>{id}</h1>
                        {(aboutMe !== null || aboutMe !== undefined) && (
                            <div className="bio" dangerouslySetInnerHTML={{__html:aboutMe[0].content}} />
                        )}
                        { userInfo !== null && userInfo.username === id && (
                            <Link className="edit-btn" to={`/user/editbio/${id}`}>Edit Profile</Link>
                        )}
                    </div>
                    <br></br>
                    {posts.length > 0 && posts.map(post => (
                        <Post {...post} />
                    ))}
                    <div className="pagination">
                            {currentPage>1 && (
                                <>
                                    <Link onClick={firstPage}>First</Link>
                                    <Link onClick={prevPage}>Prev</Link>
                                </>
                            )}
                            <div>{currentPage}</div>
                            {currentPage<totalPages && (
                                <>
                                    <Link onClick={nextPage}>Next</Link>
                                    <Link onClick={lastPage}>Last</Link>
                                </>
                            )}
                    </div>
                </>
            )}
        </>
    );
}