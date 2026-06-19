# 📊 Personal Finance Manager (E-Wallet)

Ứng dụng web **quản lý chi tiêu cá nhân** giúp người dùng ghi chép thu/chi, quản lý
danh mục, thiết lập ngân sách, theo dõi hạn mức và nhận cảnh báo khi vượt chi. Toàn bộ
dữ liệu được lưu **cục bộ trên trình duyệt** thông qua `localStorage` — không cần server,
không cần đăng nhập.

> Đồ án được xây dựng theo đặc tả **Module 02 – Software Requirement Specification (SRS)**,
> đáp ứng đầy đủ 5 nhóm chức năng **F01 → F05** cùng các yêu cầu phi chức năng (NFR).

---

## ✨ Tính năng chính

| Mã | Nhóm chức năng | Mô tả |
|----|----------------|-------|
| **F01** | Tổng quan (Dashboard) | Hiển thị **số dư hiện tại** (cập nhật realtime), **tổng thu / tổng chi** của tháng đang chọn, và **thanh tiến trình ngân sách** kèm trạng thái *Đạt / Vượt*. |
| **F02** | Quản lý danh mục | **Thêm / Sửa / Xóa** danh mục chi tiêu, đặt **hạn mức (limit)** riêng cho từng danh mục. Có ràng buộc: không cho xóa danh mục đã phát sinh giao dịch. |
| **F03** | Quản lý giao dịch | Form nhập giao dịch (số tiền, danh mục, ghi chú, ngày). Quy ước **số dương = Thu, số âm = Chi**. Lịch sử sắp xếp theo thời gian **giảm dần**, có thể xóa từng giao dịch. |
| **F04** | Lọc theo thời gian | Bộ chọn **Tháng / Năm**. Dashboard, lịch sử và thống kê tự động cập nhật theo tháng được chọn. |
| **F05** | Cảnh báo & Thống kê | **Cảnh báo trực quan** (màu đỏ + nhãn *"Vượt hạn mức!"*) khi một danh mục vượt limit. **Bảng tổng hợp** chi tiêu theo từng tháng để so sánh. |

**Tính năng bổ sung:** kiểm tra dữ liệu nhập (số tiền, tên danh mục, hạn mức hợp lệ),
chặn giao dịch có ngày nằm ngoài khoảng hợp lý (quá 2 tháng về trước hoặc trong tương lai),
và **dữ liệu mẫu (seed data)** tự khởi tạo trong lần truy cập đầu tiên.

---

## 🛠️ Công nghệ sử dụng

- **JavaScript thuần (ES Modules)** — logic, không dùng framework UI.
- **Vite** — dev server & build tool.
- **Tailwind CSS** — styling, giao diện responsive (Flex/Grid).
- **localStorage** — lưu trữ dữ liệu cục bộ, tự động lưu sau mỗi thao tác.

> Màu sắc theo quy ước: 🟢 **xanh** cho thu / số dư dương, 🔴 **đỏ** cho chi / cảnh báo.

---

## 📁 Cấu trúc dự án

Mã nguồn được tách module rõ ràng theo mô hình **Model – View – Controller**:

```
FinanceFinal/
├── README.md                  # Tài liệu này
├── Finance/                    # Ứng dụng chính
│   ├── index.html              # Giao diện & layout (Dashboard, form, bảng)
│   ├── vite.config.js          # Cấu hình Vite
│   ├── package.json            # Scripts & dependencies
│   └── src/
│       ├── app.js              # 🎮 Controller — lắng nghe sự kiện, điều phối
│       ├── QuanLyTaiChinh.js   # 🧠 Model  — lớp nghiệp vụ & dữ liệu
│       ├── storage.js          # 💾 Storage — đọc/ghi localStorage + seed data
│       └── ui.js               # 🖼️ View   — hàm render() vẽ lại toàn bộ giao diện
```

**Vai trò từng module:**

- **`storage.js`** — đóng gói việc `save` / `load` dữ liệu vào `localStorage`. Tự nạp
  dữ liệu mẫu (`SEED_DATA`) khi kho rỗng (NFR-7).
- **`QuanLyTaiChinh.js`** — "bộ não" chứa các lớp `GiaoDich`, `DanhMuc`, `ConfigNganSach`
  và lớp quản lý `QuanLyTaiChinh` với toàn bộ logic: thêm/sửa/xóa, thống kê, tính ngân sách.
- **`ui.js`** — hàm `render(ql, thang, nam)` đọc dữ liệu từ Model và cập nhật DOM.
- **`app.js`** — điểm khởi động, gắn các trình lắng nghe sự kiện và gọi `render()`.

---

## 🚀 Cài đặt & Chạy

> Yêu cầu: **Node.js** (khuyến nghị ≥ 18) và **npm**.

Ứng dụng nằm trong thư mục `Finance/`:

```bash
# 1. Vào thư mục ứng dụng
cd Finance

# 2. Cài đặt dependencies
npm install

# 3. Chạy dev server
npm run dev
```

Mở trình duyệt tại địa chỉ Vite in ra (mặc định `http://localhost:5173`).

**Các lệnh khác:**

```bash
npm run build     # Build bản production vào thư mục dist/
npm run preview   # Xem thử bản build
npm run lint      # Kiểm tra code với ESLint
```

---

## 📖 Hướng dẫn sử dụng

1. **Chọn tháng/năm** ở góc trên cùng để xem dữ liệu của kỳ tương ứng.
2. **Thiết lập ngân sách tháng** — nhập tháng, năm, số tiền rồi bấm *Thêm cấu hình*.
3. **Thêm danh mục** — nhập tên + hạn mức (VD: *Ăn uống – 3.000.000đ*).
4. **Ghi giao dịch** — nhập số tiền (dương = thu, âm = chi), chọn danh mục, ghi chú, ngày.
5. **Theo dõi** — Dashboard hiển thị số dư, % ngân sách đã dùng; danh mục vượt hạn mức
   sẽ được tô **đỏ** kèm nhãn cảnh báo.
6. **Bảng tổng hợp** ở cuối trang cho phép so sánh tổng chi giữa các tháng.

Mọi thay đổi được **lưu tự động** vào `localStorage`; tải lại trang vẫn giữ nguyên dữ liệu.

---

## ✅ Đối chiếu tiêu chí (SRS)

| Tiêu chí | Trạng thái |
|----------|------------|
| Hoàn thành 5 nhóm chức năng F01–F05 | ✔️ |
| Lưu trữ localStorage ổn định, không mất dữ liệu khi reload | ✔️ |
| Tự động lưu sau mỗi thao tác thêm/sửa/xóa (NFR-3) | ✔️ |
| Kiến trúc modular (storage / model / ui / app — ES Modules) | ✔️ |
| Responsive (Grid/Flex, hỗ trợ mobile) | ✔️ |
| Quy ước màu xanh (thu) / đỏ (chi & cảnh báo) | ✔️ |
| Dữ liệu mẫu khởi tạo khi trống (seed) | ✔️ |
| Xử lý lỗi nhập liệu | ✔️ |

---

## 📄 License

Distributed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Thang Nguyen Minh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**Author**

- 👤 **Thang Nguyen Minh**
- ✉️ Email: nmthang2004@gmail.com
- 🔗 GitHub: [@Thang-Nguyen-Minh](https://github.com/Thang-Nguyen-Minh)
- 📦 Repository: [Finanace-Final](https://github.com/Thang-Nguyen-Minh/Finanace-Final)
