import WebSocket from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';

const url = 'wss://certstream.calidog.io/';

type Logger = {
    info(message: string): void;
    debug(message: string): void;
}

type Message = {
    message_type: string;
    data: Data;
}
type Data = {
    update_type: string;
    leaf_cert: LeafCert;
    chain?: (ChainEntity)[] | null;
    cert_index: number;
    seen: number;
    source: Source;
}
type LeafCert = {
    subject: LeafCertSubject;
    extensions: LeafCertExtensions;
    not_before: number;
    not_after: number;
    serial_number: string;
    as_der?: string;
    all_domains?: (string)[] | null;
    fingerprint: string;
    issuer: LeafCertIssuer;
}
type LeafCertIssuer = {
    C: string;
    CN: string;
    L: null;
    O: string;
    OU: null;
    ST: null;
    aggregated: string;
    emailAddress: string | null;
}
type LeafCertSubject = {
    aggregated: string;
    C?: null;
    ST?: null;
    L?: null;
    O?: null;
    OU?: null;
    CN: string;
}
type LeafCertExtensions = {
    keyUsage: string;
    extendedKeyUsage: string;
    basicConstraints: string;
    subjectKeyIdentifier: string;
    authorityKeyIdentifier: string;
    authorityInfoAccess: string;
    subjectAltName: string;
    certificatePolicies: string;
}
type ChainEntity = {
    subject: ChainEntitySubject;
    extensions: ChainEntityExtension;
    not_before: number;
    not_after: number;
    as_der: string;
}
type ChainEntitySubject = {
    aggregated: string;
    C?: string | null;
    ST?: null;
    L?: null;
    O: string;
    OU?: null;
    CN: string;
}
type ChainEntityExtension = {
    basicConstraints: string;
    keyUsage: string;
    authorityInfoAccess?: string | null;
    authorityKeyIdentifier?: string | null;
    certificatePolicies?: string | null;
    crlDistributionPoints?: string | null;
    subjectKeyIdentifier: string;
}
type Source = {
    url: string;
    name: string;
}

type MessageCallback = (message: Message) => void;

export class CertStreamClient {
    public ws?: ReconnectingWebSocket;

    constructor(private callback: MessageCallback, private logger: Logger = console) { }

    async connect() {
        return new Promise<void>((resolve, reject) => {
            this.logger.debug(`Connecting to ${url}...`);
            this.ws = new ReconnectingWebSocket(url, undefined, {
                WebSocket,
            });

            const timeout = setTimeout(() => {
                // Remove current socket
                this.ws = undefined;
                reject();
            }, 5_000);

            this.ws.onopen = () => {
                this.logger.debug('Connection established to cert-stream! Waiting for messages...');
                clearTimeout(timeout);
                resolve();
            };

            this.ws.onmessage = (message: MessageEvent<any>) => {
                let parsedMessage = JSON.parse(message.data) as Message;
                if (parsedMessage.message_type === 'heartbeat') return;
                this.callback(parsedMessage);
            };
        });
    }
}
