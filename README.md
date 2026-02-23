# JoinUs

一款轻量化的多端招新报名界面，可轻松挂载到网页，支持高度自定义问题、答案及界面配置。

## 题型

- **填空** (input)：姓名、联系方式、电子邮箱等
- **选择** (select)：意向部门
- **判断题** (boolean)：是/否，默认选项为「是」「否」，可用 `options` 自定义
- **描述** (textarea)：个人简介
- **附件** (file)：个人作品，不限制大小

**逻辑题目**：任一题目可加 `showWhen`，根据前一题答案决定是否显示。例如 `"showWhen": { "questionId": "student", "value": "是" }` 表示仅当 id 为 student 的题目答案为「是」时显示；`value` 可为字符串或数组（满足其一即显示）。

## 配置 (form.json)

```json
{
	"title": "加入我们",
	"subtitle": "JOIN US",
	"welcome": "欢迎文案...",
	"theme": "yellow",
	"questions": [
		{ "id": "name", "type": "input", "inputType": "text", "label": "姓名", "required": true, "placeholder": "...", "icon": "ri-user-smile-line" },
		{ "id": "contact", "type": "input", "inputType": "tel", "label": "联系方式", "required": true },
		{ "id": "email", "type": "input", "inputType": "email", "label": "电子邮箱", "required": true },
		{ "id": "department", "type": "select", "label": "意向部门", "required": true, "options": ["技术部", "设计部"] },
		{ "id": "intro", "type": "textarea", "label": "个人简介", "required": false, "rows": 5 },
		{ "id": "portfolio", "type": "file", "label": "个人作品", "required": false, "accept": "*", "multiple": true }
	],
	"submit": { "label": "立即提交", "successMessage": "报名成功", "url": "" }
}
```

所有题目标题、placeholder、required 等均可配置。
