// 🔥 THÊM DÒNG NÀY Ở ĐẦU FILE ĐỂ LIÊN KẾT MODULE STORAGE
import { storage } from './storage.js';

class GiaoDich {
    static cnt = 0;
    constructor(money, categoryId, ghiChu, nam, thang, ngay) {
        GiaoDich.cnt++;
        this.id = GiaoDich.cnt;
        this.money = money;
        this.categoryId = categoryId;
        this.ghiChu = ghiChu;
        this.ngayGiaoDich = new Date(nam, thang - 1, ngay);
        this.type = money >= 0 ? "thu" : "chi";
    }
}

class ConfigNganSach {
    constructor(thang, nam, soTienNganSach) {
        this.thang = thang;
        this.nam = nam;
        this.soTienNganSach = soTienNganSach;
    }
}

class DanhMuc {
    static cnt = 0;
    constructor(tenDanhMuc, hanMuc) {
        DanhMuc.cnt++;
        this.id = DanhMuc.cnt;
        this.tenDanhMuc = tenDanhMuc;
        this.hanMuc = hanMuc;
    }
}

export class QuanLyTaiChinh {
    dsGiaoDich = [];
    dsNganSach = [];
    dsDanhMuc = [];

    // ==========================================
    // 1. QUẢN LÝ DANH MỤC
    // ==========================================
    addDanhMuc(tenDanhMuc, hanMuc) {
        const trimTen = tenDanhMuc.trim();
        for (let dm of this.dsDanhMuc) {
            if (dm.tenDanhMuc.toLowerCase() == trimTen.toLowerCase()) {
                return "Thất bại: Tên danh mục này đã tồn tại!";
            }
        }
        const dmMoi = new DanhMuc(trimTen, hanMuc);
        this.dsDanhMuc.push(dmMoi);
        this.saveToLocalStorage();
        return "Thêm danh mục thành công!";
    }

    updateDanhMuc(id, tenMoi, hanMucMoi) {
        let dmCanSua = this.dsDanhMuc.find(dm => dm.id == id);
        if (!dmCanSua) return "Thất bại: Không tìm thấy danh mục!";

        const trimTenMoi = tenMoi.trim();
        for (let dm of this.dsDanhMuc) {
            if (dm.id != id && dm.tenDanhMuc.toLowerCase() == trimTenMoi.toLowerCase()) {
                return "Thất bại: Tên danh mục mới đã trùng!";
            }
        }
        dmCanSua.tenDanhMuc = trimTenMoi;
        dmCanSua.hanMuc = hanMucMoi;
        this.saveToLocalStorage();
        return "Cập nhật danh mục thành công!";
    }

    deleteDanhMuc(id) {
        const coGiaoDich = this.dsGiaoDich.some(gd => gd.categoryId === id);
        if (coGiaoDich) {
            return "Thất bại: Không thể xóa danh mục đã có lịch sử giao dịch!";
        }

        const len = this.dsDanhMuc.length;
        this.dsDanhMuc = this.dsDanhMuc.filter(dm => dm.id !== id);
        if (this.dsDanhMuc.length === len) return "Thất bại: Không tìm thấy danh mục!";

        this.saveToLocalStorage();
        return "Xóa danh mục thành công!";
    }

    // ==========================================
    // 2. QUẢN LÝ NGÂN SÁCH
    // ==========================================
    addConFigMonth(thangMoi, namMoi, soTien) {
        for (let ns of this.dsNganSach) {
            if (ns.nam == namMoi && ns.thang == thangMoi) return "Da ton tai";
        }
        let configMoi = new ConfigNganSach(thangMoi, namMoi, soTien);
        this.dsNganSach.push(configMoi);
        this.saveToLocalStorage();
        return "Them duoc";
    }

    getNganSachThang(thang, nam) {
        for (let ns of this.dsNganSach) {
            if (ns.thang === thang && ns.nam === nam) {
                return ns.soTienNganSach;
            }
        }
        return 0;
    }

    // ==========================================
    // 3. QUẢN LÝ GIAO DỊCH
    // ==========================================
    addGiaoDich(money, categoryId, ghiChu, dateStr) {
        const [nam, thang, ngay] = dateStr.split("-").map(Number);
        const ngayHientai=new Date();
        const homNay=new Date(ngayHientai.getFullYear(),ngayHientai.getMonth(),ngayHientai.getDate())
        const quaKhu=new Date(homNay)
        quaKhu.setMonth(quaKhu.getMonth()-2)
        const ngayNhap=new Date(nam, thang-1,ngay);
        if (ngayNhap<quaKhu || ngayNhap>homNay){
            return "Cannot Add Transaction";
        }
        const gdMoi = new GiaoDich(money, categoryId, ghiChu, nam, thang, ngay);
        this.dsGiaoDich.push(gdMoi);
        this.saveToLocalStorage();
        return "Add transaction successful";
    }

    removeGiaoDich(id) {
        const len = this.dsGiaoDich.length;
        this.dsGiaoDich = this.dsGiaoDich.filter(gd => gd.id !== id);
        if (len === this.dsGiaoDich.length) return "Thất bại: Không tìm thấy giao dịch!";
        this.saveToLocalStorage();
        return "Xóa giao dịch thành công!";
    }

    getLichSuSorted() {
        return [...this.dsGiaoDich].sort((a, b) => b.ngayGiaoDich - a.ngayGiaoDich);
    }

    getGiaoDichTheoThang(thang, nam) {
        return this.dsGiaoDich.filter(gd =>
            (gd.ngayGiaoDich.getMonth() + 1) === thang &&
            gd.ngayGiaoDich.getFullYear() === nam
        );
    }

    // ==========================================
    // 4. THỐNG KÊ & DASHBOARD
    // ==========================================
    getSoDuHienTai() {
        let tongThu = 0;
        let tongChi = 0;
        for (let gd of this.dsGiaoDich) {
            if (gd.money >= 0) tongThu += gd.money;
            else tongChi += Math.abs(gd.money);
        }
        return tongThu - tongChi;
    }

    getThuThangNay(thang, nam) {
        let tongThu = 0;
        const dsThang = this.getGiaoDichTheoThang(thang, nam);
        for (let gd of dsThang) {
            if (gd.money > 0) tongThu += gd.money;
        }
        return tongThu;
    }

    getChiThangNay(thang, nam) {
        let tongChi = 0;
        const dsThang = this.getGiaoDichTheoThang(thang, nam);
        for (let gd of dsThang) {
            if (gd.money < 0) tongChi += gd.money;
        }
        return Math.abs(tongChi);
    }

    getMoneyTradeNowMonth(categoryId, thang, nam) {
        let tongChiDanhMuc = 0;
        const dsThang = this.getGiaoDichTheoThang(thang, nam);
        for (let gd of dsThang) {
            if (gd.categoryId === categoryId && gd.money < 0) {
                tongChiDanhMuc += Math.abs(gd.money);
            }
        }
        return tongChiDanhMuc;
    }

    getSoDu(thang, nam) {
        let nganSach = this.getNganSachThang(thang, nam);
        const daChi = this.getChiThangNay(thang, nam);
        return nganSach - daChi;
    }

    phanTramCanhcao(thang, nam) {
        let nganSach = this.getNganSachThang(thang, nam);
        const daChi = this.getChiThangNay(thang, nam);
        if (nganSach === 0) {
            return daChi > 0 ? "100% Vuot" : "0% Dat";
        }
        const phanTram = (daChi * 100) / nganSach;
        const kq = (daChi > nganSach) ? "Vuot" : "Dat";
        return phanTram.toFixed(1) + "% " + kq;
    }

    getSummaryAllMonths() {
        const summaryMap = {};
        for (let gd of this.dsGiaoDich) {
            if (gd.type === "chi") {
                const m = gd.ngayGiaoDich.getMonth() + 1;
                const y = gd.ngayGiaoDich.getFullYear();
                const key = `${m}-${y}`;

                if (!summaryMap[key]) {
                    summaryMap[key] = { thang: m, nam: y, tongChi: 0 };
                }
                summaryMap[key].tongChi += Math.abs(gd.money);
            }
        }
        return Object.values(summaryMap);
    }

    // ==========================================
    // 5. LIÊN KẾT MODULE STORAGE HỆ THỐNG
    // ==========================================

    // 🔥 ĐÃ SỬA: Đóng gói gói dữ liệu và đẩy sang storage.js lưu trữ
    saveToLocalStorage() {
        const data = {
            dsGiaoDich: this.dsGiaoDich,
            dsNganSach: this.dsNganSach,
            dsDanhMuc: this.dsDanhMuc,
            cntGiaoDich: GiaoDich.cnt,
            cntDanhMuc: DanhMuc.cnt
        };
        storage.save(data);
    }

    // 🔥 ĐÃ SỬA: Gọi lệnh load từ storage.js để lôi dữ liệu lên phân rã cấu trúc
    loadFromLocalStorage() {
        const data = storage.load();

        this.dsNganSach = data.dsNganSach || [];
        this.dsDanhMuc = data.dsDanhMuc || [];
        this.dsGiaoDich = (data.dsGiaoDich || []).map(gd => {
            gd.ngayGiaoDich = new Date(gd.ngayGiaoDich);
            return gd;
        });

        GiaoDich.cnt = data.cntGiaoDich || 0;
        DanhMuc.cnt = data.cntDanhMuc || 0;
    }
}