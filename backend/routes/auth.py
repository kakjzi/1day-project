from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.table import Table
from models.admin import Admin
from schemas.auth import (
    TableLoginRequest, TableLoginResponse,
    AdminLoginRequest, AdminLoginResponse,
    AdminRegisterRequest, AdminRegisterResponse,
    AdminMeResponse, ErrorResponse
)
from utils.security import (
    hash_password, verify_password, 
    create_access_token, decode_token
)

router = APIRouter()
security = HTTPBearer(auto_error=False)


def raise_auth_error(code: str, message: str):
    """인증 에러 발생"""
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"code": code, "message": message}
    )


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Admin:
    """현재 인증된 관리자 가져오기"""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "AUTH_002", "message": "Token required"}
        )
    
    token = credentials.credentials
    payload = decode_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "AUTH_002", "message": "Token expired or invalid"}
        )
    
    admin_id = payload.get("admin_id")
    if admin_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "AUTH_002", "message": "Invalid token payload"}
        )
    
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "AUTH_001", "message": "Admin not found"}
        )
    
    return admin


def get_current_admin_from_query(
    token: Optional[str] = None,
    db: Session = Depends(get_db)
) -> Admin:
    """쿼리 파라미터에서 관리자 인증 (SSE용)"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "AUTH_002", "message": "Token required"}
        )
    
    # Mock token for testing (임시)
    if token == 'mock-token':
        admin = db.query(Admin).filter(Admin.id == 1).first()
        if admin:
            return admin
    
    payload = decode_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "AUTH_002", "message": "Token expired or invalid"}
        )
    
    admin_id = payload.get("admin_id")
    if admin_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "AUTH_002", "message": "Invalid token payload"}
        )
    
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "AUTH_001", "message": "Admin not found"}
        )
    
    return admin


@router.post("/tables/login")
def table_login(request: TableLoginRequest, db: Session = Depends(get_db)):
    """테이블 로그인"""
    table = db.query(Table).filter(
        Table.store_id == request.store_id,
        Table.table_number == request.table_number
    ).first()
    
    if table is None or table.pin != request.pin:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"code": "AUTH_001", "message": "Invalid credentials"}
        )
    
    token = create_access_token({
        "sub": f"table_{table.id}",
        "table_id": table.id,
        "store_id": table.store_id,
        "session_id": table.session_id
    })
    
    return {"token": token, "table_id": table.id}


@router.post("/admin/login")
def admin_login(request: AdminLoginRequest, db: Session = Depends(get_db)):
    """관리자 로그인"""
    admin = db.query(Admin).filter(
        Admin.store_id == request.store_id,
        Admin.username == request.username
    ).first()
    
    if admin is None or not verify_password(request.password, admin.password_hash):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"code": "AUTH_001", "message": "Invalid credentials"}
        )
    
    token = create_access_token({
        "sub": f"admin_{admin.id}",
        "admin_id": admin.id,
        "store_id": admin.store_id
    })
    
    return {"token": token, "admin_id": admin.id}


@router.post("/admin/register", status_code=status.HTTP_201_CREATED)
def admin_register(request: AdminRegisterRequest, db: Session = Depends(get_db)):
    """관리자 등록"""
    # 중복 사용자명 체크
    existing = db.query(Admin).filter(
        Admin.store_id == request.store_id,
        Admin.username == request.username
    ).first()
    
    if existing:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"code": "AUTH_005", "message": "Username already exists"}
        )
    
    admin = Admin(
        store_id=request.store_id,
        username=request.username,
        password_hash=hash_password(request.password)
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"admin_id": admin.id}
    )


@router.get("/admin/me")
def get_admin_me(admin: Admin = Depends(get_current_admin)):
    """현재 로그인한 관리자 정보"""
    return {
        "admin_id": admin.id,
        "store_id": admin.store_id,
        "username": admin.username
    }
