import https from "https";
import axios, { AxiosRequestConfig } from "axios";
import { nanoid } from "nanoid";
import {
  AuthConfig,
  VisaBaseOptions,
  SupportedPaths,
  GetSecurityCodeOptions,
  RequisitionServiceOptions,
  GetFundingAccountDetailsOptions,
  ListPaymentControlOptions,
  GetPaymentControlOptions,
} from "../typings";

const baseUrls = {
  sandbox: "https://sandbox.api.visa.com",
  certification: "https://cert.api.visa.com",
  production: "https://api.visa.com",
};

export const visa = (
  authConfig: AuthConfig,
  userId: string,
  password: string,
  options: VisaBaseOptions = {
    mode: "sandbox",
    overwriteBaseUrl: undefined,
    defaultParams: undefined,
  }
) => {
  const httpsAgent = new https.Agent(authConfig);

  const mode = options?.mode || "sandbox";

  const baseUrl = options.overwriteBaseUrl || baseUrls[mode];
  const defaultParams = options?.defaultParams;

  const defaultCallOptions: AxiosRequestConfig<string> = {
    httpsAgent,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Basic " + Buffer.from(userId + ":" + password).toString("base64"),
    },
  };

  const visaPossibleErrors = (responseData: any) => {
    if (responseData?.responses?.length) {
      const findErrorResponse = responseData.responses.find((r: any) => r.responseCode != "00");
      if (findErrorResponse) {
        if (findErrorResponse?.responseCode && findErrorResponse?.responseDescription) {
          throw new Error(`Status: ${findErrorResponse.responseCode} - ${findErrorResponse.responseDescription}`);
        } else {
          throw new Error(JSON.stringify(findErrorResponse));
        }
      }
    }

    if (responseData?.errors?.length > 0) {
      const errObj = responseData?.errors[0];
      throw new Error(`Status: ${errObj.code} - ${errObj.statusDesc}`);
    }
  };

  const visaCall = async (path: SupportedPaths, body: any) => {
    try {
      const finalPath = `${baseUrl}${path}`;
      const axiosResult = await axios.post(finalPath, JSON.stringify(body), defaultCallOptions);
      const responseData = axiosResult.data;

      visaPossibleErrors(responseData);

      return responseData;
    } catch (error: any) {
      const visaErrObject = error?.response?.data?.ResponseStatus;
      const visaErr = visaErrObject?.errorMessage
        ? `Status: ${visaErrObject.errorCode} - ${visaErrObject.errorMessage}`
        : undefined;

      throw new Error(visaErr || error?.message || error);
    }
  };

  const parseOptionsDefaultValues = (options: any) => {
    options["buyerID"] = options?.buyerID || defaultParams?.buyerID;
    options["clientID"] = options?.clientID || defaultParams?.clientID;
    options["messageID"] = options?.messageID || nanoid();

    return options;
  };

  const manageVirtualAccount = async (options: RequisitionServiceOptions, getSecurityCode: boolean = false) => {
    options = parseOptionsDefaultValues(options);
    options.proxyPoolID = options?.proxyPoolID || defaultParams?.proxyPoolID;

    const requisitionServiceResult = await visaCall(SupportedPaths.RequisitionService, options);
    let getSecurityCodeResult = {};

    if (options.action != "D" && getSecurityCode) {
      getSecurityCodeResult = await getVirtualAccountSecurityCode({
        accountNumber: requisitionServiceResult.accountNumber,
        expirationDate: requisitionServiceResult.expirationDate,
        buyerID: options?.buyerID,
        clientID: options?.clientID,
      });
    }

    return {
      ...requisitionServiceResult,
      ...getSecurityCodeResult,
    };
  };

  const getVirtualAccountSecurityCode = (options: GetSecurityCodeOptions) => {
    options = parseOptionsDefaultValues(options);
    return visaCall(SupportedPaths.GetSecurityCode, options);
  };

  const getFundingAccountDetails = async (options: GetFundingAccountDetailsOptions) => {
    options = parseOptionsDefaultValues(options);
    return visaCall(SupportedPaths.GetFundingAccountDetails, options);
  };

  const listVirtualAccountControls = async (options: ListPaymentControlOptions) => {
    options = parseOptionsDefaultValues(options);
    return visaCall(SupportedPaths.ListPaymentControl, options);
  };

  const getVirtualAccountControls = async (options: GetPaymentControlOptions) => {
    options = parseOptionsDefaultValues(options);
    return visaCall(SupportedPaths.GetPaymentControls, options);
  };

  return {
    manageVirtualAccount,
    getVirtualAccountSecurityCode,
    getFundingAccountDetails,
    listVirtualAccountControls,
    getVirtualAccountControls,
  };
};
