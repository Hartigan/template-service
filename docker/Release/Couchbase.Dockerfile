FROM couchbase:6.5.1

COPY setup_couchbase.sh /opt/couchbase/

CMD /opt/couchbase/setup_couchbase.sh
