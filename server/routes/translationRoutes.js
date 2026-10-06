const express = require("express");
const router = express.Router();
const {
  translate,
  translateObjectEndpoint,
  getTranslationStats,
} = require("../controllers/translationController");

router.post("/translate", translate);
router.post("/object", translateObjectEndpoint);
router.get("/stats", getTranslationStats);

module.exports = router;
