//config/swagger.js
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
        url: "https://financedaily-backend.onrender.com", // adjust if deployed
        description: "Production server",
      },
      {
        url: "http://localhost:5000",
        description: "Local Development Server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Scan route files for Swagger comments
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiMiddleware = swaggerUi;
