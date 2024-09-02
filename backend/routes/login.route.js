const models = require('../config/database');
const bycrypt  = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
require('dotenv').config();

// routes for admin login
router.post('/admin', async (req, res, next) => {
  try {
      const {email, password} = req.body;
      console.log('<---- login request ---->')
      // Validtate user input
      if (!email || !password) {
          res.status(400).send('All input is required!');
      }

      const user = await models.users.findOne({
        where :{
          email,
          role: 'admin'
        }
      });
      if (user && (await bycrypt.compare(password, user.password))) {
          // Create the jwt 
          const token = jwt.sign(
              {user_id: user.id, email:email, role: user.role},
              process.env.JWT_SECRET
          );
          user.token = token;
          user.last_login_date = Date.now().toString();
          await user.save();
          res.status(200).json(user);
      } else {
        res.status(400).send('Invalid Credentials!');
      }
  }
  catch(error) {
      console.error(error);
  }
});

// routes for user login
router.post('/user', async (req, res) => {
  try {
      const {email, password} = req.body
      // Validtate user input
      if (!email && !password) {
          res.status(400).send('All input is required!');
          return;
      }

      const user = await models.users.findOne({
        where: {
          email,
          role: 'user'
        }
      });

      const accounts = await models.accounts.findAll({});

      if (user && (await bycrypt.compare(password, user.password))) {
          // Create the jwt 
          const token = jwt.sign(
              {user_id: user.id, email, role: user.role},
              process.env.JWT_SECRET
          );

          const response = {
            user_id: user.id,
            email,
            role: user.role,
            accounts,
            token
          }
          
          res.status(200).json(response);
          return;
      }
      res.status(400).send('Invalid Credentials!');
  }
  catch(error) {
      console.error(error);
  }  
})

module.exports = router;