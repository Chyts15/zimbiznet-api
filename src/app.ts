import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        project: 'ZimBizNet API',
        version: '1.0.0',
        message: 'Zimbabwe economic infrastructure — connecting every actor in the supply chain'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.method} ${req.path} not found`
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`ZimBizNet API running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;