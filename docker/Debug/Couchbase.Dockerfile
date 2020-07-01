FROM couchbase:latest

COPY setup_couchbase.sh /opt/couchbase/

CMD /opt/couchbase/setup_couchbase.sh
