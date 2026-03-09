"""
Test script to validate the webhook endpoint locally
"""
import requests
import json
import time

# Test payload similar to what Grafana would send
test_payload = {
    "repo": "VikumChathuranga22434/MLOps",
    "branch": "main", 
    "commit": "abc123def456",
    "error_log": """
Traceback (most recent call last):
  File "/app/train.py", line 5, in <module>
    import pandas as pd
ModuleNotFoundError: No module named 'pandas'
"""
}

def test_health_endpoint():
    """Test the health check endpoint"""
    try:
        response = requests.get("http://127.0.0.1:8000/health", timeout=5)
        print(f"[PASS] Health Check Status: {response.status_code}")
        print(f"  Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"[FAIL] Health Check Failed: {e}")
        return False

def test_webhook_endpoint():
    """Test the webhook endpoint with mock data"""
    try:
        response = requests.post(
            "http://127.0.0.1:8000/pipeline-failure",
            json=test_payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        print(f"\n[PASS] Webhook Status: {response.status_code}")
        print(f"  Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code in [200, 202]
    except Exception as e:
        print(f"\n[FAIL] Webhook Failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("AI Failure Analyzer Webhook - Local Test")
    print("=" * 60)
    
    # Wait for server to start
    print("\nWaiting for server to start...")
    time.sleep(2)
    
    # Test health endpoint
    print("\n1. Testing Health Endpoint...")
    health_ok = test_health_endpoint()
    
    if health_ok:
        print("\n2. Testing Webhook Endpoint...")
        print("\nNote: This will NOT create actual PRs (using mock data)")
        webhook_ok = test_webhook_endpoint()
        
        if webhook_ok:
            print("\n" + "=" * 60)
            print("[PASS] ALL TESTS PASSED")
            print("=" * 60)
        else:
            print("\n" + "=" * 60)
            print("[FAIL] WEBHOOK TEST FAILED")
            print("=" * 60)
    else:
        print("\n" + "=" * 60)
        print("[FAIL] HEALTH CHECK FAILED - Server may not be running")
        print("=" * 60)
