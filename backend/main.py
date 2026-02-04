from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="테이블오더 서비스 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Table Order API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# Import and include routers
from routes.auth import router as auth_router
from routes.menu import router as menu_router
from routes.admin import router as admin_router
from routes.cart import router as cart_router
from routes.order import router as order_router

app.include_router(auth_router, prefix="/api", tags=["auth"])
app.include_router(menu_router, prefix="/api", tags=["menu"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])
app.include_router(cart_router, prefix="/api", tags=["cart"])
app.include_router(order_router, prefix="/api", tags=["order"])
