# JoinUs

一款轻量化的多端招新报名界面，可轻松挂载到网页，支持高度自定义问题、答案及界面配置。

## 题型

- **填空** (text, tel, email)：姓名、联系方式、电子邮箱
- **选择** (select)：意向部门
- **描述** (textarea)：个人简介
- **附件** (file)：个人作品，不限制大小

## 配置 (form.json)

```json
{
	"title": "加入我们",
	"subtitle": "JOIN US",
	"welcome": "欢迎文案...",
	"theme": "yellow",
	"questions": [
		{ "id": "name", "type": "text", "label": "姓名", "required": true, "placeholder": "...", "icon": "ri-user-smile-line" },
		{ "id": "contact", "type": "tel", "label": "联系方式", "required": true },
		{ "id": "email", "type": "email", "label": "电子邮箱", "required": true },
		{ "id": "department", "type": "select", "label": "意向部门", "required": true, "options": ["技术部", "设计部"] },
		{ "id": "intro", "type": "textarea", "label": "个人简介", "required": false, "rows": 5 },
		{ "id": "portfolio", "type": "file", "label": "个人作品", "required": false, "accept": "*", "multiple": true }
	],
	"submit": { "label": "立即提交", "successMessage": "报名成功", "url": "" }
}
```

所有题目标题、placeholder、required 等均可配置。
