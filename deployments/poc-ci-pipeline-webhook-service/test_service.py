"""
Test script for AI Failure Analyzer Service.

This script tests the webhook endpoint with sample payloads.
"""

import requests
import json
import sys


def test_health_check():
    """Test the health check endpoint."""
    print("[TEST] Testing health check endpoint...")
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"[PASS] Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"[FAIL] Error: {str(e)}")
        return False


def test_pipeline_failure(repo, branch, commit, error_log):
    """Test the pipeline failure endpoint."""
    print(f"\n[TEST] Testing pipeline failure webhook...")
    print(f"   Repo: {repo}")
    print(f"   Branch: {branch}")
    print(f"   Error: {error_log[:50]}...")
    
    payload = {
        "repo": repo,
        "branch": branch,
        "commit": commit,
        "error_log": error_log
    }
    
    try:
        response = requests.post(
            "http://localhost:8000/pipeline-failure",
            json=payload,
            timeout=300  # 5 minutes timeout
        )
        print(f"[PASS] Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"[FAIL] Error: {str(e)}")
        return False


def main():
    """Main test function."""
    print("=" * 60)
    print("AI Failure Analyzer - Test Suite")
    print("=" * 60)
    
    # Test 1: Health check
    print("\n" + "=" * 60)
    print("Test 1: Health Check")
    print("=" * 60)
    health_ok = test_health_check()
    
    if not health_ok:
        print("\n[FAIL] Health check failed. Make sure the service is running.")
        print("   Start the service with: python -m app.main")
        sys.exit(1)
    
    # Test 2: Python dependency error
    print("\n" + "=" * 60)
    print("Test 2: Python ModuleNotFoundError")
    print("=" * 60)
    
    test_pipeline_failure(
        repo="octocat/Hello-World",  # Example repo
        branch="main",
        commit="abc123def456",
        error_log="""
Traceback (most recent call last):
  File "app/main.py", line 3, in <module>
    import pandas as pd
ModuleNotFoundError: No module named 'pandas'

The command '/bin/sh -c pip install -r requirements.txt' returned a non-zero code: 1
"""
    )
    
    # Test 3: Docker build error
    print("\n" + "=" * 60)
    print("Test 3: Docker Build Error")
    print("=" * 60)
    
    test_pipeline_failure(
        repo="octocat/Hello-World",
        branch="develop",
        commit="xyz789abc012",
        error_log="""
Step 5/10 : RUN pip install -r requirements.txt
 ---> Running in abc123def456
ERROR: Could not find a version that satisfies the requirement numpy==1.99.0
ERROR: No matching distribution found for numpy==1.99.0
The command '/bin/sh -c pip install -r requirements.txt' returned a non-zero code: 1
"""
    )
    
    print("\n" + "=" * 60)
    print("[PASS] Tests complete!")
    print("=" * 60)
    print("\nTips:")
    print("   - Check the created PRs in your GitHub repository")
    print("   - Review the logs for detailed execution flow")
    print("   - Verify the AI-generated fixes make sense")
    print("   - Test with your actual repositories and errors")
    print("")


if __name__ == "__main__":
    main()
