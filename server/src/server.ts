import { app } from './app';

import { initStorage } from '@/config/storage';

const port = process.env.PORT || 3000;

async function startServer() {
    // Execute any async setup before running server
    await initStorage();

    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running on port ${port}`);
    });
};

startServer();
