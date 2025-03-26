import React, { useState } from "react";
import axios from "axios";

const AdminFeedbackForm = ({ adminId }) => {
    const [semester, setSemester] = useState("");
    const [questions, setQuestions] = useState([""]);
    const [professorId, setProfessorId] = useState("");
    const [subject, setSubject] = useState("");
    const [loading, setLoading] = useState(false);

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => setQuestions([...questions, ""]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
             var adminId = "67dd1573639d32eae5712ca0";
            await axios.post("http://localhost:5001/api/admin/feedback/create", 
                { adminId, semester, questions, professorId, subject });
            alert("Feedback Form Created Successfully!");
            setSemester("");
            setQuestions([""]);
            setProfessorId("");
            setSubject("");
        } catch (error) {
            console.log(error);
            alert("Error Creating Feedback Form");
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h2>Create Feedback Form</h2>
            <form onSubmit={handleSubmit}>
                <label>Semester:</label>
                <input type="number" value={semester} onChange={(e) => setSemester(e.target.value)} required />

                <label>Professor ID:</label>
                <input type="text" value={professorId} onChange={(e) => setProfessorId(e.target.value)} required />

                <label>Subject:</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />

                {questions.map((q, index) => (
                    <div key={index}>
                        <label>Question {index + 1}:</label>
                        <input type="text" value={q} onChange={(e) => handleQuestionChange(index, e.target.value)} required />
                    </div>
                ))}

                <button type="button" onClick={addQuestion} disabled={loading}>Add Question</button>
                <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Create Form"}</button>
            </form>
        </div>
    );
};

export default AdminFeedbackForm;