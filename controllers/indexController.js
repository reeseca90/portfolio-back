const PDFdoc = require('pdfkit');
const fs = require('fs');

// route for downloading Resume
exports.resume = (req, res) => {
  const file = `${__dirname}/ReeseResume.pdf`;
  res.download(file);
}

exports.makePdf = async (req, res) => {
  const doc = await new PDFdoc({font: 'Times-Roman'});

  // save the PDF on the server to send later
  doc.pipe(fs.createWriteStream(__dirname + '/cv.pdf'));
    
  doc.font('Times-Bold').fontSize(28).text(req.body.postBody.name, { align: 'center' });
  doc.font('Times-BoldItalic').fontSize(22).text('Contact:');
  doc.font('Times-Roman').fontSize(12).text('Address: ' + req.body.postBody.address).text('Phone: ' + req.body.postBody.phone).text('Email: ' + req.body.postBody.email);
  doc.moveDown();
  doc.font('Times-BoldItalic').fontSize(22).text('About:');
  doc.font('Times-Roman').fontSize(12).text(req.body.postBody.summary)
  // if skills array not provided, don't try to map over it
  if (req.body.postBody.allSkills != null) {
    doc.list(
        await req.body.postBody.allSkills.map((skill) => { return skill.text }), 
      { columns: 3 }
    );
  }
  doc.moveDown();
  doc.font('Times-BoldItalic').fontSize(22).text('Employment History:');
  doc.font('Times-Roman').fontSize(12);
  // if workHist array not provided, don't try to map over it
  if (req.body.postBody.workHist != null) {
    await req.body.postBody.workHist.map((work) => { return doc.text(work.company).text(work.title).text(work.duty).moveDown(0.5); } );
  }
  doc.moveDown();
  doc.font('Times-BoldItalic').fontSize(22).text('Education:');
  doc.font('Times-Roman').fontSize(12);
  // if edu array not provided, don't try to map over it
  if (req.body.postBody.edu != null) {
    await req.body.postBody.edu.map((edu) => {
      return doc.text(edu.school + ', ' + edu.degree + ', ' + edu.years + ', ' + edu.gpa)
    });
  }

  doc.end();

  // sends response only after writing and closing document
  res.send('Success');
}

exports.getPdf = (req, res) => {
  res.download(__dirname + '/cv.pdf', function(err) { 
    if (err) { console.log(err) } 
  });
}
