#!/bin/bash

# Start couchbase in the bg
/entrypoint.sh couchbase-server &

check_db() {
  curl --silent http://127.0.0.1:8091/pools > /dev/null
  echo $?
}

until [[ $(check_db) = 0 ]]; do
  sleep 1
done

# setup cluster

ADMIN_USER="administrator"
ADMIN_PASS="administrator"
TELEGRAF_USER="telegraf"
TELEGRAF_PASS="telegraf"

couchbase-cli cluster-init --cluster-username="${ADMIN_USER}" --cluster-password="${ADMIN_PASS}" --cluster-port=8091 --cluster-ramsize=500 --cluster-index-ramsize=256 --services=data,index,query,analytics

couchbase-cli bucket-create -c localhost -u "${ADMIN_USER}" -p "${ADMIN_PASS}" --bucket=main --bucket-type=couchbase --bucket-ramsize=512

couchbase-cli user-manage -c localhost -u "${ADMIN_USER}" -p "${ADMIN_PASS}" --set --auth-domain=local --rbac-username="${TELEGRAF_USER}" --rbac-password="${TELEGRAF_PASS}" --roles=data_monitoring[*]

sleep 5

cbq -e localhost -u administrator -p administrator --script="CREATE INDEX documents_by_type ON \`main\`(\`type\`);"
cbq -e localhost -u administrator -p administrator --script="CREATE PRIMARY INDEX primary_index ON \`main\`;"

wait