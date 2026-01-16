import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("api")
logging.basicConfig(level=logging.INFO)
    
class LogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
       
        req_id = getattr(request.state, "request_id", "unknown")
        
        logger.info(f"[{req_id}] START: {request.method} {request.url.path}")
        
        try:
            response = await call_next(request)
            process_time = time.time() - start_time
            
            logger.info(
                f"[{req_id}] END: Status {response.status_code} "
                f"| Time: {process_time:.4f}s"
            )
            return response
            
        except Exception as e:
            logger.error(f"[{req_id}] FAILED: {str(e)}")
            raise e