let express = require('express')
let router = express.Router()

const { authenticate } = require('../middlewares/auth.middleware');


router.get("/:id", authenticate, (req, res) => {
  const { name, email, phone_num, role } = req.user;
  res.status(200).json({ name, email, phone_num, role });
});


module.exports = router;
