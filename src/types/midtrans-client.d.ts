declare module "midtrans-client" {
  /* ===== Options ===== */
  interface CommonOptions {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  /* ===== Snap ===== */
  interface TransactionDetails {
    order_id: string;
    gross_amount: number; // IDR integer
  }

  interface ItemDetail {
    id: string;
    price: number;
    quantity: number;
    name: string;
  }

  interface CustomerDetails {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }

  interface CreateTransactionParams {
    transaction_details: TransactionDetails;
    item_details?: ItemDetail[];
    customer_details?: CustomerDetails;
    credit_card?: { secure?: boolean };
    callbacks?: { finish?: string; error?: string; pending?: string };
    // Midtrans menerima banyak field opsional lain
    [key: string]: unknown;
  }

  class Snap {
    constructor(options: CommonOptions);
    createTransaction(
      params: CreateTransactionParams
    ): Promise<{ token: string; redirect_url: string }>;
  }

  /* ===== CoreApi (opsional, kalau nanti dipakai) ===== */
  class CoreApi {
    constructor(options: CommonOptions);
    charge(params: unknown): Promise<unknown>;
    capture(params: unknown): Promise<unknown>;
    cardRegister?(params: unknown): Promise<unknown>;
  }

  /* ===== Default export adalah OBJECT yang punya properti Snap/CoreApi ===== */
  const midtransClient: {
    Snap: typeof Snap;
    CoreApi: typeof CoreApi;
  };

  export { Snap, CoreApi };
  export default midtransClient;
}
