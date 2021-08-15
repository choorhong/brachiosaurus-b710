"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const contact_1 = __importDefault(require("./routes/contact"));
const vessel_1 = __importDefault(require("./routes/vessel"));
const booking_1 = __importDefault(require("./routes/booking"));
const purchase_order_1 = __importDefault(require("./routes/purchase-order"));
const shipment_1 = __importDefault(require("./routes/shipment"));
// import purchaseOrderRoutes from './routes/shipment'
const models_1 = require("./db/models");
const handleError = (err, req, res, next) => {
    res.status(500).json({ message: err.message, statusCode: err.statusCode });
};
// Initialize environmental variables
dotenv_1.default.config();
const { PORT } = process.env;
// Initialize app
const app = express_1.default();
// Configure app
app.use(cors_1.default({
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Configure REST API routes
app.use('/auth', auth_1.default);
app.use('/contact', contact_1.default);
app.use('/vessel', vessel_1.default);
app.use('/booking', booking_1.default);
app.use('/purchase-order', purchase_order_1.default);
app.use('/shipment', shipment_1.default);
// Configure Express fallback error handler
app.use(handleError);
// Set up database & server
models_1.sequelize.authenticate().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
})
    .catch(err => {
    console.log('Connection error: ', err.message);
});
