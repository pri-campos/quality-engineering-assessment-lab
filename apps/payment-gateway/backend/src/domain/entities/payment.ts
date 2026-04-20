import { randomUUID } from 'node:crypto';

export type PaymentStatus = 'CREATED' | 'REGISTERED_AT_PARTNER' | 'PAID' | 'REFUNDED' | 'FAILED';

export interface PaymentProps {
  userId: string;
  amount: number;
  currency: string;
  idempotencyKey?: string | null;
  creditCardToken?: string | null;
  status?: PaymentStatus;
  history?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Payment {
  private readonly _id: string;
  private props: Required<PaymentProps>;

  constructor(props: PaymentProps, id?: string) {
    this._id = id || `pay_${randomUUID()}`;
    
    this.props = {
      ...props,
      idempotencyKey: props.idempotencyKey || null,
      creditCardToken: props.creditCardToken || null,
      status: props.status || 'CREATED',
      history: props.history || [],
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  get id() {
    return this._id;
  }

  get status() {
    return this.props.status;
  }

  get idempotencyKey() {
    return this.props.idempotencyKey;
  }

  public registerAtPartner() {
    this.props.status = 'REGISTERED_AT_PARTNER';
    this.props.history.push({
      status: this.props.status,
      timestamp: new Date()
    });
    this.props.updatedAt = new Date();
  }

  public toJSON() {
    return {
      id: this._id,
      ...this.props,
    };
  }
}
