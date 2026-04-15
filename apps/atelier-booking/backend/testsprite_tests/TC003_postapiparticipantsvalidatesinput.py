import requests

BASE_URL = "http://localhost:3333"

def test_post_api_participants_validates_input():
    url = f"{BASE_URL}/api/participants"
    headers = {"Content-Type": "application/json"}
    # Missing required field 'email'
    payload = {
        "name": "John Doe"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        assert response.status_code == 400, f"Expected status code 400, got {response.status_code}"
        json_response = response.json()
        # ValidationErrorResponse typically includes information about validation errors
        assert isinstance(json_response, dict), "Response should be a JSON object"
        # Assert some key that typically appears in validation error responses
        validation_keys = ["error", "message", "details", "errors"]
        assert any(key in json_response for key in validation_keys), "Validation error response missing expected keys"
    except requests.RequestException as e:
        assert False, f"HTTP request failed: {e}"

test_post_api_participants_validates_input()