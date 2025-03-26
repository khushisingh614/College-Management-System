// import React, { useState } from "react";
// import axios from "axios";

// const SubmitFeedback = ({ studentId }) => {
//     const [feedbackId, setFeedbackId] = useState("");
//     const [ratings, setRatings] = useState("");
//     const [comments, setComments] = useState("");
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             await axios.post("http://localhost:5001/api/student/feedback/submit", {
//                 feedbackId,
//                 studentId,
//                 ratings,
//                 comments
//             });
//             alert("Feedback Submitted Successfully!");
//             setFeedbackId("");
//             setRatings("");
//             setComments("");
//         } catch (error) {
//             alert("Error Submitting Feedback");
//         }
//         setLoading(false);
//     };

//     return (
//         <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
//             <h2>Submit Feedback</h2>
//             <form onSubmit={handleSubmit}>
//                 <label>Feedback ID:</label>
//                 <input type="text" value={feedbackId} onChange={(e) => setFeedbackId(e.target.value)} required />

//                 <label>Ratings (1-5):</label>
//                 <input type="number" value={ratings} min="1" max="5" onChange={(e) => setRatings(e.target.value)} required />

//                 <label>Comments:</label>
//                 <textarea value={comments} onChange={(e) => setComments(e.target.value)}></textarea>

//                 <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
//             </form>
//         </div>
//     );
// };

// export default SubmitFeedback;
//..
import React, { useState } from "react";
import axios from "axios";

const SubmitFeedback = ({ studentId }) => {
    const [feedbackId, setFeedbackId] = useState("");
    const [ratings, setRatings] = useState("");
    const [comments, setComments] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Sending ratings and comments inside responses array
            const requestData = {
                feedbackId,
                studentId,
                responses: [
                    {
                        ratings: parseInt(ratings, 10), // Ensure it's a number
                        comments: comments || "", // Default to empty string
                    }
                ]
            };

            await axios.post("http://localhost:5001/api/student/feedback/submit", requestData);

            alert("Feedback Submitted Successfully!");
            setFeedbackId("");
            setRatings("");
            setComments("");
        } catch (error) {
            alert(error.response?.data?.message || "Error Submitting Feedback");
        }

        setLoading(false);
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h2>Submit Feedback</h2>
            <form onSubmit={handleSubmit}>
                <label>Feedback ID:</label>
                <input type="text" value={feedbackId} onChange={(e) => setFeedbackId(e.target.value)} required />

                <label>Ratings (1-5):</label>
                <input type="number" value={ratings} min="1" max="5" onChange={(e) => setRatings(e.target.value)} required />

                <label>Comments:</label>
                <textarea value={comments} onChange={(e) => setComments(e.target.value)}></textarea>

                <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
            </form>
        </div>
    );
};

export default SubmitFeedback;
