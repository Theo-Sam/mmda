import os
import psycopg2
from dotenv import load_dotenv
import time

# --- Configuration ---
MIGRATIONS_DIR = 'migrations'

def get_db_connection():
    """Establishes a connection to the Supabase database."""
    try:
        conn_string = os.getenv('SUPABASE_DB_URL')
        if not conn_string:
            raise ValueError("SUPABASE_DB_URL environment variable not set.")
        
        print("Connecting to the database...")
        connection = psycopg2.connect(conn_string)
        print("✅ Connection successful.")
        return connection
    except psycopg2.Error as e:
        print(f"❌ Error connecting to the database: {e}")
        return None

def get_migration_files():
    """Finds and sorts all .sql migration files."""
    try:
        files = [f for f in os.listdir(MIGRATIONS_DIR) if f.endswith('.sql')]
        files.sort()
        print(f"Found {len(files)} migration files.")
        return files
    except FileNotFoundError:
        print(f"❌ Error: The '{MIGRATIONS_DIR}' directory was not found.")
        return []

def run_migrations():
    """Executes all migration scripts in the configured directory."""
    print("--- Starting Supabase Migration Script ---")
    load_dotenv()
    
    connection = None
    try:
        connection = get_db_connection()
        if connection is None:
            return

        cursor = connection.cursor()
        
        migration_files = get_migration_files()
        if not migration_files:
            print("No migration files to run. Exiting.")
            return

        for filename in migration_files:
            filepath = os.path.join(MIGRATIONS_DIR, filename)
            print(f"\nRunning migration: {filename}...")
            
            with open(filepath, 'r') as f:
                sql_script = f.read()
            
            try:
                cursor.execute(sql_script)
                connection.commit()
                print(f"✅ Successfully executed {filename}")
            except psycopg2.Error as e:
                print(f"❌ Error executing {filename}: {e}")
                print("Rolling back the current transaction.")
                connection.rollback()
                # Stop script on first error to prevent subsequent issues
                break 
            
            time.sleep(0.5) # Small delay between migrations

        cursor.close()

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        if connection:
            connection.close()
            print("\nDatabase connection closed.")
        print("--- Migration Script Finished ---")

if __name__ == '__main__':
    run_migrations() 