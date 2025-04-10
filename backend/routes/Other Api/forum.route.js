const express = require("express");
const router = express.Router();
const {
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
} = require("../../controllers/Other/forum.controller");

router.post("/initialize-forums", initializeForums);
router.get("/general-forums/:enrollmentNo", getGeneralForums);
router.get("/subject-forums/:enrollmentNo", getSubjectForums);
router.get("/fac/subject-forums/:facId", getProfForums);
router.post("/posts", createPost); // { forumId, forumType, authorId, authorModel, content }
router.get("/posts/getcomments/:postId", getComments);

router.get("/posts/:forumId", getForumPostsProf);
router.get("/posts/:forumId/:forumType", getForumPosts);

router.patch("/posts/fac/:postId/pin", togglePin);
router.post("/posts/:postId/comments", createComment);



module.exports = router;
