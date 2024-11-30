import QuestionCard from "../../misc/questionCard"
import axios from "axios"
import { useState } from "react";
export default function ApprovalCard({
    postData
})
{   
    const [isApproved,setApproved] = useState(false);
    const [isChecked,setChecked] = useState(false);
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const handleApprove = async()=>{
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
                postId:postData._id
            }
            const res = await axios.post(`${BACKEND_URL}/admin/approve`,requestBody,
                {headers: {
                    Authorization: `Bearer ${jwtToken}`, 
                }}
            )
            console.log(res.data);
            setApproved(true);
            setChecked(true);
        }
        catch(e)
        {
            console.log(e);
        }
    }
    const handleReject = async()=>{
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
                postId:postData._id
            }
            const res = await axios.post(`${BACKEND_URL}/admin/reject`,requestBody,
                {headers: {
                    Authorization: `Bearer ${jwtToken}`, 
                }}
            )
            console.log(res.data);
            setChecked(true);
            setApproved(false);
        }
        catch(e)
        {
            console.log(e);
        }
    }
    return (
        <div className="flex flex-col gap-4">
            <QuestionCard questionData={postData}/>
            <div className="overflow-clip flex shadow rounded-md ">
                {
                    isChecked?isApproved?<div className="w-full p-2 text-center bg-green-500 text-white">
                    Approved
                </div>:
                <div className="w-full p-2 text-center bg-red-500 text-white">
                    Rejected
                </div>:
                <>
                <div onClick={handleApprove} className="
                transition-all
                cursor-pointer
                hover:bg-green-500 hover:text-white
                text-green-500 p-2 w-1/2 text-center">
                    Approve
                </div>
                <div onClick={handleReject} className="
                    transition-all
                    cursor-pointer
                hover:bg-red-500 hover:text-white
                text-red-500 p-2 w-1/2  text-center">
                    Reject
                </div>
                </>

                }
                
                
                

            </div>
        </div>
    )
}