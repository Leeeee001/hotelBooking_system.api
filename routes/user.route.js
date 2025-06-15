let express = require('express')
let router = express.Router()

const { authenticate } = require('../middlewares/auth.middleware');


router.get("/:id", authenticate, (req, res) => {
  const { name, email, phone_num, role, provider } = req.user;
  res.status(200).json({ name, email, phone_num, role, provider });
});


module.exports = router;
