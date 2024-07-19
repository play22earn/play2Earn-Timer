const express = require("express");
const { getPromotionData } = require("../controller");
const router = express.Router();

router.get("/promotiondata", getPromotionData);

module.exports = router;
