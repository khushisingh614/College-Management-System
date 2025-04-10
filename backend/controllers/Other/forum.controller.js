const ForumPost = require("../../models/Other/forumPost.model");
const SubjectForum = require("../../models/Other/subjectforum.model");
const BranchSemForum = require("../../models/Other/generalforum.model");
const ForumComment = require("../../models/Other/forumComment.model")

const StudentDetail = require("../../models/Students/details.model");
const FacultyDetail = require("../../models/Faculty/details.model")
const Subject = require("../../models/Other/subject.model");

const initializeForums = async (req, res) => {
  try {
    //console.log("hi")
    // 1. Create General Forums (branch + semester)
    const students = await StudentDetail.find({}, "branch semester");
    const uniqueCombinations = new Set(
      students.map(s => `${s.branch}-${s.semester}`)
    );
    //console.log(uniqueCombinations);

    for (let combo of uniqueCombinations) {
      const [branch, semester] = combo.split("-");
      const exists = await BranchSemForum.findOne({ branch, semester });
      if (!exists) {
        await BranchSemForum.create({
          branch,
          semester,
          title: `General Forum - ${branch} SEM ${semester}`,
          description: `Discussion forum for all students in ${branch} SEM ${semester}`,
        });
      }
    }

    // 2. Create Subject Forums
    const subjects = await Subject.find();
    for (let subject of subjects) {
      const exists = await SubjectForum.findOne({ subjectId: subject._id });
      if (!exists) {
        await SubjectForum.create({
          subjectId: subject._id,
          title: `${subject.name} (${subject.code})`,
          description: `Forum for subject: ${subject.name}`,
        });
      }
    }

    res.status(200).json({ message: "Forums initialized successfully." });
  } catch (err) {
    console.error("Error initializing forums:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};


const getGeneralForums = async (req, res) => {
  try {
    const { enrollmentNo } = req.params;
    const student = await StudentDetail.findOne({ enrollmentNo });

    if (!student) return res.status(404).json({ message: "Student not found" });

    const forums = await BranchSemForum.find({
      branch: student.branch,
      semester: student.semester
    });

    res.json(forums);
  } catch (err) {
    res.status(500).json({ message: "Error fetching general forums", err });
  }
};

const getSubjectForums = async (req, res) => {
  try {
    const { enrollmentNo } = req.params;
    const student = await StudentDetail.findOne({ enrollmentNo });

    if (!student) return res.status(404).json({ message: "Student not found" });

    // Find subjects matching student’s branch and semester
    const subjects = await Subject.find({
      offering_branch: student.branch,
      semester: student.semester
    });

    const subjectIds = subjects.map((s) => s._id);

    const forums = await SubjectForum.find({
      subjectId: { $in: subjectIds }
    }).populate("subjectId", "name code"); // optional: populate name/code

    res.json(forums);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subject forums", err });
  }
};

const getProfForums = async (req, res) => {
    const { facId } = req.params;
  
    try {
      // Step 1: Find faculty by employeeId
      const faculty = await FacultyDetail.findOne({ employeeId: facId });
      if (!faculty) return res.status(404).json({ message: "Faculty not found" });
        //console.log(faculty._id);
      // Step 2: Find all subjects taught by this faculty
      const subjects = await Subject.find({ professorId: faculty._id }).select("_id");
      //console.log(subjects);
      const subjectIds = subjects.map((sub) => sub._id);
  
      // Step 3: Find forums for those subjects
      const forums = await SubjectForum.find({ subjectId: { $in: subjectIds } });
  
      res.json(forums);
    } catch (err) {
      console.error("Error fetching subject forums for faculty:", err);
      res.status(500).json({ message: "Server error fetching forums" });
    }
  };

const createPost = async (req, res) => {
    const { forumId, forumType, authorId, authorModel, content } = req.body;
    
    try {
      let authorObjectId;
  
      if (authorModel === 'Student Detail') {
        const student = await StudentDetail.findOne({ enrollmentNo: Number(authorId) });
        if (!student) return res.status(404).json({ message: "Student not found" });
        authorObjectId = student._id;
      } else if (authorModel === 'Faculty Detail') {
        const faculty = await FacultyDetail.findOne({ employeeId: Number(authorId) });
        if (!faculty) return res.status(405).json({ message: "Faculty not found" });
        authorObjectId = faculty._id;
      } else {
        return res.status(400).json({ message: "Invalid author model" });
      }
  
      const newPost = new ForumPost({
        forumId,
        forumType,
        author: authorObjectId,
        authorModel,
        content,
      });
  
      await newPost.save();
  
      res.json({ message: "Post created successfully", post: newPost });
    } catch (err) {
      console.error("Error creating post:", err);
      res.status(500).json({ message: "Error creating post", err });
    }
  };

const getForumPosts = async (req, res) => {
  const { forumId, forumType } = req.params;
  try {
    const posts = await ForumPost.find({ forumId, forumType })
      .sort({ isPinned: -1, createdAt: -1 })
      .populate("author", "firstName lastName post");
      //console.log(posts);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts", err });
  }
};

const getForumPostsProf = async (req, res) => {
    const { forumId } = req.params;
    try {
      const posts = await ForumPost.find({ forumId, forumType: "SubjectForums" })
        .sort({isPinned: -1, createdAt: -1 })
        .populate("author", "firstName lastName post");
        console.log(posts);
      res.json(posts);
    } catch (err) {
      res.status(500).json({ message: "Error fetching posts", err });
    }
  };

const togglePin = async (req, res) => {
    try {
      const { postId } = req.params;
      const { isPinned } = req.body; // true/false toggle
        //console.log(postId,isPinned);
      const updatedPost = await ForumPost.findByIdAndUpdate(
        postId,
        { isPinned },
        { new: true }
      );
      //console.log(updatedPost);
      if (!updatedPost) return res.status(404).json({ message: "Post not found" });
  
      res.json(updatedPost);
    } catch (err) {
      res.status(500).json({ message: "Error pinning post", err });
    }
};

const createComment = async (req, res) => {
    const { postId, authorId, authorModel, content } = req.body;
    console.log(req.body)
    try {
      let authorObjectId;
  
      if (authorModel === 'Student Detail') {
        const student = await StudentDetail.findOne({ enrollmentNo: Number(authorId) });
        if (!student) return res.status(404).json({ message: "Student not found" });
        authorObjectId = student._id;
      } else if (authorModel === 'Faculty Detail') {
        const faculty = await FacultyDetail.findOne({ employeeId: Number(authorId) });
        if (!faculty) return res.status(405).json({ message: "Faculty not found" });
        authorObjectId = faculty._id;
      } else {
        return res.status(400).json({ message: "Invalid author model" });
      }
      const comment = new ForumComment({ postId, author: authorObjectId, authorModel, content });
      await comment.save();
      res.status(201).json({ message: "Comment added", comment });
    } catch (err) {
      res.status(500).json({ message: "Error adding comment", err });
    }
  };
  
  const getComments = async (req, res) => {
    //console.log("hi")
    const { postId } = req.params;
    
    try {
      const comments = await ForumComment.find({ postId })
        .sort({ createdAt: 1 })
        .populate('author', 'firstName lastName post');
        //console.log(comments);
      res.json(comments);
    } catch (err) {
      res.status(500).json({ message: "Error fetching comments", err });
    }
  };
  

module.exports = {
  initializeForums,
  getGeneralForums,
  getSubjectForums,
  getProfForums,
  createPost,
  getForumPosts,
  getForumPostsProf,
  togglePin,
  createComment,
  getComments
};
