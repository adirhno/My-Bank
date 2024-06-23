
const dayjs = require("dayjs")

 function buildPDF(pdfDoc, client, transactions) {
  // A4 595.28 x 841.89 (portrait) (about width sizes)
  const date = new Date();
  pdfDoc.text(`Created At: ${dayjs(date).format("DD MMM YYYY - HH:mm")}`, 
              50, 50, { align: "right" });

  pdfDoc.font('Helvetica-Bold').text(`Client:${client} `, 50, 80);
  pdfDoc.font('Helvetica-Bold').text("Status: ", 420, 80);

  
//   pdfDoc.fontSize(13).font('Helvetica-Bold')
//       .text("Client:", { align: "left" })
//       .moveDown();

//   pdfDoc.font('Helvetica-Bold').text("Claimant", 190, 280);
//   pdfDoc.font('Helvetica-Bold').text("Respondent", 380, 280);

 pdfDoc.font('Helvetica').text(`Transactions: `, 80, 200);

 for(let i =0, j=2; i < transactions.length; i++, j+5){

  pdfDoc.font('Helvetica').text(`${transactions[i].vendor} `, 100+j, 200+j);
  pdfDoc.font('Helvetica').text(`${transactions[i].amount} `, 100+j, 220+j);

 }
  pdfDoc.font('Helvetica-Bold').text("Status: ", 420, 80);
  pdfDoc.moveTo(50, 300).lineTo(545, 300).stroke();
  pdfDoc.moveDown();

}

module.exports = {buildPDF};