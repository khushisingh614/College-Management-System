const cron = require('node-cron');
const sendReminderMail = require('./deadline');

const FacultyAssignment = require('./models/Other/facultyAssignments.model');
const StudentAssignment = require('./models/Other/studentAssignments.model');
const Student = require('./models/Students/details.model');


const runAssignmentReminderJob = async () => {
    try {
      const now = new Date();
  
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
  
      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(tomorrow.getDate() + 1);
  
  
      const assignmentsDueTomorrow = await FacultyAssignment.find({
        deadline: { $gte: tomorrow, $lt: dayAfter },
      });
  
      if (assignmentsDueTomorrow.length === 0) {
        return;
      }
  
    
  
      for (const assignment of assignmentsDueTomorrow) {
        const { branch, semester, _id, title, deadline } = assignment;

  
        const students = await Student.find({ branch, semester });
  
        for (const student of students) {
          const alreadySubmitted = await StudentAssignment.findOne({
            assignmentId: _id,
            enrollmentNo: student.enrollmentNo,
          });
  
          if (alreadySubmitted) {
            continue;
          }
  
          await sendReminderMail(
            student.email,
            student.firstName,
            title,
            deadline
          );
        }
      }
  
      console.log("✅ Reminder job completed successfully.\n");
    } catch (err) {
      console.error("❌ Error in assignment reminder job:", err);
    }
  };
  
  // ⏰ Schedule for 3:20 AM daily
  cron.schedule('37 3 * * *', () => {
    console.log("⏰ CRON TRIGGERED: 3:37 AM");
    runAssignmentReminderJob();
  });
  
  // 🔄 Run immediately once for testing
  //runAssignmentReminderJob();
