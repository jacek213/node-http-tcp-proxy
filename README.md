node-http-tcp-proxy
===================

policy request test:
python -c 'print "<policy-file-request/>%c" % 0' | nc 127.0.0.1 8484

post test:
curl -x '' -d 'data=data' http://localhost:8484
