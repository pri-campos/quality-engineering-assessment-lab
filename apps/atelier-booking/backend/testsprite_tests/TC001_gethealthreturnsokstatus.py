import requests

BASE_URL = "http://localhost:3333"

def test_get_health_returns_ok_status():
    url = f"{BASE_URL}/health"
    try:
        response = requests.get(url, timeout=30)
        assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
        json_data = response.json()
        assert "status" in json_data, "Response JSON missing 'status' key"
        assert json_data["status"] == "ok", f"Expected status 'ok', got {json_data['status']}"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_get_health_returns_ok_status()