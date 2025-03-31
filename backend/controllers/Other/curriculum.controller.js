const Curriculum = require("../../models/Other/curriculum.model");

const getCurriculum = async (req, res) => {
    try {
        let curriculum = await Curriculum.find(req.body);
        if (!curriculum) {
            return res
                .status(400)
                .json({ success: false, message: "No Curriculum Available!" });
        }
        res.json({ success: true, message: "Curriculum Found!", curriculum });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const addCurriculum = async (req, res) => {
    let { faculty, subject } = req.body;
    try {
        console.log(req.body);
        await Curriculum.create({
            faculty,
            subject,
            link: req.file.filename,
        });
        const data = {
            success: true,
            message: "Curriculum Added!",
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const updateCurriculum = async (req, res) => {
    let { faculty, subject, link } = req.body;
    try {
        let curriculum = await Curriculum.findByIdAndUpdate(req.params.id, {
            faculty,
            subject,
            link,
        });
        if (!curriculum) {
            return res
                .status(400)
                .json({ success: false, message: "No Curriculum Available!" });
        }
        res.json({
            success: true,
            message: "Curriculum Updated!",
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteCurriculum = async (req, res) => {
    try {
        let curriculum = await Curriculum.findByIdAndDelete(req.params.id);
        if (!curriculum) {
            return res
                .status(400)
                .json({ success: false, error: "No Curriculum Available!" });
        }
        res.json({
            success: true,
            message: "Curriculum Deleted!",
            curriculum,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { getCurriculum, addCurriculum, updateCurriculum, deleteCurriculum };