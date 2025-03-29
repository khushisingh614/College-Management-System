const connectToMongo = require("./Database/db");
const express = require("express");
const http = require("http");
const cors = require("cors");


const app = express();
const server = http.createServer(app);

const path = require("path")
connectToMongo();
const port = 5001 || process.env.PORT;


app.use(cors({
  origin: process.env.FRONTEND_API_LINK
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json()); //to convert request data to json

app.get("/", (req, res) => {
  res.send("Hello 👋 I am Working Fine 🚀")
});




app.use('/media', express.static(path.join(__dirname, 'media')));
app.use("/media", express.static(path.join(__dirname, "middlewares/media")));

// Credential Apis
app.use("/api/student/auth", require("./routes/Student Api/credential.route"));
app.use("/api/faculty/auth", require("./routes/Faculty Api/credential.route"));
app.use("/api/admin/auth", require("./routes/Admin Api/credential.route"));
// Details Apis
app.use("/api/student/details", require("./routes/Student Api/details.route"));
app.use("/api/faculty/details", require("./routes/Faculty Api/details.route"));
app.use("/api/admin/details", require("./routes/Admin Api/details.route"));
// Other Apis
app.use("/api/timetable", require("./routes/Other Api/timetable.route"));
app.use("/api/material", require("./routes/Other Api/material.route"));

app.use("/api/assignments", require("./routes/Other Api/assignment.route"));
// app.use("/api/evaluation", require("./routes/Other Api/evaluation.route"));

app.use("/api/notice", require("./routes/Other Api/notice.route"));
app.use("/api/subject", require("./routes/Other Api/subject.route"));
app.use("/api/marks", require("./routes/Other Api/marks.route"));
app.use("/api/branch", require("./routes/Other Api/branch.route"));
app.use("/api/attendance", require("./routes/Other Api/attendence.route"));
app.use("/api/curriculum", require("./routes/Other Api/curriculum.route"));
app.use("/api/notify-security" , require("./routes/Other Api/notifysecurity.route"));
// Feedback Apis for admin
app.use("/api/admin/feedback", require("./routes/Other Api/feedback.route"));

// Feedback Apis for student
app.use("/api/student/feedback", require("./routes/Other Api/feedback.route"));


app.listen(port, () => {
  console.log(`Server Listening On http://localhost:${port}`);
});