import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FinanceDaily API",
      version: "1.0.0",
      description: "API documentation for FinanceDaily backend",
    },
    servers: [
      {
        url: "http://localhost:5000", // adjust if deployed
        description: "Local server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Scan route files for Swagger comments
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiMiddleware = swaggerUi;
