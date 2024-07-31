const express = require('express');
const app = express(); 
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const UserModel = require('./models/User');
const PostModel = require('./models/Post'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 
const fs = require('fs');
const multer = require('multer'); 
const uploadMiddleware = multer({dest: '/tmp'}); 
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config()

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

app.use(cors({credentials: true, origin: 'http://localhost:3000'})); 
app.use(express.json());
app.use(cookieParser()); 
app.use('/uploads', express.static(__dirname + '/uploads'));



async function uploadtoS3(path, originalFilename, mimeType){
    const client = new S3Client({
        region: 'us-east-2',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    }); 
    const parts = originalFilename.split('.');
    const ext = parts[parts.length - 1 ]; 
    const newFilename = Date.now() + '.' + ext; 
    
    const data = await client.send(new PutObjectCommand({
        Bucket: 'tau-blog-app',
        Body: fs.readFileSync(path), 
        Key: newFilename,
        ContentType: mimeType,
        ACL: 'public-read'
    })); 
    return `https://tau-blog-app.s3.amazonaws.com/${newFilename}`;
}

// register as user
app.post('/register', async (req, res) => {
    mongoose.connect(process.env.MONGODB_URI);
    const {username, password} = req.body;
    try {
        const userDoc = await UserModel.create({
            username,
            password: bcrypt.hashSync(password, salt),
        })
        res.json(userDoc); 
    } catch (e) {
        console.log(e); 
        res.status(400).json(e); 
    }
})

// login and sign jwt
app.post('/login', async (req,res) => {
    mongoose.connect(process.env.MONGODB_URI);
    const {username,password} = req.body;
    const userDoc = await UserModel.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      // logged in
      jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json({
          id:userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json('wrong credentials');
    }
  });

  // get user info using jwt
  app.get('/profile', (req, res) => {
    mongoose.connect(process.env.MONGODB_URI);
    const {token} = req.cookies; 
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info); 
    });
  })

  // logout of app
  app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
  })


 // create post
  app.post('/post',uploadMiddleware.single('file'), async (req,res) => {
    mongoose.connect(process.env.MONGODB_URI);
    const {originalname, path, mimeType} = req.file;
    const url = await uploadtoS3(path, originalname, mimeType);

    // we use jwt.verify to get user id 
    const {token} = req.cookies; 
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {title, summary, content} = req.body; 
        const postDoc = await PostModel.create({
        title,
        summary,
        content, 
        cover: url,
        author: info.id
    }) 
        res.json(postDoc); 
    });
  });

  // get all posts
  app.get('/post', async (req, res) => {
    mongoose.connect(process.env.MONGODB_URI);
    const posts = await PostModel.find().populate('author', ['username']).sort({createdAt: - 1})
    res.json(posts); 
  }); 

  // get single post
  app.get('/post/:id', async (req, res) =>{
    mongoose.connect(process.env.MONGODB_URI);
    const {id} = req.params; 
    const postDoc = await PostModel.findById(id).populate('author', ['username']); 
    res.json(postDoc); 
  })

  // update post
  app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    mongoose.connect(process.env.MONGODB_URI);
    let url = null;
    if (req.file) {
        const {originalname, path, mimeType} = req.file;
        url = await uploadtoS3(path, originalname, mimeType);
    }

    const {token} = req.cookies; 
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const {id, title, summary, content} = req.body; 
        const postDoc = await PostModel.findById(id); 
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id); 
        
        if (!isAuthor) return res.status(400).json('you are not the author'); 

        await postDoc.updateOne({
            title, 
            summary, 
            content,
            cover: url
        })
        res.json(postDoc); 
    });

  })

app.listen(4000);

