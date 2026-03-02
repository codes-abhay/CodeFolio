const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');
const User = require('../../models/User');

// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('avatar');

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// @route    POST api/upload
// @desc     Upload user avatar
// @access   Private
router.post('/', auth, (req, res) => {
    console.log('Upload route hit');
    upload(req, res, async (err) => {
        console.log('Multer processing done', err, req.file);
        if (err) {
            // Handle Multer errors (e.g. File too large)
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ msg: err.message });
            }
            // Handle custom errors (e.g. 'Error: Images Only!')
            if (err) {
                return res.status(400).json({ msg: err.message || err });
            }
        } else {
            if (req.file == undefined) {
                return res.status(400).json({ msg: 'No file selected' });
            } else {
                try {
                    // Update user avatar in DB
                    const user = await User.findById(req.user.id);
                    user.avatar = `/uploads/${req.file.filename}`;
                    await user.save();

                    // PROPAGATION: Update avatar in all of user's posts
                    const Post = require('../../models/Post');

                    // 1. Update posts authored by user
                    await Post.updateMany(
                        { user: req.user.id },
                        { avatar: user.avatar }
                    );

                    // 2. Update comments made by user
                    await Post.updateMany(
                        { 'comments.user': req.user.id },
                        {
                            $set: { 'comments.$[elem].avatar': user.avatar }
                        },
                        {
                            arrayFilters: [{ 'elem.user': req.user.id }]
                        }
                    );

                    res.json({
                        fileName: req.file.filename,
                        filePath: `/uploads/${req.file.filename}`,
                        user: user
                    });
                } catch (err) {
                    console.error(err.message);
                    res.status(500).send('Server Error');
                }
            }
        }
    });
});

module.exports = router;
