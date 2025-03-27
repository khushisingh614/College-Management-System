
import AdminFeedbackForm from "./Feedback/AdminFeedbackForm";
import AdminFeedbackList from "./Feedback/AdminFeedbackList";

const AdminDashboard = ({ adminId }) => {
    return (
        <div>
            <h1>Admin Panel</h1>
            {/* <AdminFeedbackForm adminId={adminId} />
            <AdminFeedbackList adminId={adminId} /> */}
        </div>
    );
};

export default AdminDashboard;
