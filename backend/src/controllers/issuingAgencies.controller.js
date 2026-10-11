const issuingAgenciesService = require("../services/issuingAgencies.service");

async function list(req, res, next) {
  try {
    const issuingAgencies = await issuingAgenciesService.listIssuingAgencies();
    res.status(200).json(issuingAgencies);
  } catch (err) {
    next(err);
  }
}

module.exports = { list };
