#!/bin/bash
cd ~/Documents/se2025/xphase-5/goto
source venv/bin/activate
python run.py &
cd client && npm run dev -- --port 5174 &
osascript -e 'tell application "Terminal" to set miniaturized of front window to true'
wait
