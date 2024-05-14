
const Ajv = require("ajv")
const ajv = new Ajv()


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
  
  const validate = ajv.compile(marketingRoutesSchema);


//   if (request.method === "POST") {
//     const isValid = validateMarketingRoutes(req.body);
//     if (!isValid) {
//       return res
//         .status(400)
//         .json({ error: "Invalid JSON format for marketing routes" });
//     }
//     res.json({ message: "Validation successful for marketing routes" });
//   } else if (request.method === "GET") {
//     return new Response("The request was a GET");
//   }


  addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    // Check if request method is POST
    if (request.method !== "POST") {
      return new Response("Only POST requests are allowed.", { status: 405 });
    }
  
    try {
      // Parse JSON from request body
      const json = await request.json();
  
      // Validate JSON against schema
      const isValid = validate(json);
  
      if (!isValid) {
        // Return response with error message
        return new Response("Invalid JSON: " + ajv.errorsText(validate.errors), { status: 400 });
      }
  
      // If JSON is valid, return success response
      return new Response("JSON is valid.", { status: 200 });
    } catch (error) {
      // Return response with error message if parsing fails
      return new Response("Error: " + error.message, { status: 500 });
    }
  }
