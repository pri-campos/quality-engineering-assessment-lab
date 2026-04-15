import requests
import random
import string

BASE_URL = "http://localhost:3333"
PARTICIPANTS_ENDPOINT = f"{BASE_URL}/api/participants"
TIMEOUT = 30

def test_postapiparticipantsrejectsduplicateemail():
    headers = {"Content-Type": "application/json"}
    random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    email = f"duplicate_email_test_{random_suffix}@example.com"
    first_participant = {
        "name": "Test User",
        "email": email
    }
    try:
        # Create participant with unique email
        response_create = requests.post(
            PARTICIPANTS_ENDPOINT, json=first_participant, headers=headers, timeout=TIMEOUT
        )
        assert response_create.status_code == 201, f"Expected 201 but got {response_create.status_code}"
        json_create = response_create.json()
        assert json_create.get("email") == email, "Email in response does not match"

        # Attempt to create another participant with the same email
        duplicate_participant = {
            "name": "Another User",
            "email": email
        }
        response_duplicate = requests.post(
            PARTICIPANTS_ENDPOINT, json=duplicate_participant, headers=headers, timeout=TIMEOUT
        )
        assert response_duplicate.status_code == 409, f"Expected 409 but got {response_duplicate.status_code}"
        json_dup = response_duplicate.json()
        # Check for error message indicating duplicate email presence
        error_message = json_dup.get("message") or json_dup.get("error") or ""
        assert "duplicate" in error_message.lower() or "email" in error_message.lower(), \
            "Error message does not indicate duplicate email"
    finally:
        # Cleanup: delete created participant if created
        if 'json_create' in locals() and "id" in json_create:
            participant_id = json_create["id"]
            try:
                requests.delete(f"{PARTICIPANTS_ENDPOINT}/{participant_id}", timeout=TIMEOUT)
            except Exception:
                pass

test_postapiparticipantsrejectsduplicateemail()
