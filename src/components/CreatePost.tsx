"use client"

import { useUser } from '@clerk/nextjs'
import React, { useState } from 'react'
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { ImageIcon, Loader2Icon, SendIcon } from 'lucide-react';
import { Button } from './ui/button';
import ImageUpload from './ImageUpload';
import { createPost } from '@/actions/post.action';
import toast from 'react-hot-toast';
import { set } from 'date-fns';



function CreatePost() {
    const {user}=useUser()
    const[content, setContent]=useState("");
    const[imageUrl, setImageUrl]=useState("");
    const[isPosting, setIsPosting]=useState(false);
    const[showImageUpload,setShowImageUpload]=useState(false);
  
  const handleSubmit=async()=>{
  if(!content.trim() && !imageUrl) return;
    setIsPosting(true);
    try{ 

       const result= await createPost(content,imageUrl)
       if(result?.success){
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);
        toast.success("Post created successfully")
       }


    }
    catch(error){
        console.log("Error creating post:", error);
        toast.error("Failed to create post")
    }
    finally {
        setIsPosting(false);}







  }
    return (
        <Card className='mb-6'>
            <CardContent className='pt-2'>
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <Avatar>
                            <AvatarImage src={user?.imageUrl ||  "/avatar.png"}  />
                        </Avatar>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind?"
                            className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-3 text-base "
                            disabled={isPosting}
                        />
                    </div>
                    {(showImageUpload || imageUrl) && (
                      <div className="border rounded-lg p-4">
                        <ImageUpload
                          endpoint="postImage"
                          onChange={(url)=> {setImageUrl(url)
                            if (!url) setShowImageUpload(false) }
                          }
                          value={imageUrl} />

                      </div>

                      
                    )}
            

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
                     




                   </div>
            </CardContent>
           
        </Card>
  )
}

export default CreatePost
