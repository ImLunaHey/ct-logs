import 'dotenv/config';
import { logger } from '@app/logger';
import { CertStreamClient } from './cert-stream';

let client = new CertStreamClient(meta => {
    logger.info('new-cert', meta);
});

const logEvent = (event: string) => (...args: unknown[]) => logger.info(event, {
    meta: {
        ...args
    },
});

console.info('> started');

// Connect to the websocket server
await client.connect();
console.info('> connected to stream');

// Failed to connect
if (!client.ws) process.exit(0);

client.ws.onclose = logEvent('close');
client.ws.onerror = logEvent('error');
