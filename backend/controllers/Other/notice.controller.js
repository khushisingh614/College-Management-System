const Notice = require("../../models/Other/notice.model");

const getNotice = async (req, res) => {
    try {
        let notice = await Notice.find(req.body);
        if (notice) {
            res.json({ success: true, message: "Notice Get Successfully", notice });
        } else {
            res.status(404).json({ success: false, message: "No Notice Available!" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getNoticeforfaculty = async (req, res) => {
    console.log(req.body);
    try {
        const {forwhom , branch} = req.body.data;
        let notice = await Notice.find({
            branch,
            forwhom: { $in: forwhom }
        });
        if (notice  && notice.length > 0) {
            res.json({ success: true, message: "Notice Get Successfully", notice });
        } else {
            res.status(404).json({ success: false, message: "No Notice Available!" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getNoticebybranchandsem = async (req, res) => {
    try {
        const { branch, semester, forwhom } = req.body.data;
        let notice = await Notice.find({
            branch: { $in: branch },
            semester: { $in: semester },
            forwhom: { $in: forwhom }
        });
        if (notice  && notice.length > 0) {
            res.json({ success: true, message: "Notice Get Successfully", notice });
        } else {
            res.status(404).json({ success: false, message: "No Notice Available!" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const addNotice = async (req, res) => {
    let { description, title, forwhom, branch, semester } = req.body;
    try {
        let notice = await Notice.findOne({ description, title, forwhom, branch, semester });
        if (notice) {
            return res
                .status(400)
                .json({ success: false, message: "Notice Already Exists!" });
        }
        if(req.file){
            await Notice.create({
                link:req.file.filename,
                description,
                title,
                forwhom,
                branch,
                semester,
            });    
        }else{
            await Notice.create({
                description,
                title,
                forwhom,
                branch,
                semester,
            });
        }
        
        const data = {
            success: true,
            message: "Notice Added Successfully",
        };
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const updateNotice = async (req, res) => {
    let { link, description, title, forwhom, branch, semester } = req.body;
    try {
        let notice = await Notice.findByIdAndUpdate(req.params.id, {
            link,
            description,
            title,
            forwhom,
            branch,
            semester,
        });
        if (!notice) {
            return res
                .status(400)
                .json({ success: false, message: "No Notice Available!" });
        }
        res.json({
            success: true,
            message: "Notice Updated Successfully",
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteNotice = async (req, res) => {
    try {
        let notice = await Notice.findByIdAndDelete(req.params.id);
        if (!notice) {
            return res
                .status(400)
                .json({ success: false, message: "No Notice Available!" });
        }
        res.json({
            success: true,
            message: "Notice Deleted Successfully",
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = { getNotice,getNoticeforfaculty , getNoticebybranchandsem, addNotice, updateNotice, deleteNotice }