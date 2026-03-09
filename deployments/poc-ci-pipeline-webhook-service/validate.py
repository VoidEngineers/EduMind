"""
Comprehensive validation script for AI Failure Analyzer Webhook Service
Tests each module independently without requiring external services
"""
import sys
import os
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent))

def test_imports():
    """Test all module imports"""
    print("=" * 70)
    print("TEST 1: Module Imports")
    print("=" * 70)
    
    modules = [
        "app.config",
        "app.models",
        "app.error_parser",
        "app.repo_service",
        "app.llm_service",
        "app.patch_service",
        "app.github_service",
        "app.main"
    ]
    
    for module in modules:
        try:
            __import__(module)
            print(f"[PASS] {module}")
        except Exception as e:
            print(f"[FAIL] {module}: {e}")
            return False
    
    print()
    return True

def test_config():
    """Test configuration loading and validation"""
    print("=" * 70)
    print("TEST 2: Configuration")
    print("=" * 70)
    
    try:
        from app.config import Config
        config = Config()
        config.validate()
        
        print(f"[PASS] Configuration loaded successfully")
        print(f"  - OpenAI Model: {config.OPENAI_MODEL}")
        print(f"  - Service Port: {config.SERVICE_PORT}")
        print(f"  - Clone Directory: {config.CLONE_DIRECTORY}")
        print(f"  - Log Level: {config.LOG_LEVEL}")
        print(f"  - GitHub Org: {config.GITHUB_ORG or '(Personal Account)'}")
        print(f"  - Max Files to Modify: {config.MAX_FILES_TO_MODIFY}")
        print()
        return True
    except Exception as e:
        print(f"[FAIL] Configuration failed: {e}")
        print()
        return False

def test_models():
    """Test Pydantic models"""
    print("=" * 70)
    print("TEST 3: Pydantic Models")
    print("=" * 70)
    
    try:
        from app.models import WebhookPayload, ParsedError, LLMResponse
        
        # Test WebhookPayload
        payload = WebhookPayload(
            repo="user/repo",
            branch="main",
            commit="abc123",
            error_log="ModuleNotFoundError: No module named 'pandas'"
        )
        print(f"[PASS] WebhookPayload validation")
        
        # Test ParsedError
        error = ParsedError(
            error_type="ModuleNotFoundError",
            missing_module="pandas",
            file_path="/app/train.py",
            line_number=5,
            full_traceback="..."
        )
        print(f"[PASS] ParsedError validation")
        
        # Test LLMResponse
        llm_response = LLMResponse(
            root_cause="Missing pandas dependency",
            files_to_modify=["requirements.txt"],
            patch="+ pandas==2.0.0",
            summary="Added pandas to requirements"
        )
        print(f"[PASS] LLMResponse validation")
        print()
        return True
    except Exception as e:
        print(f"[FAIL] Model validation failed: {e}")
        print()
        return False

def test_error_parser():
    """Test error parsing functionality"""
    print("=" * 70)
    print("TEST 4: Error Parser")
    print("=" * 70)
    
    try:
        from app.error_parser import ErrorParser
        
        test_logs = [
            {
                "log": """
Traceback (most recent call last):
  File "/app/train.py", line 5, in <module>
    import pandas as pd
ModuleNotFoundError: No module named 'pandas'
                """,
                "expected_module": "pandas"
            },
            {
                "log": """
Traceback (most recent call last):
  File "/app/api.py", line 10, in <module>
    from sklearn.model_selection import train_test_split
ModuleNotFoundError: No module named 'sklearn'
                """,
                "expected_module": "sklearn"
            }
        ]
        
        parser = ErrorParser()
        
        for i, test in enumerate(test_logs, 1):
            result = parser.parse(test["log"])
            if result.missing_module == test["expected_module"]:
                print(f"[PASS] Test case {i}: Detected missing module '{result.missing_module}'")
            else:
                print(f"[FAIL] Test case {i}: Expected '{test['expected_module']}', got '{result.missing_module}'")
                return False
        
        print()
        return True
    except Exception as e:
        print(f"[FAIL] Error parser failed: {e}")
        import traceback
        traceback.print_exc()
        print()
        return False

def test_fastapi_app():
    """Test FastAPI application initialization"""
    print("=" * 70)
    print("TEST 5: FastAPI Application")
    print("=" * 70)
    
    try:
        from app.main import app
        from fastapi.testclient import TestClient
        
        # Note: TestClient may not be available, so we'll do basic checks
        print(f"[PASS] FastAPI app created successfully")
        print(f"  - App title: {app.title}")
        print(f"  - Routes: {[route.path for route in app.routes]}")
        print()
        return True
    except ImportError:
        # TestClient not available,just check app loads
        from app.main import app
        print(f"[PASS] FastAPI app created successfully")
        print(f"  - App title: {app.title}")
        print(f"  - Note: Install 'httpx' for full testing")
        print()
        return True
    except Exception as e:
        print(f"[FAIL] FastAPI app failed: {e}")
        import traceback
        traceback.print_exc()
        print()
        return False

def test_api_endpoint_schema():
    """Test API endpoint exists and has correct schema"""
    print("=" * 70)
    print("TEST 6: API Endpoints")
    print("=" * 70)
    
    try:
        from app.main import app
        
        # Check if endpoints exist
        routes = {route.path: route for route in app.routes}
        
        required_endpoints = ["/health", "/pipeline-failure"]
        
        for endpoint in required_endpoints:
            if endpoint in routes:
                methods = [method for method in routes[endpoint].methods] if hasattr(routes[endpoint], 'methods') else []
                print(f"[PASS] Endpoint '{endpoint}' exists {methods}")
            else:
                print(f"[FAIL] Endpoint '{endpoint}' not found")
                return False
        
        print()
        return True
    except Exception as e:
        print(f"[FAIL] Endpoint check failed: {e}")
        print()
        return False

def main():
    """Run all validation tests"""
    print("\n")
    print("=" * 70)
    print("AI FAILURE ANALYZER - VALIDATION SUITE")
    print("=" * 70)
    print()
    
    tests = [
        ("Module Imports", test_imports),
        ("Configuration", test_config),
        ("Pydantic Models", test_models),
        ("Error Parser", test_error_parser),
        ("FastAPI App", test_fastapi_app),
        ("API Endpoints", test_api_endpoint_schema)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"[FAIL] {test_name} crashed: {e}")
            import traceback
            traceback.print_exc()
            results.append((test_name, False))
    
    # Summary
    print("=" * 70)
    print("VALIDATION SUMMARY")
    print("=" * 70)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "[PASS]" if result else "[FAIL]"
        print(f"{status}: {test_name}")
    
    print()
    print(f"Results: {passed}/{total} tests passed")
    print("=" * 70)
    
    if passed == total:
        print("\n[PASS] ALL VALIDATIONS PASSED - Service is ready for deployment!")
        return 0
    else:
        print(f"\n[FAIL] {total - passed} validation(s) failed - Please review errors above")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
