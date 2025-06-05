 "use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


 export async function syncUser() {
    try{
        const{userId} = await auth();
        const user= await currentUser();
        if(!userId || !user) return null;
        //check if user exists 
        const existingUser= await prisma.user.findUnique({
            where:{
                clerkId: userId,
            },
        });
        if(existingUser) return existingUser;

        const dbUser= await prisma.user.create({
             data:{
                clerkId: userId,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                image: user.imageUrl,
                email: user.emailAddresses[0].emailAddress


            }
        })
        return dbUser;
    } catch(error){
        console.error("Error syncing user:", error);
    }





 }

 export async function getUserByClerkId( clerkId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                clerkId,
            },
            include:{
                _count:{
                    select:{
                     followers: true,
                    following: true,
                    posts: true,
                    },
                }
            }
        });
        return user;
    } catch (error) {
        console.error("Error fetching user by Clerk ID:", error);
        return null;
    }

 }

 export async function getDbUserId(){

    const {userId:clerkId}= await auth();
    if(!clerkId) return null;

    const user= await getUserByClerkId(clerkId);
    if(!user) throw new Error("User not found");
    return user.id; 



 }

 export async function getRandomUsers() {
    try {
      const userId = await getDbUserId();
  
      if (!userId) return [];
  
      // get 3 random users exclude ourselves & users that we already follow
      const randomUsers = await prisma.user.findMany({
        where: {
          AND: [
            { NOT: { id: userId } },
            {
              NOT: {
                followers: {
                  some: {
                    followerId: userId,
                  },
                },
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          _count: {
            select: {
              followers: true,
            },
          },
        },
        take: 3,
      });
  
      return randomUsers;
    } catch (error) {
      console.log("Error fetching random users", error);
      return [];
    }
  }

  export async function toggleFollowUser(targetuserId: string) {
    try{ 
        const userId= await getDbUserId();
        if (!userId) return;
        if(userId === targetuserId) throw new Error("You cannot follow yourself");
        const existiongFollow= await prisma.follows.findUnique({
            where:{
                followerId_followingId:{
                    followerId:userId,
                    followingId:targetuserId
                }


            }

        })
        if(existiongFollow){
                 //unfollow
            await prisma.follows.delete({
                where:{
                    followerId_followingId:{
                        followerId:userId,
                        followingId: targetuserId
                    }
                }
            })
       
        }
        else{
            //follow
            await prisma.$transaction(
                [
                    prisma.follows.create({
                        data:{
                            followerId: userId,
                            followingId: targetuserId
                        }
                    }),
                    prisma.notification.create({
                        data:{
                            userId: targetuserId,
                            type: "FOLLOW",
                            creatorId: userId,
                        
                        }
                    })                    
                ]
            )
                }
                revalidatePath("/");
                return ({success: true});
            
        
 

    }catch(error){

        console.log("Error toggling follow user:", error);
        return ({success: false, error: "error toggling follow user"});
    }

  }