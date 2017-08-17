const express = require('express');
const auth = require('../../infrastructure/middlewares/auth');
const mailService = require('../../domain/services/mail-service');
const slackService = require('../../domain/services/slack-service');

const router = express.Router();

router.post('/', auth, (req, res) => {
  const form = req.body;
  mailService.sendFeedbackEmail(form)
    .then(() => slackService.postFeedbackMessage(form.consultant.name, form.feedback))
    .then(() => {
      res.status(201).json('Feedback sent');
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
