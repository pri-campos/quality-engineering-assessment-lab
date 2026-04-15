import requests
from datetime import datetime, timedelta

BASE_URL = "http://localhost:3333"
HEADERS = {"Content-Type": "application/json"}
TIMEOUT = 30

def test_postapiworkshopsrejectsinvalidbusinessdata():
    # Helper to create a workshop
    def create_workshop(payload):
        response = requests.post(
            f"{BASE_URL}/api/workshops",
            json=payload,
            headers=HEADERS,
            timeout=TIMEOUT
        )
        return response

    # 1) Test capacity < 1 should return 400 as per PRD validation error
    invalid_capacity_payload = {
        "title": "Invalid Capacity Workshop",
        "description": "Test workshop with capacity less than 1",
        "capacity": 0,
        "scheduledAt": (datetime.utcnow() + timedelta(days=1)).isoformat() + "Z"
    }
    resp = create_workshop(invalid_capacity_payload)
    assert resp.status_code == 400, f"Expected 400 for capacity < 1 but got {resp.status_code}"
    json_resp = resp.json()
    assert "error" in json_resp or "message" in json_resp, "Expected error message in response for invalid capacity"

    # 2) Test scheduling conflict should return 422
    # Create a workshop with valid data first
    valid_schedule_time = (datetime.utcnow() + timedelta(days=2)).replace(microsecond=0).isoformat() + "Z"
    valid_workshop_payload = {
        "title": "Original Workshop",
        "description": "Workshop to cause scheduling conflict",
        "capacity": 10,
        "scheduledAt": valid_schedule_time
    }
    created_workshop = None

    try:
        create_resp = create_workshop(valid_workshop_payload)
        assert create_resp.status_code == 201, f"Failed to create workshop for scheduling conflict test, status {create_resp.status_code}"
        created_workshop = create_resp.json()
        
        # Attempt to create another workshop with the same scheduledAt (conflicting time)
        conflict_payload = {
            "title": "Conflicting Workshop",
            "description": "Workshop with scheduling conflict",
            "capacity": 10,
            "scheduledAt": valid_schedule_time
        }
        conflict_resp = create_workshop(conflict_payload)
        assert conflict_resp.status_code == 422, f"Expected 422 for scheduling conflict but got {conflict_resp.status_code}"
        conflict_json = conflict_resp.json()
        assert "error" in conflict_json or "message" in conflict_json, "Expected error message in response for scheduling conflict"

    finally:
        # Cleanup created workshop if any
        if created_workshop and "id" in created_workshop:
            try:
                requests.delete(
                    f"{BASE_URL}/api/workshops/{created_workshop['id']}",
                    timeout=TIMEOUT
                )
            except Exception:
                pass

test_postapiworkshopsrejectsinvalidbusinessdata()