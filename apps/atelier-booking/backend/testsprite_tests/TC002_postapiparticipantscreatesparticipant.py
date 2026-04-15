import requests

BASE_URL = "http://localhost:3333"
TIMEOUT = 30

def test_post_api_participants_creates_participant():
    url = f"{BASE_URL}/api/participants"
    payload = {
        "name": "Test User TC002",
        "email": "testuser_tc002@example.com"
    }
    headers = {
        "Content-Type": "application/json"
    }
    participant_id = None

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
        assert response.status_code == 201, f"Expected HTTP 201, got {response.status_code}"
        data = response.json()
        assert "id" in data and isinstance(data["id"], str) and data["id"], "Response missing valid 'id'"
        assert data.get("name") == payload["name"], f"Response name '{data.get('name')}' does not match request"
        assert data.get("email") == payload["email"], f"Response email '{data.get('email')}' does not match request"
        # createdAt is expected to be present as per test case description
        assert "createdAt" in data and isinstance(data["createdAt"], str) and data["createdAt"], "Response missing valid 'createdAt'"
        participant_id = data["id"]
    except requests.RequestException as e:
        assert False, f"RequestException occurred: {e}"
    finally:
        # Cleanup: delete the created participant if possible to keep test environment clean
        if participant_id:
            try:
                delete_url = f"{BASE_URL}/api/participants/{participant_id}"
                requests.delete(delete_url, timeout=TIMEOUT)
            except requests.RequestException:
                pass

test_post_api_participants_creates_participant()