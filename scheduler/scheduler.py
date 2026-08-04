from apscheduler.schedulers.blocking import BlockingScheduler
import requests

BACKEND_URL = "https://pout-sandworm-angriness.ngrok-free.dev/api/import/"


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