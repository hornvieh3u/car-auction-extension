const example = {
	shipping: {
		name: 'John Doe',
		address: '1234 Main Street',
		city: 'San Francisco',
		state: 'CA',
		country: 'US',
		postal_code: 94111,
	},
	items: [
		{
			item: 'TC 100',
			description: 'Toner Cartridge',
			quantity: 2,
			amount: 6000,
		},
		{
			item: 'USB_EXT',
			description: 'USB Cable Extender',
			quantity: 1,
			amount: 2000,
		},
	],
	subtotal: 8000,
	paid: 0,
	invoice_nr: 1234,
};

const fs = require('fs');
const moment = require('moment/moment');
const PDFDocument = require('pdfkit');

function createInvoice(invoice, path) {

	let doc = new PDFDocument({ margin: 50 });

	generateHeader(doc);
	generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);

	doc.end();
	doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
	doc.image('./utilities/logo.png', 50, 45, { width: 200 })
		.fillColor('#444444')
		.fontSize(10)
		.text('416 887 5555', 200, 65, { align: 'right' })
		.text('123 address st.', 200, 80, { align: 'right' })
		.text('email@example.com', 200, 95, { align: 'right' })
		.text('yourwebsite.com', 200, 110, { align: 'right' })
		.moveDown();
}

function generateCustomerInformation(doc, invoice) {

	doc.fillColor('#3d84a8')
		.text(invoice.account.username, 50, 200)
		.fillColor('#444444')
		.text(`555-555-5555`, 50, 215)
		.text(`123 Anystreet St., City , State 12345`, 50, 230)
		.text(`hello@email.com`, 50, 245)
		.text(`www. yourwebsite.com`, 50, 260)
		.fillColor('#3d84a8')
		.text(`INVOICE#: ${invoice.id}`, 300, 200)
		.fillColor('#444444')
		.text(`DATE ISSUED: ${moment().format('LL')}`, 300, 215)
		.moveDown();
}

function generateInvoiceTable(doc, invoice) {

	doc.fontSize(14)
		.fillColor('#3d84a8')
		.text('Name', 50, 400)
		.text('QTY', 200, 400)
		.text('PRICE', 275, 400)
		.text('VIN CODE', 350, 400)
		.text('DATE', 450, 400)
		.moveTo(50, 420)
		.lineTo( 550, 420 )
		.stroke('#3d84a8')

	doc.fontSize(12)
		.fillColor('#444444')
		.text(invoice.activity.name, 50, 440)
		.text('1', 200, 440)
		.text(`$${invoice.activity.bid_price}`, 275, 440)
		.text(invoice.activity.vin_code, 350, 440)
		.text(moment(invoice.activity.createdAt).format('LL'), 450, 440);
}

module.exports = {
	createInvoice,
};