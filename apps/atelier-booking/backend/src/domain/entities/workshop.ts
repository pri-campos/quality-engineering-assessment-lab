export type WorkshopProps = {
  id: string;
  title: string;
  description: string;
  capacity: number;
  scheduledAt: Date;
  createdAt: Date;
};

export class Workshop {
  constructor(public readonly props: WorkshopProps) {}

  hasValidCapacity(): boolean {
    return this.props.capacity > 0;
  }
}
