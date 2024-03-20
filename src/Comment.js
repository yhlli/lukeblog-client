import {formatISO9075} from "date-fns"
import { address } from "./Header"
import { Link } from "react-router-dom"

export default function Comment({author,content,createdAt}){

    return (
        <div className="comment">
            <p className="commentinfo">
                <a className="cauthor">{author.username}</a>
                <time>{formatISO9075(new Date(createdAt))}</time>
            </p>
            <p className="commentContent">{content}</p>
        </div>
    )
}