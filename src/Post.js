import {formatISO9075} from "date-fns"; 
import { Link } from "react-router-dom";

export default function Post ({_id, title, summary, content, cover, createdAt, author}) {
    return (
        <div className="post">
            <Link to={`/post/${_id}`}>
                <div className="image">
                    <img src={'http://localhost:4000/'+cover} alt=""></img> 
                </div>
            </Link>
            <div className="texts">
            <Link to={`/post/${_id}`}>
                <h2>{title}</h2>
            </Link>
            <p className="info">
                <a className="author">{author.username}</a>
                <time>{formatISO9075(createdAt)}</time>
            </p>
            <p className="summary">{summary}</p>
            </div>  
      </div>
    )
}