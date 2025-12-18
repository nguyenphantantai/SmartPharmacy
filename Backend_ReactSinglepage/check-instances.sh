#!/bin/bash
# Bash script để kiểm tra multiple instances
# Chạy: chmod +x check-instances.sh && ./check-instances.sh

echo "🔍 Checking for multiple Node.js instances..."
echo ""

# Tìm tất cả Node.js processes
NODE_PROCESSES=$(ps aux | grep -E "node|npm" | grep -v grep)

if [ -z "$NODE_PROCESSES" ]; then
    echo "❌ No Node.js processes found"
    exit 1
fi

echo "📊 Found Node.js process(es):"
echo ""
echo "$NODE_PROCESSES" | while read line; do
    PID=$(echo $line | awk '{print $2}')
    CMD=$(echo $line | awk '{for(i=11;i<=NF;i++) printf "%s ", $i; print ""}')
    echo "  Process ID: $PID"
    echo "  Command: $CMD"
    echo ""
done

# Kiểm tra port 5000 (hoặc port bạn đang dùng)
echo "🔌 Checking port 5000..."
PORT_5000=$(lsof -i :5000 2>/dev/null || netstat -an | grep :5000)

if [ -n "$PORT_5000" ]; then
    echo "  ✅ Port 5000 is in use:"
    echo "$PORT_5000"
else
    echo "  ⚠️  Port 5000 is not in use"
fi

echo ""
echo "💡 Next steps:"
echo "  1. Check each instance's API usage: curl http://localhost:5000/api/gemini-usage"
echo "  2. Compare instanceId and apiKeyHash from each instance"
echo "  3. If apiKeyHash is the same but instanceId is different → Multiple instances sharing API key"

