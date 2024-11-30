import { FaUser } from "react-icons/fa";
export default function CommentCard({
    commentData
}){
    return (
        <div className="px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-300 transition-all">
            <div className="rounded-full text-2xl">
                <FaUser/>
            </div>
            <div className="flex flex-col gap-1">
                <div className="text-xs font-bold ">
                    {commentData.email}
                </div>
                <div className="text-xs">
                    {commentData.comment}
                </div>
        </div>
        </div>
    )
}