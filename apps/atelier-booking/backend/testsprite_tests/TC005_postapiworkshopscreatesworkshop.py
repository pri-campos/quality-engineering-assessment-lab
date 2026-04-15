import requests
import datetime

BASE_URL = "http://localhost:3333"
TIMEOUT = 30

def test_post_api_workshops_creates_workshop():
    url = f"{BASE_URL}/api/workshops"
    now_iso = datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
    payload = {
        "title": "Test Workshop Title",
        "description": "Test Workshop Description",
        "capacity": 10,
        "scheduledAt": now_iso
    }
    headers = {"Content-Type": "application/json"}

    response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)

    try:
        # Assert status code 201 Created
        assert response.status_code == 201, f"Expected 201, got {response.status_code}"
        data = response.json()

        # Assert returned object includes required fields
        assert "id" in data and isinstance(data["id"], str) and data["id"]
        assert data.get("title") == payload["title"]
        assert data.get("description") == payload["description"]
        assert data.get("capacity") == payload["capacity"]
        # scheduledAt should be present as a string and non-empty
        assert "scheduledAt" in data and isinstance(data["scheduledAt"], str) and data["scheduledAt"]
        # createdAt should be present as a string and non-empty
        assert "createdAt" in data and isinstance(data["createdAt"], str) and data["createdAt"]
    finally:
        # Cleanup - delete the created workshop to avoid test pollution if API supports DELETE
        workshop_id = None
        try:
            workshop_id = response.json().get("id")
        except Exception:
            pass
        if workshop_id:
            try:
                requests.delete(f"{BASE_URL}/api/workshops/{workshop_id}", timeout=TIMEOUT)
            except Exception:
                pass

test_post_api_workshops_creates_workshop()