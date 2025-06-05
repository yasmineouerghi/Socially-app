"use client"
import React, { useState } from 'react'
import { Button } from './ui/button';
import { Loader2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import { toggleFollowUser } from '@/actions/user.action';


function FollowButton({userId}:{userId: string}) {
  const [isLoading, setIsLoading] = useState(false);
const handleFollow = async () => {
  setIsLoading(true);
  try{
    await toggleFollowUser(userId);
    toast.success("Followed user successfully!");

  }catch(error){
    toast.error("Error following user:");

  }
  finally{
setIsLoading(false);
  }
   }

  return (
<Button  
size={"sm"}
variant={"secondary"}
onClick={handleFollow} 
disabled={isLoading} 
className='w-20'>
  {isLoading ? <Loader2Icon className='w-4 h-4 animate-spin'/> : "Follow"}

</Button>
  )
}

export default FollowButton
