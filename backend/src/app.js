const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const routes = require("./routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Swagger UI đặt TRƯỚC helmet: CSP mặc định của helmet làm hỏng giao diện Swagger.
const swaggerDocument = YAML.load(
  path.join(__dirname, "../../docs/openapi.yaml"),
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware dùng chung cho mọi request.
app.use(helmet());
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Request không có header Origin (công cụ dòng lệnh, cùng máy chủ) thì cho qua.
      if (!origin) return callback(null, true);
      // Khi chạy local mà chưa đặt biến thì mở để tiện phát triển.
      if (process.env.NODE_ENV !== "production" && allowedOrigins.length === 0) {
        return callback(null, true);
      }
      return callback(null, allowedOrigins.includes(origin));
    },
  }),
);
app.use(morgan("dev"));
app.use(express.json());

// Toàn bộ API nằm dưới /api (khớp "servers" trong openapi.yaml).
app.use("/api", routes);

// Thứ tự cuối cùng quan trọng: notFound rồi tới errorHandler.
app.use(notFound);
app.use(errorHandler);

module.exports = app;
