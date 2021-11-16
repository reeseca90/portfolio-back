
exports.resume = (req, res) => {
  res.download('./public/ReeseResume.pdf');
}

/* 
const fs = require('fs');

exports.resume = (req, res) => {
  const rs = fs.createReadStream('./public/ReeseResume.docx');
  res.setHeader('Content-Disposition', 'attachment; filename=ReeseResume.docx')
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

  rs.pipe(res);
} */