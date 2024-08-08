import React, { useEffect } from 'react';
import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Editor from '../Editor';


export default function EditPost() {
    const {id} = useParams(); 
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    const baseUrl = process.env.baseUrl;  

    useEffect(() => {
        fetch(`https://tau-blog-site.vercel.app/api/post/`+id).then(response => {
            response.json().then(postInfo => {
                setTitle(postInfo.title)
                setSummary(postInfo.summary)
                setContent(postInfo.content)
            })
        })
    }, [])


    async function editPost(e){
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary); 
        data.set('content', content); 
        data.set('file', files?.[0]);
        data.set('id', id); 

        e.preventDefault(); 
        await fetch(`https://tau-blog-site.vercel.app/api/post` , {
            method: 'PUT',
            body: data,
            credentials: 'include'
        })
        setRedirect(true);
    }

    if (redirect) {
        return <Navigate to={'/post/'+id}/>
    }

  return (
    <form onSubmit={editPost}>
        <input  placeholder='Title' 
                value={title} 
                onChange={e => setTitle(e.target.value)}>
        </input>
        <input placeholder='Summary' 
                value={summary} 
                onChange={e => setSummary(e.target.value)}>
        </input>
        <input type='file' 
                onChange={e => setFiles(e.target.files)}>
        </input>
        <Editor value={content} onChange={setContent}/>
        <button style={{marginTop: '5px'}}>Finish Edit</button>
    </form>
  )
}
