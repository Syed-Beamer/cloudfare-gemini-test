const express = require("express");
const cors = require("cors");
const Ajv = require("ajv");
const { appRoutePayload, marketingRoutePayload } = require("../payload")

const app = express();
app.use(cors());
app.use(express.json());

const ajv = new Ajv();



// JSON schema for app_routes
const appRoutesSchema = {
  type: "object",
  properties: {
    metadata: {
      type: "object",
      properties: {
        schema_name: { type: "string" },
        deployment_stage: { type: "string" },
        triggered_at: { type: "string" },
        trigger_origin: { type: "string" },
        trigger_location: { type: "string" },
      },
      required: [
        "schema_name",
        "deployment_stage",
        "triggered_at",
        "trigger_origin",
        "trigger_location",
      ],
    },
    identity: {
      type: "object",
      properties: {
        ip_address: { type: "string" },
        cookie_id: { type: "string" },
        account_id: { type: "string" },
        user_id: { type: "string" },
        impersonator_id: { type: "string" },
      },
      required: ["ip_address", "cookie_id"],
    },
    attributes: {
      type: "object",
      properties: {
        host: { type: "string" },
        path: { type: "string" },
        hash_path: { type: ["string", "null"] },
        search: { type: ["string", "null"] },
        referrer: { type: ["string", "null"] },
      },
      required: ["host", "path"],
    },
  },
  required: ["metadata", "identity", "attributes"],
};

// JSON schema for marketing_routes
const marketingRoutesSchema = {
  type: "object",
  properties: {
    metadata: {
      type: "object",
      properties: {
        schema_name: { type: "string" },
        deployment_stage: { type: "string" },
        triggered_at: { type: "string" },
        trigger_origin: { type: "string" },
        trigger_location: { type: "string" },
      },
      required: [
        "schema_name",
        "deployment_stage",
        "triggered_at",
        "trigger_origin",
        "trigger_location",
      ],
    },
    identity: {
      type: "object",
      properties: {
        ip_address: { type: "string" },
        cookie_id: { type: "string" },
        account_id: { type: "string" },
        user_id: { type: "string" },
        impersonator_id: { type: "string" },
      },
      required: ["ip_address", "cookie_id"],
    },
    attributes: {
      type: "object",
      properties: {
        host: { type: "string" },
        path: { type: "string" },
        hash_path: { type: ["string", "null"] },
        search: { type: ["string", "null"] },
        referrer: { type: ["string", "null"] },
      },
      required: ["host", "path"],
    },
  },
  required: ["metadata", "identity", "attributes"],
};

const validateAppRoutes = ajv.compile(appRoutesSchema);
const validateMarketingRoutes = ajv.compile(marketingRoutesSchema);

app.post("/app_routes", (req, res) => {
  const isValid = validateAppRoutes(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ error: "Invalid JSON format for app routes" });
  }
  res.json({ message: "Validation successful for app routes" });
});

app.post("/marketing_routes", (req, res) => {
  const isValid = validateMarketingRoutes(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ error: "Invalid JSON format for marketing routes" });
  }
  res.json({ message: "Validation successful for marketing routes" });
});






// //? Test the app routes payload
// app.get("/testapproute", (req, res) => {
//   const isValid = validateAppRoutes(appRoutePayload);
//   if (!isValid) {
//     return res
//       .status(400)
//       .json({ error: "Invalid JSON format for app routes test payload" });
//   }
//   res.json({ message: "Validation successful for app routes test payload" });
// });

// //? Test the marketing routes payload
// app.get("/testmarketingroutes", (req, res) => {
//   const isValid = validateMarketingRoutes(marketingRoutePayload);
//   if (!isValid) {
//     return res
//       .status(400)
//       .json({ error: "Invalid JSON format for marketing routes test payload" });
//   }
//   res.json({
//     message: "Validation successful for marketing routes test payload",
//   });
// });

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
