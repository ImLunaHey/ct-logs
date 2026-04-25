# ct-logs

Subscribes to the [CertStream](https://certstream.calidog.io/) feed —
every new TLS certificate issued globally, scraped from Certificate
Transparency logs in real time — and forwards each one to
[Axiom](https://axiom.co) for storage and querying.

## Run it

```bash
npm install
AXIOM_TOKEN=…  AXIOM_ORG_ID=…  AXIOM_DATASET=…  npm run build && npm start
```

## Deploy

Deployed via [SST](https://sst.dev) v3 to a Linode VM (`sst.config.ts`).
Builds a Docker image, pushes to `ghcr.io/imlunahey/ct-logs`, and runs it
on the host.
