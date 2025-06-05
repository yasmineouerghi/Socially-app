import { getProfileByUsername, getUserPosts, updateProfile } from '@/actions/profile.action';
import { toggleFollowUser } from '@/actions/user.action';
import { useUser } from '@clerk/nextjs';
import { format } from 'date-fns';
import React, { useState } from 'react'
import toast from 'react-hot-toast';


type User = Awaited <ReturnType<typeof getProfileByUsername>>;
type Posts = Awaited <ReturnType<typeof getUserPosts>>;



interface ProfilePageClientProps {
    user: NonNullable <User>;
    posts: Posts;
    likedPosts: Posts;
    isFollowing: boolean;
}

function ProfilePageClient({isFollowing:initialIsFollowing,likedPosts,posts,user}:ProfilePageClientProps) {
  const {user: currentUser}= useUser();
  const[showEditDialog,setShowEditDialog]=useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isUpdatingFollowing, setIsUpdatingFollowing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
  });

  const handleEditSubmit =async() =>{
    const formData=new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const result= await updateProfile(formData);
    if (result.success) {
      setShowEditDialog(false);
      toast.success("Profile updated successfully");
    } else {
     toast.error(result.error || "Failed to update profile");
    }

  };

  const handleFollow = async () => {
    if (!currentUser) return;
    try{
        setIsUpdatingFollowing(true);
        await toggleFollowUser(user.id);
        setIsFollowing(!isFollowing);
    }catch(error) {
        toast.error("Error toggling follow status");

    }

    return (
    <div>
      
    </div>
  )
};

const isOwnProfile=
currentUser?.username === user.username || currentUser?.emailAddresses[0].emailAddress.split("@")[0] === user.username;

const formatDate=format(new Date(user.createdAt), "MMMM  yyyy");

return(
    <div>
    ProfilePageClient 
    </div>
);


}
export default ProfilePageClient



