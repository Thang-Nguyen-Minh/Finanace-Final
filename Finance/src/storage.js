const STORAGE_KEY = "quanLyTaiChinhData";

// NFR-7: Định nghĩa cấu trúc dữ liệu mẫu (Seed Data) phòng trường hợp kho trống
const SEED_DATA = {
    dsDanhMuc: [
        { id: 1, tenDanhMuc: "Ăn uống", hanMuc: 3000000 },
        { id: 2, tenDanhMuc: "Xăng xe", hanMuc: 1000000 }
    ],
    dsNganSach: [
        { thang: 6, nam: 2026, soTienNganSach: 5000000 }
    ],
    dsGiaoDich: [
        { id: 1, money: 2000000, categoryId: 1, ghiChu: "Lương thưởng", ngayGiaoDich: "2026-06-01T00:00:00.000Z", type: "thu" },
        { id: 2, money: -150000, categoryId: 1, ghiChu: "Ăn trưa", ngayGiaoDich: "2026-06-17T00:00:00.000Z", type: "chi" }
    ],
    cntGiaoDich: 2,
    cntDanhMuc: 2
};

export const storage = {
    // Input: Nhận vào object dữ liệu cần lưu từ bộ não
    // Process: Chuyển object thành chuỗi JSON và đẩy vào bộ nhớ trình duyệt
    save(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    // Process: Lục tìm dữ liệu cũ trong LocalStorage. Nếu không thấy -> Tự động kích hoạt SEED_DATA
    // Output: Trả ra object dữ liệu hoàn chỉnh cho bộ não sử dụng
    load() {
        const dataStr = localStorage.getItem(STORAGE_KEY);
        if (!dataStr) {
            this.save(SEED_DATA); // Lưu luôn dữ liệu mẫu vào bộ nhớ để lần sau dùng tiếp
            return SEED_DATA;
        }
        return JSON.parse(dataStr);
    }
};