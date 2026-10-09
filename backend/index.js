const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, "../docs/openapi.yaml"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3000, () => {
  console.log("Swagger UI tại http://localhost:3000/api-docs");
});
