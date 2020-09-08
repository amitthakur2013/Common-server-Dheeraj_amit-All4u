const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `./public/uploads`;
    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, (error) => cb(error, dir));
      }
      return cb(null, dir);
    });
  },

  filename: (req, file, cb) => {
    // console.log(file.fieldname, file.originalname);
    // console.log(
    //   "name: ",
    //   Date.now().toString() + path.extname(file.originalname)
    // );
    cb(null, Date.now().toString() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) return cb(null, true);

  cb("Error: Images Only!");
}
module.exports = upload;
