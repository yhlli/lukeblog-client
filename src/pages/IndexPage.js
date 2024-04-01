import { useEffect, useState } from "react";
import Post from "../Post";
import { address } from "../Header";
import { Link } from "react-router-dom";
import Loading from "../Loading";

export default function IndexPage(){
    const [posts,setPosts] = useState([]);

    var [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        fetch(address+'/post?page='+currentPage).then(response=>{
            response.json().then(posts=>{
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

    return(
        <>
            {isLoading ? <Loading /> : (
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
            )}
        </>
    );
}