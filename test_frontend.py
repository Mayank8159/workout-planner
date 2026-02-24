"""
Frontend Configuration Test
Tests frontend setup and API connectivity
"""
import os
import json


def test_frontend_config():
    """Test frontend configuration"""
    print("\n" + "="*60)
    print("  FRONTEND CONFIGURATION TEST")
    print("="*60 + "\n")
    
    # Check if required files exist
    frontend_dir = "frontend"
    
    files_to_check = [
        "package.json",
        "app.json",
        "utils/api.ts",
        "utils/istTimezone.ts",
        "context/UserContext.tsx",
        "components/ErrorBoundary.tsx",
    ]
    
    print("📁 Checking required files:")
    for file in files_to_check:
        path = os.path.join(frontend_dir, file)
        exists = os.path.exists(path)
        status = "✅" if exists else "❌"
        print(f"  {status} {file}")
    
    # Check app.json configuration
    print("\n📱 App Configuration:")
    try:
        with open(os.path.join(frontend_dir, "app.json"), "r") as f:
            config = json.load(f)
            expo = config.get("expo", {})
            
            print(f"  App Name: {expo.get('name')}")
            print(f"  Version: {expo.get('version')}")
            
            android = expo.get("android", {})
            print(f"  Android Package: {android.get('package')}")
            print(f"  Android Version Code: {android.get('versionCode')}")
            
            permissions = android.get("permissions", [])
            print(f"  Permissions: {', '.join(permissions)}")
            
            if "android.permission.INTERNET" in permissions:
                print("  ✅ Internet permission: Configured")
            else:
                print("  ❌ Internet permission: MISSING")
                
            print(f"  Uses Cleartext Traffic: {android.get('usesCleartextTraffic')}")
            
    except Exception as e:
        print(f"  ❌ Error reading app.json: {e}")
    
    # Check API configuration
    print("\n🌐 API Configuration:")
    try:
        with open(os.path.join(frontend_dir, "utils", "api.ts"), "r") as f:
            content = f.read()
            
            if "workout-planner-b8in.onrender.com" in content:
                print("  ✅ Production API URL: Configured")
            else:
                print("  ⚠️  Production API URL: Not found")
            
            if "istTimezone" in content or "getISTNow" in content:
                print("  ✅ IST Timezone: Integrated")
            else:
                print("  ⚠️  IST Timezone: Not integrated")
                
    except Exception as e:
        print(f"  ❌ Error reading api.ts: {e}")
    
    # Check package.json
    print("\n📦 Dependencies:")
    try:
        with open(os.path.join(frontend_dir, "package.json"), "r") as f:
            package = json.load(f)
            deps = package.get("dependencies", {})
            
            key_deps = ["expo", "react-native", "axios", "expo-camera", "expo-router"]
            for dep in key_deps:
                if dep in deps:
                    print(f"  ✅ {dep}: {deps[dep]}")
                else:
                    print(f"  ❌ {dep}: Missing")
                    
    except Exception as e:
        print(f"  ❌ Error reading package.json: {e}")
    
    print("\n" + "="*60)
    print("  Frontend configuration check complete!")
    print("="*60)


if __name__ == "__main__":
    test_frontend_config()
