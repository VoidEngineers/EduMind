"""Test script for Self-Healing Webhook Service."""

import requests
import json
import sys
import hmac
import hashlib
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

BASE_URL = "http://localhost:8000"
YOUR_REPO = "VikumChathuranga22434/dummy-testing-repo"
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "")


def test_health():
    """Test health endpoint."""
    print("[TEST] Health Check")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}\n")
    return response.status_code == 200


def test_grafana_webhook_custom(error_log, repo, branch, rule_name):
    """Test Grafana webhook with custom parameters."""
    print(f"[TEST] Grafana - {rule_name}")
    print(f"   Error: {error_log[:60]}...")
    print(f"   Repo: {repo}, Branch: {branch}")
    
    payload = {
        "status": "alerting",
        "title": "Pipeline Failure",
        "message": "Build failed",
        "ruleName": rule_name,
        "commonAnnotations": {
            "description": "Pipeline alert",
            "error_log": error_log,
            "repo": repo,
            "branch": branch
        },
        "commonLabels": {
            "severity": "critical"
        },
        "evalMatches": []
    }
    
    # Create HMAC signature - use same format as requests library
    headers = {}
    if WEBHOOK_SECRET:
        # Use compact separators to match requests library format
        payload_bytes = json.dumps(payload, separators=(',', ':')).encode()
        signature = hmac.new(
            WEBHOOK_SECRET.encode(),
            payload_bytes,
            hashlib.sha256
        ).hexdigest()
        headers["X-Webhook-Signature"] = signature
        print(f"   Signature: {signature[:20]}...")
    else:
        print(f"   Warning: No WEBHOOK_SECRET configured")
    
    try:
        response = requests.post(
            f"{BASE_URL}/webhook/grafana",
            json=payload,
            headers=headers,
            timeout=300
        )
        print(f"   Status: {response.status_code}")
        result = response.json()
        if result['status'] == 'success':
            print(f"   PR Created: {result['pr_url']}")
        else:
            print(f"   Error: {result['error'][:80]}")
        print()
        return response.status_code == 200
    except Exception as e:
        print(f"   Request Error: {str(e)}\n")
        return False


def test_generic_webhook_custom(repo, branch, error_log, commit):
    """Test generic webhook with custom parameters."""
    print(f"[TEST] Generic - {repo}")
    print(f"   Error: {error_log[:60]}...")
    print(f"   Branch: {branch}, Commit: {commit}")
    
    payload = {
        "repo": repo,
        "branch": branch,
        "error_log": error_log,
        "commit": commit
    }
    
    # Create HMAC signature - use same format as requests library
    headers = {}
    if WEBHOOK_SECRET:
        # Use compact separators to match requests library format
        payload_bytes = json.dumps(payload, separators=(',', ':')).encode()
        signature = hmac.new(
            WEBHOOK_SECRET.encode(),
            payload_bytes,
            hashlib.sha256
        ).hexdigest()
        headers["X-Webhook-Signature"] = signature
        print(f"   Signature: {signature[:20]}...")
    else:
        print(f"   Warning: No WEBHOOK_SECRET configured")
    
    try:
        response = requests.post(
            f"{BASE_URL}/webhook/generic",
            json=payload,
            headers=headers,
            timeout=300
        )
        print(f"   Status: {response.status_code}")
        result = response.json()
        if result['status'] == 'success':
            print(f"   PR Created: {result['pr_url']}")
        else:
            print(f"   Error: {result['error'][:80]}")
        print()
        return response.status_code == 200
    except Exception as e:
        print(f"   Request Error: {str(e)}\n")
        return False


def test_webhook_with_signature(repo, branch, error_log, secret_key):
    """Test webhook with HMAC signature verification."""
    print(f"[TEST] Webhook with Signature - {repo}")
    print(f"   Secret: {secret_key[:20]}...")
    
    payload = {
        "repo": repo,
        "branch": branch,
        "error_log": error_log,
        "commit": "sig123"
    }
    
    # Create HMAC signature - use same format as requests library
    payload_bytes = json.dumps(payload, separators=(',', ':')).encode()
    signature = hmac.new(
        secret_key.encode(),
        payload_bytes,
        hashlib.sha256
    ).hexdigest()
    
    try:
        response = requests.post(
            f"{BASE_URL}/webhook/generic",
            json=payload,
            headers={"X-Webhook-Signature": signature},
            timeout=300
        )
        print(f"   Status: {response.status_code}")
        result = response.json()
        if result['status'] == 'success':
            print(f"   Signature verified! PR: {result['pr_url']}")
        else:
            print(f"   Error: {result['error'][:80]}")
        print()
    except Exception as e:
        print(f"   Request Error: {str(e)}\n")

if __name__ == "__main__":
    print("=" * 70)
    print("Self-Healing Webhook Service - Enhanced Test Suite")
    print("=" * 70)
    print(f"\nRepository: {YOUR_REPO}")
    print("Make sure the service is running:")
    print("   python -m app.main\n")
    
    # Test 1: Health Check
    print("=" * 70)
    print("TEST 1: Health Check")
    print("=" * 70)
    health_ok = test_health()
    
    if not health_ok:
        print("[FAIL] Health check failed. Is the service running?")
        print("Start with: python -m app.main")
        sys.exit(1)
    
    # Test 2-6: Error Scenarios using Grafana Webhook
    print("=" * 70)
    print("SCENARIO TESTS - Grafana Webhook")
    print("=" * 70 + "\n")
    
    print("TEST 2: Missing Python Dependency")
    print("-" * 70)
    test_grafana_webhook_custom(
        error_log="ModuleNotFoundError: No module named 'pandas'",
        repo=YOUR_REPO,
        branch="main",
        rule_name="Missing Dependency Alert"
    )
    
    print("TEST 3: Import Error")
    print("-" * 70)
    test_grafana_webhook_custom(
        error_log="ImportError: cannot import name 'config' from 'app.settings'",
        repo=YOUR_REPO,
        branch="develop",
        rule_name="Import Error Alert"
    )
    
    print("TEST 4: Docker Build Error")
    print("-" * 70)
    test_grafana_webhook_custom(
        error_log="""Step 5/10 : RUN pip install -r requirements.txt
ERROR: Could not find a version that satisfies the requirement numpy==99.0.0
ERROR: No matching distribution found for numpy==99.0.0""",
        repo=YOUR_REPO,
        branch="main",
        rule_name="Docker Build Failed"
    )
    
    print("TEST 5: Dependency Version Conflict")
    print("-" * 70)
    test_grafana_webhook_custom(
        error_log="pkg_resources.VersionConflict: (requests 2.25.0, Requirement.parse('requests>=2.28.0'))",
        repo=YOUR_REPO,
        branch="feature/new-api",
        rule_name="Version Conflict Alert"
    )
    
    print("TEST 6: Syntax Error")
    print("-" * 70)
    test_grafana_webhook_custom(
        error_log="SyntaxError: invalid syntax at line 42 in main.py",
        repo=YOUR_REPO,
        branch="bugfix/syntax",
        rule_name="Syntax Error Alert"
    )
    
    # Test 7-10: Generic Webhook Tests
    print("\n" + "=" * 70)
    print("SCENARIO TESTS - Generic Webhook")
    print("=" * 70 + "\n")
    
    print("TEST 7: Missing Flask Package")
    print("-" * 70)
    test_generic_webhook_custom(
        repo=YOUR_REPO,
        branch="main",
        error_log="ModuleNotFoundError: No module named 'flask'",
        commit="abc123"
    )
    
    print("TEST 8: Type Error")
    print("-" * 70)
    test_generic_webhook_custom(
        repo=YOUR_REPO,
        branch="develop",
        error_log="TypeError: expected string or bytes-like object, got int",
        commit="def456"
    )
    
    print("TEST 9: Missing Django Settings")
    print("-" * 70)
    test_generic_webhook_custom(
        repo=YOUR_REPO,
        branch="feature/django",
        error_log="ImproperlyConfigured: Requested setting DATABASES, but settings are not configured",
        commit="ghi789"
    )
    
    print("TEST 10: Runtime Error")
    print("-" * 70)
    test_generic_webhook_custom(
        repo=YOUR_REPO,
        branch="main",
        error_log="RuntimeError: Event loop is closed",
        commit="jkl012"
    )
    
    # Test 11: Signature Verification (Optional)
    print("\n" + "=" * 70)
    print("ADVANCED TEST - Webhook Signature Verification")
    print("=" * 70 + "\n")
    
    print("TEST 11: HMAC Signature Verification")
    print("-" * 70)
    print("[INFO] Note: Signature verification only works if WEBHOOK_SECRET is set in .env")
    test_webhook_with_signature(
        repo=YOUR_REPO,
        branch="main",
        error_log="ModuleNotFoundError: No module named 'requests'",
        secret_key="test-webhook-secret-key-12345"
    )
    
    # Summary
    print("=" * 70)
    print("All tests completed!")
    print("=" * 70)
    print("\nNext steps:")
    print("   1. Check created PRs in your GitHub repository")
    print("   2. Review the service logs for detailed execution")
    print("   3. Modify YOUR_REPO variable to test with different repos")
    print("   4. Add more error scenarios as needed")
    print("   5. Configure webhook signature if needed (WEBHOOK_SECRET in .env)")
    print("\nTo test custom errors, modify the test functions with:")
    print("   - Different error messages")
    print("   - Different branches")
    print("   - Different repositories")
    print("")
