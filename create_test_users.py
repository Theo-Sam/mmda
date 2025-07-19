import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
SUPABASE_URL = os.getenv('SUPABASE_URL')
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

for role, email, name in roles:
    print(f"Creating user: {email} ({role}) ...")
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
        print(f"  Auth user created with id: {user_id}")
        # 2. Insert profile in users table
        profile_resp = supabase.table("users").insert({
            "id": user_id,
            "email": email,
            "name": name,
            "role": role
        }).execute()
        if hasattr(profile_resp, 'data') and profile_resp.data:
            print(f"  Profile inserted for {email}")
        else:
            print(f"  Failed to insert profile for {email}: {profile_resp}")
    else:
        print(f"  Failed to create auth user for {email}: {user_resp}")

print("\nAll test users processed.")
print("Default password for all test users is:", DEFAULT_PASSWORD) 