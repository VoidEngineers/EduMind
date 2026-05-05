"""Test script for Alert-to-Issue Webhook Service."""

import requests
import json
import sys
import os
import hmac
import hashlib
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_URL = "http://localhost:8000"
ORG_IN_GITHUB = os.getenv("ORG_IN_GITHUB", "your-org")
TEST_REPO = f"{ORG_IN_GITHUB}/dummy-testing-repo"
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "")


def _build_signature(payload_json: str) -> str:
    if not WEBHOOK_SECRET:
        return ""
    return hmac.new(
        WEBHOOK_SECRET.encode(),
        payload_json.encode(),
        hashlib.sha256,
    ).hexdigest()


def _post_grafana_alert(payload: dict) -> requests.Response:
    payload_json = json.dumps(payload, separators=(",", ":"))
    headers = {"Content-Type": "application/json"}
    signature = _build_signature(payload_json)
    if signature:
        headers["X-Webhook-Signature"] = signature

        # f"{BASE_URL}/webhook/grafana",
    return requests.post(
        f"{BASE_URL}/create-issue",
        data=payload_json,
        headers=headers,
        timeout=60,
    )


def _webhook_success(response: requests.Response, result: dict) -> bool:
    """True when the handler completed and created an issue."""
    return response.status_code == 200 and result.get("status") == "success"


def _webhook_validation_error(response: requests.Response, result: dict) -> bool:
    """True when validation failed but the HTTP response is OK (expected for bad payloads)."""
    return response.status_code == 200 and result.get("status") == "error"


def test_health():
    """Test health endpoint."""
    print("[TEST] Health Check")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Configuration: {json.dumps(result.get('configuration'), indent=2)}")
        print()
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {str(e)}\n")
        return False


def test_alert_missing_dependency():
    """Test alert with missing dependency error."""
    print("[TEST] Alert: Missing Dependency")
    print("-" * 70)
    
    payload = {
        "status": "alerting",
        "title": "Pipeline Failure Alert",
        "message": "Build failed with ModuleNotFoundError",
        "ruleName": "CI Pipeline Failure",
        "commonAnnotations": {
            "description": "Pipeline failed during dependency installation",
            "error_log": "ModuleNotFoundError: No module named 'pandas'\n  File 'main.py', line 42, in run()",
            "repo": TEST_REPO,
            "service_name": "data-processor",
            "environment": "production"
        },
        "commonLabels": {
            "severity": "critical"
        },
        "evalMatches": []
    }
    
    try:
        response = _post_grafana_alert(payload)
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Message: {result.get('message', '')}")
        if result.get("status") == "success":
            print(f"Issue URL: {result['issue_url']}")
            print(f"Issue #: {result['issue_number']}")
        else:
            print(f"Error: {result.get('error', 'Unknown error')}")
        print()
        return _webhook_success(response, result)
    except Exception as e:
        print(f"Request Error: {str(e)}\n")
        return False


def test_alert_import_error():
    """Test alert with import error."""
    print("[TEST] Alert: Import Error")
    print("-" * 70)
    
    payload = {
        "status": "alerting",
        "title": "Runtime Error Alert",
        "message": "Application failed to start",
        "ruleName": "Service Startup Failed",
        "commonAnnotations": {
            "error_log": "ImportError: cannot import name 'config' from 'app.settings' (unknown location)",
            "repo": TEST_REPO,
            "service_name": "api-gateway",
            "environment": "staging"
        },
        "commonLabels": {
            "severity": "high"
        },
        "evalMatches": []
    }
    
    try:
        response = _post_grafana_alert(payload)
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Message: {result.get('message', '')}")
        if result.get("status") == "success":
            print(f"Issue URL: {result['issue_url']}")
        else:
            print(f"Error: {result.get('error', 'Unknown error')}")
        print()
        return _webhook_success(response, result)
    except Exception as e:
        print(f"Request Error: {str(e)}\n")
        return False


def test_alert_docker_build_error():
    """Test alert with Docker build error."""
    print("[TEST] Alert: Docker Build Error")
    print("-" * 70)
    
    payload = {
        "status": "alerting",
        "ruleName": "Docker Build Failed",
        "commonAnnotations": {
            "error_log": """Step 5/10 : RUN pip install -r requirements.txt
ERROR: Could not find a version that satisfies the requirement numpy==99.0.0
ERROR: No matching distribution found for numpy==99.0.0""",
            "repo": TEST_REPO,
            "service_name": "ml-pipeline",
            "environment": "production"
        },
        "commonLabels": {
            "severity": "critical"
        },
        "evalMatches": []
    }
    
    try:
        response = _post_grafana_alert(payload)
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Message: {result.get('message', '')}")
        if result.get("status") == "success":
            print(f"Issue URL: {result['issue_url']}")
        else:
            print(f"Error: {result.get('error', 'Unknown error')}")
        print()
        return _webhook_success(response, result)
    except Exception as e:
        print(f"Request Error: {str(e)}\n")
        return False


def test_alert_syntax_error():
    """Test alert with syntax error."""
    print("[TEST] Alert: Syntax Error")
    print("-" * 70)
    
    payload = {
        "status": "alerting",
        "ruleName": "Syntax Error",
        "commonAnnotations": {
            "error_log": "SyntaxError: invalid syntax at line 42 in main.py\n  print('missing closing quote)",
            "repo": TEST_REPO,
            "service_name": "backend-service",
            "environment": "development"
        },
        "commonLabels": {
            "severity": "high"
        },
        "evalMatches": []
    }
    
    try:
        response = _post_grafana_alert(payload)
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Message: {result.get('message', '')}")
        if result.get("status") == "success":
            print(f"Issue URL: {result['issue_url']}")
        else:
            print(f"Error: {result.get('error', 'Unknown error')}")
        print()
        return _webhook_success(response, result)
    except Exception as e:
        print(f"Request Error: {str(e)}\n")
        return False


def test_alert_missing_repo():
    """Test alert without required repo field (should fail)."""
    print("[TEST] Alert: Missing Repo (should fail)")
    print("-" * 70)
    
    payload = {
        "status": "alerting",
        "ruleName": "Test Alert",
        "commonAnnotations": {
            "error_log": "Some error occurred",
            # Missing required 'repo' field
            "service_name": "test-service"
        },
        "evalMatches": []
    }
    
    try:
        response = _post_grafana_alert(payload)
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Message: {result.get('message', '')}")
        print(f"Error: {result.get('error', 'N/A')}")
        print()
        err = (result.get("error") or "").lower()
        return _webhook_validation_error(response, result) and "repo" in err
    except Exception as e:
        print(f"Request Error: {str(e)}\n")
        return False


def test_create_issue_simple():
    """Test create-issue endpoint with summary and error_details."""
    print("[TEST] Create Issue: Simple Payload")
    print("-" * 70)

    payload = {
        "summary": "Pipeline failure: test case",
        "error_details": "ValidationError: dummy failure in pipeline stage",
        "repo": TEST_REPO,
        "service_name": "ci-runner",
        "environment": "staging",
        "severity": "high",
    }

    try:
        response = _post_grafana_alert(payload)
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Message: {result.get('message', '')}")
        if result.get("status") == "success":
            print(f"Issue URL: {result['issue_url']}")
            print(f"Issue #: {result['issue_number']}")
        else:
            print(f"Error: {result.get('error', 'Unknown error')}")
        print()
        return _webhook_success(response, result)
    except Exception as e:
        print(f"Request Error: {str(e)}\n")
        return False


if __name__ == "__main__":
    print("=" * 70)
    print("Alert-to-Issue Webhook Service - Test Suite")
    print("=" * 70)
    print(f"\nTest Repository: {TEST_REPO}")
    print("Make sure the service is running:")
    print("   python -m app.main\n")
    
    # Test health
    print("=" * 70)
    print("TEST 1: Health Check")
    print("=" * 70)
    health_ok = test_health()
    
    if not health_ok:
        print("[FAIL] Health check failed. Is the service running?")
        print("Start with: python -m app.main")
        sys.exit(1)
    
    # Run alert tests
    print("=" * 70)
    print("ALERT TESTS")
    print("=" * 70 + "\n")
    
    test_results = []
    
    # print("TEST 2: Missing Dependency Error")
    # test_results.append(("Missing Dependency", test_alert_missing_dependency()))

    print("TEST 3: Create Issue (Simple Payload)")
    test_results.append(("Create Issue Simple", test_create_issue_simple()))
    
    # print("TEST 3: Import Error")
    # test_results.append(("Import Error", test_alert_import_error()))
    
    # print("TEST 4: Docker Build Error")
    # test_results.append(("Docker Build Error", test_alert_docker_build_error()))
    
    # print("TEST 5: Syntax Error")
    # test_results.append(("Syntax Error", test_alert_syntax_error()))
    
    # print("TEST 6: Missing Repo Field (should fail validation)")
    # test_results.append(("Missing Repo", test_alert_missing_repo()))
    
    # Summary
    print("=" * 70)
    print("Test Summary")
    print("=" * 70)
    
    passed = sum(1 for _, result in test_results if result)
    total = len(test_results)
    
    for name, result in test_results:
        status = "PASS" if result else "FAIL"
        print(f"  {name}: {status}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\nAll tests completed successfully!")
        print("\nNext steps:")
        print("   1. Check created issues in your GitHub repository")
        print("   2. Review the service logs for detailed execution")
        print("   3. Configure Grafana to send real alerts")
        print("   4. Monitor the service for production use")
    else:
        print(f"\n{total - passed} test(s) failed. Check the output above.")
    
    print("=" * 70)
