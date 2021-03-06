const blogsRouter =require("express").Router()
const Blog=require("../models/blog")
const User = require('../models/user')
const jwt = require('jsonwebtoken')





blogsRouter.get('/', async (request, response) => {
    
  const blogs= await Blog.find({})
                         .populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog=>blog.toJSON()))
  })



blogsRouter.post('/', async (request, response) => {
   
 
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  
  
  


  if(body.title!==undefined&&body.author!==undefined&&body.url!==undefined){

  const blog = new Blog({
    title:body.title,
    author:body.author,
    url:body.url,
    likes:body.likes,
    user: user._id    //aka the creator's id

  })
 
  const savedBlog= await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog.toJSON())}

  else{
    response.status(400).end()
  }
})

  

  blogsRouter.get('/:id', async (request, response) => {
    
      const blog = await Blog.findById(request.params.id)
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    
  })
  
  blogsRouter.delete('/:id', async (request, response) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const targetBlog=await Blog.findById(request.params.id)

  console.log("decoded token id (user id):",decodedToken.id)
  console.log("target blog user:",targetBlog.user)


   if (String(decodedToken.id)===String(targetBlog.user)){
      
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()}

   else{
     return response.status(400).json({error:'Only creator of the blog can delete it.'})}
 
})
  

  
  blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog={
      title:body.title,
      author:body.author,
      url:body.url,
      likes:body.likes,
      
    }

      await Blog.findByIdAndUpdate(request.params.id,blog, {new:true})
      response.status(200).end()
      
    
  })
    

  module.exports=blogsRouter