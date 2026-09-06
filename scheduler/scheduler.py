import os

import requests
from dotenv import load_dotenv
from apscheduler.schedulers.blocking import BlockingScheduler

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL")
print(BACKEND_URL)

def import_devices():
    print("Importing devices...")

    try:
        r = requests.post(BACKEND_URL, timeout=300)
        print(r.status_code)
        print(r.text)
    except Exception as e:
        print(e)
        


scheduler = BlockingScheduler()
scheduler.add_job(import_devices, "interval", minutes=10)
print("Scheduler started")
import_devices()
scheduler.start()