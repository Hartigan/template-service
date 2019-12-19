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
couchbase-cli cluster-init --cluster-username=administrator --cluster-password=administrator --cluster-port=8091 --cluster-ramsize=500 --cluster-index-ramsize=256 --services=data,index,query

couchbase-cli bucket-create -c localhost --bucket=main --bucket-type=couchbase --bucket-ramsize=100 -u administrator -p administrator

sleep 5

cbq -e localhost -u administrator -p administrator --script="CREATE INDEX user_by_normalized_name ON \`main\`(\`normalized_name\`) WHERE (\`type\` = \"user\");"
cbq -e localhost -u administrator -p administrator --script="CREATE INDEX submission_by_user ON \`main\`(\`permissions\`.\`owner_id\`) WHERE (\`type\` = \"submission\");"
cbq -e localhost -u administrator -p administrator --script="CREATE INDEX report_by_user ON \`main\`(\`permissions\`.\`owner_id\`) WHERE (\`type\` = \"report\");"

wait