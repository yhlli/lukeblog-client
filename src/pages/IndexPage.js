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

    //1:date desc, 2:date asc, 3:views desc, 4:views asc
    const [sortBy, setsortBy] = useState(1);
    const sortCriteria = {
        1: "Date descending",
        2: "Date ascending",
        3: "Views descending",
        4: "Views ascending",
    };

    useEffect(()=>{
        fetch(address+'/post?page='+currentPage+'&sort='+sortBy).then(response=>{
            response.json().then(posts=>{
                setPosts(posts.data);
                setTotalPages(Math.ceil(posts.totalCount/20));
            });
            setIsLoading(false);
        });
    },[currentPage,sortBy]);

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
                <div id="sortdiv">
                    <li className="sort"><Link>Sort By</Link>
                        <ul>
                            <li><Link onClick={()=>setsortBy(1)}>Date desc.</Link></li>
                            <li><Link onClick={()=>setsortBy(2)}>Date asc.</Link></li>
                            <li><Link onClick={()=>setsortBy(3)}>Views desc.</Link></li>
                            <li><Link onClick={()=>setsortBy(4)}>Views asc.</Link></li>
                        </ul>
                    </li>
                    <p>{sortCriteria[sortBy]}</p>
                </div>
                
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