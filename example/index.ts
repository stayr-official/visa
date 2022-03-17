import "dotenv/config";

import visa, { currencyFromISOCode } from "../index";

const main = async () => {
  const decodedFullKey = Buffer.from(process.env?.KEY64 || "", "base64").toString();
  const decodedSplitKey = decodedFullKey.split(".");
  const key = decodedSplitKey[0];
  const ca = decodedSplitKey[1];
  const cert = decodedSplitKey[2];

  const visaClient = visa(
    {
      key: key,
      ca: ca,
      cert: cert,
    },
    process.env?.USERID || "",
    process.env?.PASSWORD || "",
    {
      mode: "certification",
      defaultParams: {
        buyerID: process.env?.BUYERID || "",
        clientID: process.env?.CLIENTID || "",
        proxyPoolID: process.env?.PROXYPOOLID || "",
      },
    }
  );

  try {
    const r = await visaClient.manageVirtualAccount(
      {
        action: "A",
        numberOfCards: "1",
        requisitionDetails: {
          endDate: "2022-03-18",
          timeZone: "UTC+8",
          rules: [
            {
              ruleCode: "VPAS",
              overrides: [
                {
                  overrideCode: "amountCurrencyCode",
                  overrideValue: currencyFromISOCode("sgd").number,
                  sequence: "0",
                },
                {
                  sequence: "0",
                  overrideCode: "amountValue",
                  overrideValue: "100",
                },
              ],
            },
          ],
        },
      },
      true
    );

    console.log(r);
  } catch (error: any) {
    console.error(error?.message);
  }
};

main();
