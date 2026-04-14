export type EnrollmentStatus = "CONFIRMED" | "WAITLIST" | "CANCELLED";

export type EnrollmentProps = {
  id: string;
  participantId: string;
  workshopId: string;
  status: EnrollmentStatus;
  createdAt: Date;
};

export class Enrollment {
  constructor(public readonly props: EnrollmentProps) {}
}
