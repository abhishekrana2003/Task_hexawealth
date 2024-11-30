import axios from "axios";
export default function PostQuestion({
    setVis
}){

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const formData = new FormData(e.target);
        const questionData = formData.get('question');
        const tagData = formData.get('tag');
        

        // logic of posting question for review
        try {
            // Get JWT token from cookies
            const jwtToken = document.cookie
                .split('; ')
                .find((row) => row.startsWith('authToken='))
                ?.split('=')[1];

            if (!jwtToken) {
                alert('User is not authenticated');
                return;
            }

            const requestBody = {
                question: questionData,
                tag: tagData,
            };

            const response = await axios.post(`${BACKEND_URL}/questions/create`,requestBody,
                {headers: {
                    Authorization: `Bearer ${jwtToken}`, // Pass the token in the Authorization header
                }});

            console.log(response);
            setVis();
        } catch (error) {
            console.error('Error posting question:', error);
            alert('An error occurred. Please try again later.');
        }

    }
    const handleClose = ()=>{
        setVis();
    }
    return(
        <div className="shadow-md bg-white p-4 rounded w-[80%] md:w-[500px] ">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="font-bold">
                        Ask Question
                    </label>
                    <textarea required name="question" className="p-2 px-3 outline-none rounded bg-gray-100"/>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-bold">
                        Tag
                    </label>
                    <div className="outlin flex items-center ">
                        <div className="pl-3 py-2 bg-gray-100 rounded-s">
                            #
                        </div>
                        <input required name="tag" type="text" className="p-2  w-full bg-gray-100 rounded-e outline-none"/>
                    </div>
                </div>
                <div className="gap-4 flex justify-end">
                    <button className="transition-all border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-3 py-1 rounded" type="submit">Post</button>
                    <button onClick={handleClose} className="transition-all border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded" >Cancel</button>

                </div>
            </form>
        </div>
    )
}