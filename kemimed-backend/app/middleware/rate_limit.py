from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

# Decorator shortcuts
limit_ai = "10/minute"
limit_auth = "5/minute"
limit_upload = "20/hour"
limit_general = "100/minute"
