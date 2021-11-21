FROM couchbase:7.0.2

COPY setup_couchbase.sh /opt/couchbase/

CMD /opt/couchbase/setup_couchbase.sh
