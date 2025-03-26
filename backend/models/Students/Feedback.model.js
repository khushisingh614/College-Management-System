const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin Detail', required: true },
    questions: [{ type: String, required: true }],
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty Detail', required: true }, //yha pr professor ka object id jo mongo m hota hai userka diya hua nhi to frnted m professor ka list fetch krna hoga aur ui p name show hoga aur jb request jaye wha se to wo object id pass kiya jayega ._id wla...bss
    semester: { type: Number, required: true },
    subject: { type: String, required: true },
    feedbackData: [
        {
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student Detail', required: true },
            responses: [
                { ratings: { type: Number, min: 1, max: 5, required: true } }, // Rating 1-5
                { comments: { type: String, default: "" }, },
                { createdAt: { type: Date, default: Date.now } }
            ]
        }
    ],
}, { timestamps: true });
const Feedback = mongoose.model('Feedback Detail', feedbackSchema);
module.exports = Feedback;