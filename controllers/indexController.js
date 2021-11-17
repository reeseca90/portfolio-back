
exports.resume = (req, res) => {
  const file = `${__dirname}/ReeseResume.pdf`;
  res.download(file);
}

/* 
const fs = require('fs');

exports.resume = (req, res) => {
  const rs = fs.createReadStream('./public/ReeseResume.docx');
  res.setHeader('Content-Disposition', 'attachment; filename=ReeseResume.docx')
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

  rs.pipe(res);
} */