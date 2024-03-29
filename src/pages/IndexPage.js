import { useEffect, useState } from "react";
import Post from "../Post";
import { address } from "../Header";
import { Link } from "react-router-dom";

export default function IndexPage(){
    const [posts,setPosts] = useState([]);

    var [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    /* useEffect(()=>{
        fetch(address+'/post').then(response=>{
            response.json().then(posts=>{
                setPosts(posts);
            });
        });
    },[]); */

    useEffect(()=>{
        fetch(address+'/post?page='+currentPage).then(response=>{
            response.json().then(posts=>{
                setPosts(posts.data);
                setTotalPages(Math.ceil(posts.totalCount/20));
            });
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

    return(
        <>
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
    );
}