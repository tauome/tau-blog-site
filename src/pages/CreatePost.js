import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css'; 
import ReactQuill from 'react-quill';
import { Navigate } from 'react-router-dom';

const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }],
  
      [{ list: 'ordered'}, { list: 'bullet' }],
      [{ indent: '-1'}, { indent: '+1' }],
  
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['link', 'image', 'video'],
      [{ color: [] }, { background: [] }],
  
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  }

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(''); 
  const [redirect, setRedirect] = useState(false); 

  async function createNewPost(e) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary); 
    data.set('content', content); 
    data.set('file', files[0]);

    e.preventDefault(); 
    const response = await fetch('http://localhost:4000/post', {
        method: 'POST',
        body: data,
        headers: {}
    });
    if (response.ok) {
        setRedirect(true); 
    }
  }

  if (redirect) {
    return <Navigate to='/'/>
  }

  return (
    <form onSubmit={createNewPost}>
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
        <ReactQuill modules={modules} 
                    value={content} 
                    onChange={newValue => setContent(newValue)}/>
        <button style={{marginTop: '5px'}}>Create Post</button>
    </form>
  )
}
