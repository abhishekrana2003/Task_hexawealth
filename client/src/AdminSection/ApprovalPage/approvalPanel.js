import { useEffect,useState } from "react"
import QuestionCard from "../../misc/questionCard";
import ApprovalCard from "./approvalCard";
import axios from "axios";
export default function ApprovalPanel(){

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const [postData,setPostData] = useState([]);
    const [haveAccess,setAccess] = useState(true);
    useEffect(()=>{


        // get all unapproved requests
        fetchData();
    },[])

    const fetchData =   async ()=>{
        try{
            const jwtToken = document.cookie
            .split('; ')
            .find((row) => row.startsWith('authToken='))
            ?.split('=')[1];
    
            if (!jwtToken) {
                alert('User is not authenticated');
                return;
            }
            const res = await axios.get(`${BACKEND_URL}/admin/pending`,
                {headers: {
                    Authorization: `Bearer ${jwtToken}`, 
                }}
            );
            console.log(res.data);
            setAccess(true);
            setPostData(res.data.pendingPosts);
        }
        catch(e)
        {
            console.log(e);
            if(e.response.status===403)
            {
                setAccess(false);
            }
        }
    }
    return (
        <div className="h-screen w-screen flex flex-col">
            <div className="font-bold text-center text-2xl p-2">
                Admin Panel
            </div>
            <div className="p-2 h-full overflow-scroll flex flex-col gap-4 items-center">
                {postData.map((data,idx)=>{
                    return <ApprovalCard key={idx} postData = {data}/>
                })}
                {
                    !haveAccess && <div>
                        Unauthorised User, only Admins have access.
                        </div>
                }
            </div>
        </div>
    )
}