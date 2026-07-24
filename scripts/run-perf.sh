#!/usr/bin/env bash
# 성능 자동 검증 통합 러너 — Step 10
# 사용법: bash scripts/run-perf.sh
set -e

# 서버 기동
pnpm build
PORT=3000 NODE_ENV=production node dist/index.js &
SERVER_PID=$!

# 서버 준비 대기 (최대 30초)
echo "서버 준비 대기..."
for i in {1..30}; do
  if curl -sf http://localhost:3000/ > /dev/null 2>&1; then
    echo "서버 준비 완료"
    break
  fi
  sleep 1
done

# 검증
set +e
node scripts/perf-audit.mjs
AUDIT_EXIT=$?
node scripts/lighthouse-audit.mjs
LH_EXIT=$?
set -e

# 서버 종료
kill $SERVER_PID 2>/dev/null || true

# 종료 코드
if [ $AUDIT_EXIT -ne 0 ] || [ $LH_EXIT -ne 0 ]; then
  exit 1
fi
