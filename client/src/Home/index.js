import { useEffect, useState } from "react";
import PostQuestion from "../misc/postQuestion"
import QuestionCard from "../misc/questionCard"
import { FaHome } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import axios from "axios";
import {useNavigate} from 'react-router'
export default function Home(){
    const [home,setHome] = useState(true);
    const [feedData,setFeedData] = useState([]);
    const [postQuestionVis,setPostQuestionVis] = useState(false);
    const navigate = useNavigate();
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const handleHome = ()=>{
        setHome(true);
        setFeedData([]);
        fetchPubliceData();
    }
    const handlePending = ()=>{
        setHome(false);
        fetchPrivateData();
    }
    const handlePostQuestion = ()=>{
        setPostQuestionVis(prev=>!prev);
    }
    useEffect(()=>{
        fetchPubliceData();
        setHome(true);
    },[])
    const fetchPrivateData = async ()=>{
        try{
            const jwtToken = document.cookie
                .split('; ')
                .find((row) => row.startsWith('authToken='))
                ?.split('=')[1];

            if (!jwtToken) {
                alert('User is not authenticated');
                return;
            }
            const data = await axios.get(`${BACKEND_URL}/questions/user`,
                {headers: {
                    Authorization: `Bearer ${jwtToken}`, // Pass the token in the Authorization header
                }}
            );
            setFeedData(data.data);
        }
        catch(e){
            console.log(e);
        }
    }
    const fetchPubliceData = async ()=>{
        try{
            const jwtToken = document.cookie
                .split('; ')
                .find((row) => row.startsWith('authToken='))
                ?.split('=')[1];

            if (!jwtToken) {
                alert('User is not authenticated');
                return;
            }
            const data = await axios.get(`${BACKEND_URL}/questions/approved`,
                {headers: {
                    Authorization: `Bearer ${jwtToken}`, // Pass the token in the Authorization header
                }}
            );
            setFeedData(data.data);
        }
        catch(e){
            console.log(e);
        }
    }
    const handleLogOut = ()=>{
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate('/login');
    }
    return (
        <div className="px-2 flex flex-col   h-screen w-screen">
            <div className="outlin bg-white w-full text-2xl flex justify-center items-center">
                <div
                style={{color:home?'black':'#6b7280'}}
                onClick={handleHome} className="outlin p-2 px-4 cursor-pointer hover:bg-gray-100">
                    <FaHome/>
                </div>
                <div
                style={{color:!home?'black':'#6b7280'}}
                onClick={handlePending} className="outlin text-gray-500 p-2 px-4 cursor-pointer hover:bg-gray-100">
                    <MdOutlinePendingActions />
                </div>
                <div onClick={handleLogOut} className="hover:text-white hover:bg-red-500  transition-all cursor-pointer rounded text-red-500  text-sm  border border-red-500 p-1 px-2 absolute right-5">
                    Log Out
                </div>
            </div>
            <div className="rounded flex overflow-scroll flex-col relative h-full  bg-gray-100 shadow-inner ">
                <div className="py-6 outline h-full overflow-scroll flex flex-col items-center gap-4">
                    
                    {
                        feedData.length===0?
                        <div className="text-sm">
                            No Questions here
                        </div>:
                        feedData.map((data,idx)=>{
                            return <QuestionCard key={idx} questionData={data}/>
                        })
                    }
                    
                </div>

                <div onClick={handlePostQuestion} className="transition-all text-4xl rounded-full p-2 text-white bg-green-500 cursor-pointer hover:bg-green-600 absolute bottom-5 right-5">
                    <IoAdd/>
                </div>
{       postQuestionVis &&   <div className="absolute backdrop-blur bg-[#3434347d] h-full w-full flex justify-center items-center">
                    <PostQuestion setVis={handlePostQuestion}/>
                </div>}
            </div>
            
        </div>
    )
}