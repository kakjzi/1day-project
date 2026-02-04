# Page snapshot

```yaml
- generic [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e5]:
    - heading "테이블오더 관리자" [level=1] [ref=e6]
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]:
          - text: 매장 ID
          - generic [ref=e10]: "*"
        - generic [ref=e11]:
          - spinbutton "매장 ID" [active] [ref=e12]
          - group:
            - generic: 매장 ID *
      - generic [ref=e13]:
        - generic:
          - text: 사용자명
          - generic: "*"
        - generic [ref=e14]:
          - textbox "사용자명" [ref=e15]
          - group:
            - generic: 사용자명 *
      - generic [ref=e16]:
        - generic:
          - text: 비밀번호
          - generic: "*"
        - generic [ref=e17]:
          - textbox "비밀번호" [ref=e18]
          - group:
            - generic: 비밀번호 *
      - button "로그인" [ref=e19] [cursor=pointer]
    - paragraph [ref=e20]:
      - text: 계정이 없으신가요?
      - link "관리자 등록" [ref=e21] [cursor=pointer]:
        - /url: /register
```