import requests

BASE_URL = "http://localhost:3333"
TIMEOUT = 30
HEADERS = {"Content-Type": "application/json"}

def test_postapiworkshopsvalidatesinput():
    url = f"{BASE_URL}/api/workshops"

    test_payloads = [
        # Missing scheduledAt
        {
            "title": "Workshop Without Date",
            "description": "A workshop missing scheduledAt",
            "capacity": 10
        },
        # Malformed scheduledAt (invalid date format)
        {
            "title": "Workshop With Bad Date",
            "description": "A workshop with malformed scheduledAt",
            "capacity": 10,
            "scheduledAt": "not-a-date"
        }
    ]

    for payload in test_payloads:
        try:
            response = requests.post(url, json=payload, headers=HEADERS, timeout=TIMEOUT)
        except requests.RequestException as e:
            assert False, f"Request failed: {e}"
        # Assert HTTP 400 Bad Request
        assert response.status_code == 400, f"Expected status 400 but got {response.status_code} for payload {payload}"
        # Assert response content type is JSON
        try:
            json_data = response.json()
        except ValueError:
            assert False, "Response is not valid JSON"
        # Assert it contains validation error info
        # Assuming ValidationErrorResponse has a structure including an 'error' or 'message' field
        error_fields = ['error', 'message', 'details']
        assert any(field in json_data for field in error_fields), f"Response JSON missing validation error details: {json_data}"

test_postapiworkshopsvalidatesinput()