# Visa VCC

## Docs

Visa Docs: https://developer.visa.com/capabilities/vpa/reference#tag/Account-Management-service/operation/Request%20Virtual%20Account_v1%20-%20Latest

Visa Error Codes: https://developer.visa.com/pages/B2B-virtual-account-payment-method-error-codes#account_management_service

Visa Virtual Card Creation Rules: https://developer.visa.com/pages/B2B-virtual-account-payment-method-codes#rules_and_overrides_for_request_virtual_account_and_manage_payment_controls

## Certs & Keys

There are two ways to import your certs & keys required for visa authentication.

### 1. Using NodeJS `fs`

```ts
const key = fs.readFileSync("./certs/combined-live-key.pem");
const ca = fs.readFileSync("./certs/DigiCertGlobalRootCA.pem");
const cert = fs.readFileSync("./certs/cert.pem");
```

### 2. Decoding keys from Base64 separated by "`.`";

```ts
const decodedFullKey = Buffer.from(process.env?.KEY64 || "", "base64").toString();

const decodedSplitKey = decodedFullKey.split(".");

const key = decodedSplitKey[0];
const ca = decodedSplitKey[1];
const cert = decodedSplitKey[2];
```

Remember that when encoding the certs and keys into a single Base64 string, the order matters.

## Initializing

```ts
import visa from "@stayr-official/visa";

const visaClient = visa({ key, ca, cert }, process.env.USERID, process.env.PASSWORD, {
  mode: "certification",
  defaultParams: {
    buyerID: process.env.BUYERID,
    clientID: process.env.CLIENTID,
    proxyPoolID: process.env.PROXYPOOLID,
  },
});
```
