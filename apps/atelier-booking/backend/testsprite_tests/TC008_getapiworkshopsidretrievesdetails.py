import requests
import uuid
import datetime

BASE_URL = "http://localhost:3333"
TIMEOUT = 30

def test_getapiworkshopsidretrievesdetails():
    workshop_id = None

    # Helper to create a workshop
    def create_workshop():
        url = f"{BASE_URL}/api/workshops"
        scheduled_at = (datetime.datetime.utcnow() + datetime.timedelta(days=1)).isoformat() + "Z"
        payload = {
            "title": "Test Workshop " + str(uuid.uuid4()),
            "description": "Test description",
            "capacity": 10,
            "scheduledAt": scheduled_at
        }
        resp = requests.post(url, json=payload, timeout=TIMEOUT)
        resp.raise_for_status()
        assert resp.status_code == 201
        body = resp.json()
        assert "id" in body
        return body["id"]

    # Create workshop to test retrieval
    try:
        workshop_id = create_workshop()

        # GET workshop details by id
        url = f"{BASE_URL}/api/workshops/{workshop_id}"
        resp = requests.get(url, timeout=TIMEOUT)
        assert resp.status_code == 200
        data = resp.json()

        # Validate workshop details fields
        assert data["id"] == workshop_id
        assert isinstance(data.get("title"), str) and len(data["title"]) > 0
        assert isinstance(data.get("description"), str)
        assert isinstance(data.get("capacity"), int)
        assert isinstance(data.get("scheduledAt"), str)
        
        # Validate summary structure
        summary = data.get("summary")
        assert isinstance(summary, dict)
        assert "confirmed" in summary and isinstance(summary["confirmed"], int)
        assert "waitlist" in summary and isinstance(summary["waitlist"], int)
        assert "cancelled" in summary and isinstance(summary["cancelled"], int)

        # Validate enrollments structure
        enrollments = data.get("enrollments")
        assert isinstance(enrollments, list)
        for enrollment in enrollments:
            assert "id" in enrollment and isinstance(enrollment["id"], str)
            assert "participantId" in enrollment and isinstance(enrollment["participantId"], str)
            assert "status" in enrollment and isinstance(enrollment["status"], str)
            assert "createdAt" in enrollment and isinstance(enrollment["createdAt"], str)

    finally:
        # Cleanup: delete the created workshop if deletion API existed. 
        # Since no DELETE endpoint is described, skip deletion.
        pass

test_getapiworkshopsidretrievesdetails()