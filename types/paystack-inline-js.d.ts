declare module "@paystack/inline-js" {
  export type PaystackSuccessResponse = {
    id: number;
    reference: string;
    message: string;
  };

  export type PaystackCallbacks = {
    onError?: (error: { message: string }) => void;
    onCancel?: () => void;
    onLoad?: (payload: {
      id: number;
      customer: Record<string, unknown>;
      accessCode: string;
    }) => void;
    onSuccess?: (response: PaystackSuccessResponse) => void | Promise<void>;
  };

  export type PaystackTransactionOptions = {
    key?: string;
    amount?: number;
    currency?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    reference?: string;
    metadata?: Record<string, unknown>;
  } & PaystackCallbacks;

  export default class PaystackPop {
    resumeTransaction(
      accessCode: string,
      callbacks?: PaystackCallbacks,
    ): unknown;

    newTransaction(options: PaystackTransactionOptions): unknown;
  }
}
