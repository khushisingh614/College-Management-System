
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminFeedbackList = ({ adminId }) => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5001/api/feedback/all/${adminId}`)
            .then(response => setFeedbacks(response.data))
            .catch(error => console.log(error));
    }, [adminId]);

    return (
        <div>
            <h2>All Feedbacks</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Semester</th>
                        <th>Ratings</th>
                        <th>Comments</th>
                    </tr>
                </thead>
                <tbody>
                    {feedbacks.map((feedback, index) => (
                        <tr key={index}>
                            <td>{feedback.semester}</td>
                            <td>{feedback.feedbackData.length > 0 ? feedback.feedbackData[0].ratings : "N/A"}</td>
                            <td>{feedback.feedbackData.length > 0 ? feedback.feedbackData[0].comments : "No comments"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminFeedbackList;
