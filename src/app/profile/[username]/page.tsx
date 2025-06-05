import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from '@/actions/profile.action'
import ProfilePageClient from '@/components/ProfilePageClient';
import { get } from 'http'
import { notFound } from 'next/navigation';
import { title } from 'process';
import React from 'react'

export async function generateMetadata({params}:{ params: { username: string } }) {
 const user=await getProfileByUsername(params.username)
 if(!user) return;
 return{
  title: `${user.name ?? user.username}`,
  description: user.bio || `check out ${user.username}'s profile`,

 };
}

 async function ProfilePage({params}:{ params: { username: string } }) {
   
 const user = await getProfileByUsername(params.username);
  if (!user) notFound();

  const [posts,likedPosts, isCurrentUserFollowing] = await Promise.all([getUserPosts(user.id), getUserLikedPosts(user.id), isFollowing(user.id)]);
 
    return (
    <ProfilePageClient
    user={user}
    posts={posts}
    likedPosts={likedPosts}
    isFollowing={isCurrentUserFollowing}
     />
  )
}

export default ProfilePage