const express = require('express')
const models = require("../config/database.js");
const { createInvoice } = require('../utilities/invoice.js');
const { sendMail } = require('../utilities/mail.js');
require('dotenv').config();

const router = express.Router();

router.post('/activity', async (req, res) => {
    try {
        let { name, lotId, bidPrice, vinCode, type, status } = req.query;

        if( !name || !lotId || !bidPrice || !vinCode || !type ) {
            return res.status(401).send({ result: false, msg: 'All input is required!' });
        }

        let activity = await models.monitors.create({
            name,
            lot_id: lotId,
            bid_price: bidPrice,
            vin_code: vinCode,
            user_id: req.user.user_id,
            type,
            status
        });

        return res.status(200).send({ result: true, id: activity.id });
    }
    catch(err) {
        console.error(err);
        return res.status(501).send({ result: false, msg: err.message });
    }
})

router.get('/activity', async (req, res) => {
    try {
        let { user_id } = req.user;

        let activities = await models.monitors.findAll({ where: { user_id: user_id } });

        return res.status(200).send({ activities })
    } catch(err) {
        console.error(err);
        return res.status(501).send({ result: false, msg: err.message });
    }
})

router.get('/invoice', async (req, res) => {
    try {
        let { user_id } = req.user;

        let invoices = await models.invoices.findAll({ where: { receiver_id: user_id } });

        return res.status(200).send({ invoices })
    } catch(err) {
        console.error(err);
        return res.status(501).send({ result: false, msg: err.message });
    }
})

router.post('/invoice', async (req, res) => {
    try {
        let { user_id } = req.user;
        let { id } = req.query;

        const activity = await models.monitors.findOne({ where: { id }, include: [models.users] });
        await activity.update({ status: 'winning' });

        const account = await models.accounts.findOne({ where: { type: activity.type } });

        let invoice = await models.invoices.create({
            monitor_id: activity.id,
            receiver_id: user_id,
            status: 'sending'
        });

        invoice.activity = activity.toJSON();
        invoice.account = account.toJSON()

        const filename = `invoice_${ invoice.id }.pdf`
        createInvoice(invoice, filename);
        sendMail(activity.user.email, filename, async status => {
            await invoice.update({ status });
        });
        
        return res.status(200).send({ result: true });
    } catch(err) {
        console.error(err);
        return res.status(501).send({ result: false, msg: err.message });
    }
})

module.exports = router;