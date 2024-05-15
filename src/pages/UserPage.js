import { useContext, useEffect, useState } from "react";
import { address } from "../Header";
import { Link, Navigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import Post from "../Post";
import Loading from "../Loading";

export default function UserPage(){
    const {setUserInfo,userInfo} = useContext(UserContext);
    const [aboutMe, setaboutMe] = useState(null);
    const [posts, setPosts] = useState('');
    const {id} = useParams();

    var [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isOn, setIsOn] = useState(false);
    const [redirect,setRedirect] = useState(false);

    //1:date desc, 2:date asc, 3:views desc, 4:views asc
    const [sortBy, setsortBy] = useState(1);
    const sortCriteria = {
        1: "Date descending",
        2: "Date ascending",
        3: "Views descending",
        4: "Views ascending",
    };

    useEffect(()=>{
        fetch(`${address}/user/${id}`)
            .then(response=>{
                response.json().then(aboutMe => {
                    setaboutMe(aboutMe);
                });
            });
    },[]);
    useEffect(()=>{
        fetch(`${address}/user/post/${id}?page=${currentPage}&sort=${sortBy}&fav=${isOn}`)
            .then(response=>{
                response.json().then(posts =>{
                    setPosts(posts.data);
                    setTotalPages(Math.ceil(posts.totalCount/20));
                });
                setIsLoading(false);
            });
    },[currentPage,sortBy,isOn]);

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

    function ToggleButton(){
        const handleClick = ()=>{
            setIsOn(!isOn);
        };
        return(
            <button onClick={handleClick} className={`fav ${isOn ? 'clicked' : ''}`}>
                {isOn ? 'Favorites' : 'Favorites'}
            </button>
        )
    }

    async function deleteProfile(){
        const confirmDelete = window.confirm('Are you sure you want to delete your profile? Your posts and comments will also be deleted.');
        if (confirmDelete){
            const response = await fetch(`${address}/user/${id}/delete`, {method: 'DELETE', credentials: 'include'});
            if (response.ok){
                logout();
                setRedirect(true);
            }
        }
    }
    if (redirect){
        return <Navigate to={'/'} />
    }
    async function logout(){
        await fetch(address+'/logout', {
          credentials: 'include',
          method: 'POST',
        });
        setUserInfo(null);
    }

    return (
        <>
            {isLoading ? <Loading /> : (
                <>
                    <div id="sortheader">
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
                        {userInfo !== null && userInfo.username === id && (
                            <ToggleButton />
                        )}
                    </div>
                    <div className="profile">
                        <h1>{id}</h1>
                        {(aboutMe !== null && aboutMe[0] !== undefined) && (
                            <div className="bio" dangerouslySetInnerHTML={{__html:aboutMe[0].content}} />
                        )}
                        { userInfo !== null && userInfo.username === id && (
                            <Link className="edit-btn" to={`/user/editbio/${id}`}>Edit Profile</Link>
                        )}
                        { userInfo !== null && userInfo.username === id && (
                            <Link className="delete-btn" onClick={()=>deleteProfile()}>Delete Profile</Link>
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