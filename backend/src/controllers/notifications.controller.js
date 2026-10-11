const notificationsService = require("../services/notifications.service");

// GET /api/notifications (cần đăng nhập: req.user do middleware authenticate gắn vào)
async function list(req, res, next) {
  try {
    const notifications = await notificationsService.listForUser(req.user.id);
    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
}

module.exports = { list };
