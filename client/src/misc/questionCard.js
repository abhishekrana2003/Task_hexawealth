import { IoSend } from "react-icons/io5";
import CommentCard from "./commentCard";
import { useEffect, useState } from "react";
import axios from "axios";
export default function QuestionCard({
questionData
}){
    const [viewComments,setViewComments] = useState(false);
    const [question,setQuestion] = useState('');
    const [tag,setTag] = useState('');
    const [email,setEmail] = useState('');
    const [commentData,setCommentData] = useState([]);
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    useEffect(()=>{
        if(questionData)
        {
            setQuestion(questionData.question);
            setTag(questionData.tag);
            setEmail(questionData.email);
        }
    },[questionData])
    const handleViewComment = ()=>{
        fetchComments();
        setViewComments(prev=>!prev);
    }
    const fetchComments = async()=>{

        try {
            const jwtToken = document.cookie
                .split('; ')
                .find((row) => row.startsWith('authToken='))
                ?.split('=')[1];

            if (!jwtToken) {
                alert('User is not authenticated');
                return;
            }
            const questionID = questionData._id;
            console.log(questionID)
            const response = await axios.get(`${BACKEND_URL}/comments/getComments`, {
                params: { questionID}, 
                headers:{
                    Authorization: `Bearer ${jwtToken}`, 
                }
            });
            console.log(response.data);
            setCommentData(response.data);
        } catch (e) {
            console.error(e);
        }
    }
    const handlePost = async (e)=>{
        e.preventDefault();
        const formData = new FormData(e.target);
        const commentData = formData.get('comment');

        try{
            const jwtToken = document.cookie
                .split('; ')
                .find((row) => row.startsWith('authToken='))
                ?.split('=')[1];

            if (!jwtToken) {
                alert('User is not authenticated');
                return;
            }
            const requestBody = {
                comment : commentData,
                questionID: questionData._id
            }
            const res = await axios.post(`${BACKEND_URL}/comments/addComment`,requestBody,
                {headers: {
                    Authorization: `Bearer ${jwtToken}`, 
                }}
            )
            
            fetchComments();
        }
        catch(e)
        {
            console.log(e);
        }

    }
    return (
        <div className="w-[400px] flex flex-col gap-4">
        <div className="rounded flex flex-col gap-2 bg-green-500 shadow-md">
            <div className="px-4 pt-2 flex flex-col gap-1 pb-0">
                <div className="text-xs text-white underline">
                    {email}
                </div>
                <div className="text-xl text-white font-semibold">
                    {question}
                </div>
                <div className="text-sm">
                #{tag}
                </div>
            </div>
            <div className="flex outlin text-sm">
                <div onClick={handleViewComment} className="w-full p-2 flex items-center justify-center hover:bg-green-600 transition-all cursor-pointer">
                    View Comments
                </div>
            </div>
        </div>

        
{   viewComments &&   <div className="bg-gray-200 max-h-[300px] overflow-scroll rounded-md flex flex-col">
                {commentData.map((data,idx)=>{
                    return <CommentCard key={idx} commentData = {data}/>
                })}
        </div>}
{   viewComments    && 
        <div className="">
            <form onSubmit={handlePost} className="flex gap-2">
                <input name="comment" required placeholder="comment" className="w-full placeholder:italic outline-none border border-black rounded-s-3xl py-2 px-4" type="text"/>
                <button className="bg-green-500 text-white p-3 flex justify-center items-center text-xl rounded-full" type="submit"><IoSend/></button>
            </form>
        </div>}
        </div>
    )
}