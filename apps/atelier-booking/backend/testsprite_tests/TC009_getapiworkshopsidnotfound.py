import requests

BASE_URL = "http://localhost:3333"
TIMEOUT = 30

def test_get_api_workshops_id_not_found():
    non_existent_id = "nonexistent-workshop-id-12345"
    url = f"{BASE_URL}/api/workshops/{non_existent_id}"

    try:
        response = requests.get(url, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 404, f"Expected status code 404, got {response.status_code}"

    try:
        json_data = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    # Expecting an error response for 404, typically containing a message
    assert isinstance(json_data, dict), "Response JSON should be a dictionary"
    assert "message" in json_data or "error" in json_data, "Error response should contain 'message' or 'error' key"


test_get_api_workshops_id_not_found()