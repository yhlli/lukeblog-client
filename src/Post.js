import {formatISO9075} from "date-fns"
import { address } from "./Header"

export default function Post({title,summary,cover,content,createdAt,author}){

    return (
        <div className="post">
        <div className="image">
          <img src={address+'/'+cover} alt="" />
        </div>
        <div className="texts">
          <h2>{title}</h2>
          <p className="info">
            <a className="author">{author.username}</a>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          <p className="summary">{summary}</p>
        </div>
      </div>
    )
}