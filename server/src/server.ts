import { app } from './app';

const port = process.env.PORT || 3000;

function startServer() {
    try {
        app.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
