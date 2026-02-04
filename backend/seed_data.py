"""
샘플 데이터 생성 스크립트
"""
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Store, Admin, Table, Category, Menu, OptionGroup, Option
from utils.security import hash_password


def seed_database():
    """샘플 데이터 생성"""
    # 테이블 생성
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # 기존 데이터 확인
        if db.query(Store).first():
            print("데이터가 이미 존재합니다.")
            return
        
        # 1. 매장 생성
        store = Store(name="맛있는 식당")
        db.add(store)
        db.commit()
        db.refresh(store)
        print(f"매장 생성: {store.name} (ID: {store.id})")
        
        # 2. 관리자 생성
        admin = Admin(
            store_id=store.id,
            username="admin",
            password_hash=hash_password("admin123")
        )
        db.add(admin)
        db.commit()
        print(f"관리자 생성: {admin.username}")
        
        # 3. 테이블 생성 (5개)
        for i in range(1, 6):
            table = Table(
                store_id=store.id,
                table_number=i,
                pin=f"{i}234"
            )
            db.add(table)
        db.commit()
        print("테이블 5개 생성 완료")
        
        # 4. 카테고리 생성
        categories_data = [
            {"name": "메인 메뉴", "sort_order": 1},
            {"name": "사이드", "sort_order": 2},
            {"name": "음료", "sort_order": 3},
        ]
        
        categories = {}
        for cat_data in categories_data:
            category = Category(store_id=store.id, **cat_data)
            db.add(category)
            db.commit()
            db.refresh(category)
            categories[cat_data["name"]] = category
        print("카테고리 3개 생성 완료")
        
        # 5. 메뉴 생성
        menus_data = [
            # 메인 메뉴
            {"category": "메인 메뉴", "name": "김치찌개", "price": 9000, "description": "얼큰한 김치찌개"},
            {"category": "메인 메뉴", "name": "된장찌개", "price": 8000, "description": "구수한 된장찌개"},
            {"category": "메인 메뉴", "name": "제육볶음", "price": 11000, "description": "매콤한 제육볶음"},
            {"category": "메인 메뉴", "name": "불고기", "price": 13000, "description": "달콤한 불고기"},
            {"category": "메인 메뉴", "name": "비빔밥", "price": 9000, "description": "건강한 비빔밥"},
            # 사이드
            {"category": "사이드", "name": "계란말이", "price": 5000, "description": "부드러운 계란말이"},
            {"category": "사이드", "name": "김치전", "price": 6000, "description": "바삭한 김치전"},
            {"category": "사이드", "name": "공기밥", "price": 1000, "description": "따뜻한 공기밥"},
            # 음료
            {"category": "음료", "name": "콜라", "price": 2000, "description": "시원한 콜라"},
            {"category": "음료", "name": "사이다", "price": 2000, "description": "청량한 사이다"},
            {"category": "음료", "name": "소주", "price": 5000, "description": "참이슬"},
            {"category": "음료", "name": "맥주", "price": 5000, "description": "카스"},
        ]
        
        menus = {}
        for i, menu_data in enumerate(menus_data):
            category = categories[menu_data["category"]]
            menu = Menu(
                category_id=category.id,
                name=menu_data["name"],
                price=menu_data["price"],
                description=menu_data["description"],
                sort_order=i + 1
            )
            db.add(menu)
            db.commit()
            db.refresh(menu)
            menus[menu_data["name"]] = menu
        print(f"메뉴 {len(menus_data)}개 생성 완료")
        
        # 6. 옵션 그룹 및 옵션 생성
        # 김치찌개 옵션
        og1 = OptionGroup(
            menu_id=menus["김치찌개"].id,
            name="맵기 선택",
            is_required=True,
            max_select=1
        )
        db.add(og1)
        db.commit()
        
        for opt_name, opt_price in [("순한맛", 0), ("보통", 0), ("매운맛", 0), ("아주 매운맛", 500)]:
            opt = Option(option_group_id=og1.id, name=opt_name, price=opt_price)
            db.add(opt)
        
        # 제육볶음 옵션
        og2 = OptionGroup(
            menu_id=menus["제육볶음"].id,
            name="맵기 선택",
            is_required=True,
            max_select=1
        )
        db.add(og2)
        db.commit()
        
        for opt_name in ["순한맛", "보통", "매운맛"]:
            opt = Option(option_group_id=og2.id, name=opt_name, price=0)
            db.add(opt)
        
        # 비빔밥 옵션
        og3 = OptionGroup(
            menu_id=menus["비빔밥"].id,
            name="추가 토핑",
            is_required=False,
            max_select=3
        )
        db.add(og3)
        db.commit()
        
        for opt_name, opt_price in [("계란 추가", 1000), ("고기 추가", 2000), ("치즈 추가", 1500)]:
            opt = Option(option_group_id=og3.id, name=opt_name, price=opt_price)
            db.add(opt)
        
        db.commit()
        print("옵션 그룹 및 옵션 생성 완료")
        
        print("\n=== 샘플 데이터 생성 완료 ===")
        print(f"매장 ID: {store.id}")
        print(f"관리자: admin / admin123")
        print(f"테이블 1~5번 (PIN: 1234, 2234, 3234, 4234, 5234)")
        
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
