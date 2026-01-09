import { app } from '../server/app';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Catch unhandled rejections to prevent silent crashes
process.on('unhandledRejection', (reason, p) => {
    console.error('[Vercel] Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('[Vercel] Uncaught Exception:', error);
});

export default function handler(req: VercelRequest, res: VercelResponse) {
    console.log('[Vercel] Handler Invoked:', req.method, req.url);
    try {
        app(req, res);
    } catch (error) {
        console.error('[Vercel] Synchronous Handler Error:', error);
        res.status(500).json({
            error: 'Serverless Function Crash',
            details: String(error)
        });
    }
}
