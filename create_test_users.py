import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    print("Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# List of test users for all roles
roles = [
    ('super_admin', 'superadmin@test.com', 'Super Admin'),
    ('mmda_admin', 'mmdaadmin@test.com', 'MMDA Admin'),
    ('finance', 'finance@test.com', 'Finance Officer'),
    ('collector', 'collector@test.com', 'Collector'),
    ('auditor', 'auditor@test.com', 'Auditor'),
    ('business_owner', 'businessowner@test.com', 'Business Owner'),
    ('monitoring_body', 'monitoring@test.com', 'Monitoring Body'),
    ('business_registration_officer', 'registrationofficer@test.com', 'Registration Officer'),
    ('regional_admin', 'regionaladmin@test.com', 'Regional Admin'),
]

DEFAULT_PASSWORD = 'Test1234!'

def check_existing_users():
    """Check which users already exist"""
    print("Checking existing users...")
    existing_users = []
    
    try:
        # Check users table
        result = supabase.table("users").select('email, role').execute()
        if result.data:
            existing_users = [user['email'] for user in result.data]
            print(f"Found {len(existing_users)} existing users:")
            for user in result.data:
                print(f"  - {user['email']} ({user['role']})")
        else:
            print("No existing users found.")
    except Exception as e:
        print(f"Error checking existing users: {e}")
    
    return existing_users

def create_test_users():
    """Create test users if they don't exist"""
    existing_users = check_existing_users()
    
    print(f"\n{'='*50}")
    print("TEST USER CREATION SCRIPT")
    print("="*50)
    print(f"Default password for all users: {DEFAULT_PASSWORD}")
    print(f"Total roles to create: {len(roles)}")
    print(f"Existing users: {len(existing_users)}")
    
    # Ask for confirmation
    response = input("\nDo you want to create missing test users? (y/N): ").strip().lower()
    if response not in ['y', 'yes']:
        print("Operation cancelled.")
        return
    
    created_count = 0
    skipped_count = 0
    
    for role, email, name in roles:
        if email in existing_users:
            print(f"⏭️  Skipping {email} ({role}) - already exists")
            skipped_count += 1
            continue
            
        print(f"Creating user: {email} ({role}) ...")
        try:
            # 1. Create user in Supabase Auth
            user_resp = supabase.auth.admin.create_user({
                "email": email,
                "password": DEFAULT_PASSWORD,
                "email_confirm": True,
                "user_metadata": {
                    "role": role,
                    "name": name
                }
            })
            
            if hasattr(user_resp, 'user') and user_resp.user:
                user_id = user_resp.user.id
                print(f"  ✅ Auth user created with id: {user_id}")
                
                # 2. Insert profile in users table
                profile_resp = supabase.table("users").insert({
                    "id": user_id,
                    "email": email,
                    "name": name,
                    "role": role
                }).execute()
                
                if hasattr(profile_resp, 'data') and profile_resp.data:
                    print(f"  ✅ Profile inserted for {email}")
                    created_count += 1
                else:
                    print(f"  ❌ Failed to insert profile for {email}")
            else:
                print(f"  ❌ Failed to create auth user for {email}")
                
        except Exception as e:
            print(f"  ❌ Error creating {email}: {e}")
    
    print(f"\n{'='*50}")
    print("SUMMARY")
    print("="*50)
    print(f"✅ Created: {created_count} users")
    print(f"⏭️  Skipped: {skipped_count} users (already exist)")
    print(f"📧 Default password: {DEFAULT_PASSWORD}")
    print(f"🔐 Login at: {SUPABASE_URL}/auth")

if __name__ == "__main__":
    create_test_users() 