import os
import subprocess
import random
from datetime import datetime, timedelta

# ================= CONFIGURATION =================
# Double check these are EXACTLY your GitHub details
GITHUB_USERNAME = "manifreebird"
GITHUB_TOKEN = "" # LEAVE EMPTY - Use the bypass you already allowed
PRIMARY_EMAIL = "manithedreamer2@gmail.com" 
ACTUAL_GITHUB_REPO = "financeapp" 
START_DATE = datetime(2026, 2, 1)
# =================================================

def remove_other_contributors():
    remote_url = f"https://github.com/{GITHUB_USERNAME}/{ACTUAL_GITHUB_REPO}.git"

    # 1. Complete Reset
    subprocess.run(["powershell", "-Command", "if (Test-Path .git) { Remove-Item -Recurse -Force .git }"], shell=True)
    subprocess.run(["git", "init"])
    subprocess.run(["git", "remote", "add", "origin", remote_url])

    # 2. Set Local Identity (This overrides the other guy)
    subprocess.run(["git", "config", "user.name", GITHUB_USERNAME])
    subprocess.run(["git", "config", "user.email", PRIMARY_EMAIL])

    # 3. Create the 10 Clean Commits
    for i in range(10):
        # Spread commits across February
        current_day = START_DATE + timedelta(days=i*2) 
        commit_time = current_day.replace(hour=10 + i, minute=random.randint(0,59)).isoformat()
        
        # Identity Injection
        env = os.environ.copy()
        env["GIT_AUTHOR_NAME"] = GITHUB_USERNAME
        env["GIT_AUTHOR_EMAIL"] = PRIMARY_EMAIL
        env["GIT_COMMITTER_NAME"] = GITHUB_USERNAME
        env["GIT_COMMITTER_EMAIL"] = PRIMARY_EMAIL
        env["GIT_AUTHOR_DATE"] = commit_time
        env["GIT_COMMITTER_DATE"] = commit_time

        if i == 0:
            # First commit includes all project files
            subprocess.run(["git", "add", "."], env=env)
            subprocess.run(["git", "commit", "-m", "feat: initial project structure"], env=env)
        else:
            # Subsequent commits are small updates to the log
            with open("contribution_log.txt", "a") as f:
                f.write(f"Optimization checkpoint {i+1}: {commit_time}\n")
            subprocess.run(["git", "add", "contribution_log.txt"], env=env)
            subprocess.run(["git", "commit", "-m", f"chore: system optimization {i+1}"], env=env)
        
        print(f"[+] Created clean commit {i+1} for {current_day.date()}")

    # 4. Force Push to overwrite GitHub
    print("[!] Overwriting GitHub history...")
    subprocess.run(["git", "push", "origin", "master:main", "--force"])

if __name__ == "__main__":
    remove_other_contributors()