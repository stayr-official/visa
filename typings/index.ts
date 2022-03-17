export interface AuthConfig {
  key: Buffer | string;
  cert: Buffer | string;
  ca: Buffer | string;
}

export interface VisaBaseOptions {
  mode?: "sandbox" | "certification" | "production";
  overwriteBaseUrl?: string;
  defaultParams?: {
    buyerID?: string;
    clientID?: string;
    proxyPoolID?: string;
  };
}

export enum SupportedPaths {
  RequisitionService = "/vpa/v1/requisitionService",
  GetSecurityCode = "/vpa/v1/accountManagement/GetSecurityCode",
  ListPaymentControl = "/vpa/v1/accountManagement/ListPaymentControl",
  GetFundingAccountDetails = "/vpa/v1/accountManagement/fundingAccount/get",
  GetPaymentControls = "/vpa/v1/accountManagement/getPaymentControls",
}

interface BaseOptions {
  buyerID?: string;
  clientID?: string;
  messageID?: string;
}

export interface RequisitionServiceOptions extends BaseOptions {
  action: "A" | "U" | "D";
  accountNumber?: string;
  numberOfCards?: string;
  OptionalInfo?: {
    optionalFieldName: string;
    optionalFieldValue: string;
  }[];
  proxyPoolID?: string;
  requisitionDetails?: {
    endDate?: string;
    startDate?: string;
    timeZone?: string;
    rules?: {
      ruleCode: string;
      overrides?: {
        overrideCode: string;
        overrideValue: string;
        sequence: string;
      }[];
    }[];
  };
}

export interface GetSecurityCodeOptions extends BaseOptions {
  accountNumber: string;
  expirationDate: string;
}

export interface GetFundingAccountDetailsOptions extends BaseOptions {
  accountNumber: string;
}

export interface ListPaymentControlOptions extends BaseOptions {
  accountNumber: string;
}

export interface GetPaymentControlOptions extends BaseOptions {
  accountNumber: string;
}
