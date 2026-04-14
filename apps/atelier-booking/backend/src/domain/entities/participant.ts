export type ParticipantProps = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export class Participant {
  constructor(public readonly props: ParticipantProps) {}
}
