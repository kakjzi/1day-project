from pydantic import BaseModel


class TableLoginRequest(BaseModel):
    """테이블 로그인 요청"""
    store_id: int
    table_number: int
    pin: str


class TableLoginResponse(BaseModel):
    """테이블 로그인 응답"""
    token: str
    table_id: int


class AdminLoginRequest(BaseModel):
    """관리자 로그인 요청"""
    store_id: int
    username: str
    password: str


class AdminLoginResponse(BaseModel):
    """관리자 로그인 응답"""
    token: str
    admin_id: int


class AdminRegisterRequest(BaseModel):
    """관리자 등록 요청"""
    store_id: int
    username: str
    password: str


class AdminRegisterResponse(BaseModel):
    """관리자 등록 응답"""
    admin_id: int


class AdminMeResponse(BaseModel):
    """현재 관리자 정보 응답"""
    admin_id: int
    store_id: int
    username: str


class ErrorResponse(BaseModel):
    """에러 응답"""
    code: str
    message: str
    details: dict = {}
