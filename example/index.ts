import "dotenv/config";
import visa, { currencyFromISOCode, RequisitionServiceOptions } from "../index";
import dayjs from "dayjs";

const main = async () => {
  const decodedFullKey = Buffer.from(process.env?.KEY64 || "", "base64").toString();
  const decodedSplitKey = decodedFullKey.split(".");
  const key = decodedSplitKey[0];
  const ca = decodedSplitKey[1];
  const cert = decodedSplitKey[2];

  const visaClient = visa({ key, ca, cert }, process.env?.USERID || "", process.env?.PASSWORD || "", {
    mode: "production",
    defaultParams: {
      buyerID: process.env?.BUYERID || "",
      clientID: process.env?.CLIENTID || "",
      proxyPoolID: process.env?.PROXYPOOLID || "",
    },
  });

  try {
    const exactMatchCard: RequisitionServiceOptions = {
      action: "A",
      numberOfCards: "1",
      requisitionDetails: {
        endDate: dayjs().add(1, "month").format("YYYY-MM-DD"),
        timeZone: "UTC+8",
        rules: [
          {
            ruleCode: "VPAS",
            overrides: [
              {
                sequence: "0",
                overrideCode: "amountCurrencyCode",
                overrideValue: currencyFromISOCode("sgd").number,
              },
              {
                sequence: "0",
                overrideCode: "amountValue",
                overrideValue: "5",
              },
            ],
          },
        ],
      },
    };

    console.log("request: ", JSON.stringify(exactMatchCard, null, 2));

    const result = await visaClient.manageVirtualAccount(exactMatchCard, true);

    console.log("--Card Generated--");
    console.log(result);
  } catch (error: any) {
    console.error(error?.message);
  }
};

main();
