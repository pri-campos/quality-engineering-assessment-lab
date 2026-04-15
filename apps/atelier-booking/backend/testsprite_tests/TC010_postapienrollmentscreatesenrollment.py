import requests
from datetime import datetime, timedelta
import uuid

BASE_URL = "http://localhost:3333"
TIMEOUT = 30

def test_post_api_enrollments_creates_enrollment():
    headers = {"Content-Type": "application/json"}

    # Create a participant
    participant_data = {
        "name": f"Test Participant {uuid.uuid4()}",
        "email": f"testparticipant_{uuid.uuid4()}@example.com"
    }
    participant_resp = requests.post(
        f"{BASE_URL}/api/participants",
        json=participant_data,
        headers=headers,
        timeout=TIMEOUT
    )
    assert participant_resp.status_code == 201, f"Failed to create participant: {participant_resp.text}"
    participant = participant_resp.json()
    participant_id = participant["id"]

    # Create a workshop with capacity 1 to test waitlist
    scheduled_at = (datetime.utcnow() + timedelta(days=1)).isoformat() + "Z"
    workshop_data = {
        "title": f"Test Workshop {uuid.uuid4()}",
        "description": "Workshop for testing enrollment",
        "capacity": 1,
        "scheduledAt": scheduled_at
    }
    workshop_resp = requests.post(
        f"{BASE_URL}/api/workshops",
        json=workshop_data,
        headers=headers,
        timeout=TIMEOUT
    )
    assert workshop_resp.status_code == 201, f"Failed to create workshop: {workshop_resp.text}"
    workshop = workshop_resp.json()
    workshop_id = workshop["id"]

    # Keep track of enrollment IDs to delete after test
    enrollments_created = []

    try:
        # Enroll first participant: expect CONFIRMED status
        enrollment_data_1 = {
            "participantId": participant_id,
            "workshopId": workshop_id
        }
        enrollment_resp_1 = requests.post(
            f"{BASE_URL}/api/enrollments",
            json=enrollment_data_1,
            headers=headers,
            timeout=TIMEOUT
        )
        assert enrollment_resp_1.status_code == 201, f"Failed to enroll participant (first): {enrollment_resp_1.text}"
        enrollment_1 = enrollment_resp_1.json()
        enrollments_created.append(enrollment_1["id"])
        assert enrollment_1["participantId"] == participant_id
        assert enrollment_1["workshopId"] == workshop_id
        assert enrollment_1["status"] == "CONFIRMED"

        # Create a second participant for waitlist test
        participant_data_2 = {
            "name": f"Test Participant 2 {uuid.uuid4()}",
            "email": f"testparticipant2_{uuid.uuid4()}@example.com"
        }
        participant_resp_2 = requests.post(
            f"{BASE_URL}/api/participants",
            json=participant_data_2,
            headers=headers,
            timeout=TIMEOUT
        )
        assert participant_resp_2.status_code == 201, f"Failed to create second participant: {participant_resp_2.text}"
        participant_2 = participant_resp_2.json()
        participant_id_2 = participant_2["id"]

        # Enroll second participant: expect WAITLIST status since capacity is full
        enrollment_data_2 = {
            "participantId": participant_id_2,
            "workshopId": workshop_id
        }
        enrollment_resp_2 = requests.post(
            f"{BASE_URL}/api/enrollments",
            json=enrollment_data_2,
            headers=headers,
            timeout=TIMEOUT
        )
        assert enrollment_resp_2.status_code == 201, f"Failed to enroll participant (second): {enrollment_resp_2.text}"
        enrollment_2 = enrollment_resp_2.json()
        enrollments_created.append(enrollment_2["id"])
        assert enrollment_2["participantId"] == participant_id_2
        assert enrollment_2["workshopId"] == workshop_id
        assert enrollment_2["status"] == "WAITLIST"

    finally:
        # Cleanup: delete enrollments, participants, and workshop if applicable
        for enrollment_id in enrollments_created:
            try:
                requests.patch(
                    f"{BASE_URL}/api/enrollments/{enrollment_id}/cancel",
                    timeout=TIMEOUT
                )
            except Exception:
                pass
        try:
            requests.delete(f"{BASE_URL}/api/participants/{participant_id}", timeout=TIMEOUT)
        except Exception:
            pass
        try:
            requests.delete(f"{BASE_URL}/api/participants/{participant_id_2}", timeout=TIMEOUT)
        except Exception:
            pass
        try:
            requests.delete(f"{BASE_URL}/api/workshops/{workshop_id}", timeout=TIMEOUT)
        except Exception:
            pass

test_post_api_enrollments_creates_enrollment()