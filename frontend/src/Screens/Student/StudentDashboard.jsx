
import SubmitFeedback from "./SubmitFeedback";

const StudentDashboard = ({ studentId }) => {
    return (
        <div>
            <h1>Student Panel</h1>
            <SubmitFeedback studentId={studentId} />
        </div>
    );
};

export default StudentDashboard;
