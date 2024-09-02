const express = require('express')
const models = require("../config/database.js");
const bycrypt = require('bcryptjs');
require('dotenv').config();

const router = express.Router();

router.post('/logout', async(req, res) => {
    try {
        const { token } = req.body;
        await models.users.update({token: null}, {where: {token: token}});
        res.status(200).send('Succesfully Logout!');
    }
    catch(err) {
        console.error(err);
    }
})

// user
router.post('/user/create', async (req, res) => {
    try {
        const {email, password, role} = req.body;
        if (!email || !password || !role) {
            res.status(400).send('All input is required!');
        }
        const user = await models.users.create({
            email: email,
            password: bycrypt.hashSync(password),
            role: role
        });
        res.status(200).json(user);
    }
    catch(err) {
        res.status(501).json(err.message);
        console.error(err);
    }
});

router.get('/user/all', async (req, res)  => {
    try {
        const customers = await models.users.findAll();
        res.status(200).json(customers);
    }
    catch(err) {
        console.error(err);
        res.status(501).send(err.message);
    }
});

router.post('/user/delete', async (req, res) => {
    try {
        let user_id = req.body.id;
        await models.users.destroy({
            where: { id: user_id}
        });
        res.status(200).send('Sucessfully Deleted one row!');

    }
    catch(err) {
        console.error(err);
        res.status(501).send(err.message);
    }
});

// account
router.post('/account/create', async (req, res) => {
    try {
        const {
            username,
            password,
            type
        } = req.body;

        if (!username || !password || !type) {
            res.status(400).send('Owner input is required!');
        }
        const account = await models.accounts.create({
            username, password, type
        });
        
        res.status(200).json(account);
    }
    catch(err) {
        console.error(err);
        res.status(501).send(err.message);
    }
});

router.get('/account/all', async (req, res)  => {
    try {
        const accounts = await models.accounts.findAll({});
        res.status(200).json(accounts);
    }
    catch(err) {
        console.error(err);
        res.status(501).send(err.message);
    }
});

router.post('/account/delete', async (req, res) => {
    try {
        let accountId = req.body.id;
        await models.accounts.destroy({
            where: { id: accountId }
        });
        res.status(200).send('Sucessfully Deleted one row!');
    }
    catch(err) {
        console.error(err);
        res.status(501).send(err.message);
    }
});

// proxy
router.post('/proxy/create', async (req, res) => {
    try {
        const {ip, port, domain} = req.body;
        if (!ip || !port || !domain) {
            res.status(400).send('All input is required!');
        }
        const proxy = await models.proxies.create({
            ip, port, domain
        });
        res.status(200).json(proxy);
    }
    catch(err) {
        console.error(err);
        res.status(501).send(err.message);
    }
});

router.get('/proxy/all', async (req, res)  => {
    try {
        const proxies = await models.proxies.findAll();
        res.status(200).json(proxies);
    }
    catch(err) {
        console.error(err);
        res.status(501).send(err.message);
    }
});

router.post('/proxy/delete', async (req, res) => {
    try {
        let proxyId = req.body.id;
        await models.proxies.destroy({
            where: { id: proxyId }
        });
        res.status(200).send('Sucessfully Deleted one row!');
    }
    catch(err) {
        console.error(err);
        res.status(501).send(err.message);
    }
});

// invoice
// router.post('/invoice/create', async (req, res) => {
//     try {
//         const {monitorId, accountId, comment, status} = req.body;
//         if (!monitorId || !accountId || !status) {
//             res.status(400).send('All input is required!');
//         }
//         const invoice = await models.invoices.create({
//             monitorId, accountId, comment, status
//         });
//         res.status(200).json(invoice);
//     }
//     catch(err) {
//         console.error(err);
//         res.status(501).send(err.message);
//     }
// });

router.get('/invoice/all', async (req, res)  => {
    try {
        const invoices = await models.invoices.findAll({ include: [models.users, models.monitors] });
        res.status(200).json(invoices);
    }
    catch(err) {
        console.error(err);
        res.status(501).send(err.message);
    }
});

router.post('/invoice/delete', async (req, res) => {
    try {
        let invoiceId = req.body.id;
        await models.invoices.destroy({
            where: { id: invoiceId }
        });
        res.status(200).send('Sucessfully Deleted one row!');
    }
    catch(err) {
        console.error(err);
        res.status(501).send(err.message);
    }
});

// monitor
// router.post('/monitor/create', async (req, res) => {
   
// });

router.get('/monitor/all', async (req, res)  => {
    try {
        const monitors = await models.monitors.findAll({ include: [models.users] });
        res.status(200).json(monitors);
    }
    catch(err) {
        console.error(err);
        res.status(501).send(err.message);
    }
});

router.post('/monitor/delete', async (req, res) => {
    try {
        let monitorId = req.body.id;
        await models.monitors.destroy({
            where: { id: monitorId }
        });
        res.status(200).send('Sucessfully Deleted one row!');
    }
    catch(err) {
        console.error(err);
        res.status(501).send(err.message);
    }
});

module.exports = router;