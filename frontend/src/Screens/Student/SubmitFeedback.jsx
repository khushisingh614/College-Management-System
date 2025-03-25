
import React, { useState } from "react";
import axios from "axios";

const SubmitFeedback = ({ studentId }) => {
    const [feedbackId, setFeedbackId] = useState("");
    const [ratings, setRatings] = useState("");
    const [comments, setComments] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5001/api/feedback/submit", {
                feedbackId,
                studentId,
                ratings,
                comments
            });
            alert("Feedback Submitted Successfully!");
        } catch (error) {
            alert("Error Submitting Feedback");
        }
    };

    return (
        <div>
            <h2>Submit Feedback</h2>
            <form onSubmit={handleSubmit}>
                <label>Feedback ID:</label>
                <input type="text" value={feedbackId} onChange={(e) => setFeedbackId(e.target.value)} required />

                <label>Ratings (1-5):</label>
                <input type="number" value={ratings} min="1" max="5" onChange={(e) => setRatings(e.target.value)} required />

                <label>Comments:</label>
                <textarea value={comments} onChange={(e) => setComments(e.target.value)}></textarea>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SubmitFeedback;
