# Atelier Booking - API

## Objective

This backend provides a controlled environment to simulate and validate booking workflows with constrained resources.

It models a workshop enrollment system where participants compete for limited capacity, enabling the evaluation of:

- state transitions (CONFIRMED, WAITLIST, CANCELLED)
- business constraints (capacity limits, uniqueness)
- consistency of aggregated data (workshop summary and enrollments)

----

## Domain Model

- Participant: entity representing a user who can enroll in workshops
- Workshop: event with limited capacity
- Enrollment: relationship between participant and workshop, with a defined state

----

## Enrollment States

- CONFIRMED: participant successfully secured a spot
- WAITLIST: participant is queued due to lack of capacity
- CANCELLED: enrollment was explicitly canceled

State transitions:

- CONFIRMED → CANCELLED
- WAITLIST → CONFIRMED (when a slot becomes available)
- CANCELLED → terminal state

----

## Business Rules

- A workshop cannot exceed its defined capacity
- A participant cannot enroll more than once in the same workshop
- Waitlist is used when capacity is reached
- Canceling a confirmed enrollment frees a slot
- The first participant in the waitlist is promoted when a slot becomes available

### Consistency Rules

For any workshop:

- confirmed_count ≤ capacity
- waitlist_count ≥ 0
- total enrollments reflect actual states

GET /api/workshops/:id must always reflect the latest consistent state of:
- enrollments
- summary (confirmed, waitlist, cancelled)

### Data Integrity

- Enrollment requires a valid participantId and workshopId
- Invalid references must result in errors
- Duplicate enrollments must be rejected

### Error Handling

- 400: invalid input
- 404: resource not found
- 409: conflict (e.g., duplicate enrollment)
- 422: business rule violation

### Critical Scenarios

The system is designed to expose:

- competition for limited capacity
- state transitions triggered by user actions
- consistency after mutations
- edge cases such as duplicate requests and invalid state changes

### Non-goals

This system does not currently model:

- authentication or authorization
- advanced scheduling constraints

----

## Setup
After cloning the repo, run:

```bash
pnpm install
pnpm approve-builds
pnpm rebuild better-sqlite3
```
