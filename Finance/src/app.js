import { QuanLyTaiChinh } from './QuanLyTaiChinh.js';
import { render } from './ui.js';
// 1. Khởi tạo đối tượng quản lý ngoài cùng (Giữ nguyên)
const ql = new QuanLyTaiChinh();
ql.loadFromLocalStorage();
// Khai báo 2 biến lưu thời gian hiện tại làm mốc tổng cục
let currentMonth=new Date().getMonth()+1;
let currentYear=new Date().getFullYear()
// Điền giá trị mặc định này lên giao diện khi vừa mở trang
document.getElementById("selectThang").value=currentMonth
document.getElementById("inputNam").value=currentYear
// LẮNG NGHE SỰ KIỆN: Khi người dùng đổi tháng
document.getElementById("selectThang").addEventListener("change",function (e){
    currentMonth=parseInt(e.target.value);
    render(ql, currentMonth, currentYear);
})
// LẮNG NGHE SỰ KIỆN: Khi người dùng đổi năm
document.getElementById("inputNam").addEventListener("input", function(e) {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
        currentYear = val; // Cập nhật biến năm
        render(ql, currentMonth, currentYear);; // Vẽ lại giao diện
    }
});

const body = document.getElementById("danhSachDanhMuc");
const lichSuBody = document.getElementById("lichSuGiaoDich");

render(ql, currentMonth, currentYear);;

// 2. LẮNG NGHE SỰ KIỆN: THÊM CẤU HÌNH NGÂN SÁCH
document.getElementById("btnThemNganSach").addEventListener("click", function () {
    // ĐƯA VÀO TRONG: Lấy giá trị ngay tại thời điểm CLICK
    const thang = parseInt(document.getElementById("txtThang").value);
    const nam = parseInt(document.getElementById("txtNam").value);
    const soTien = parseInt(document.getElementById("txtSoTien").value);

    // Xử lý lỗi nhập liệu cơ bản
    if (isNaN(thang) || isNaN(nam) || isNaN(soTien) || soTien <= 0 || thang < 1 || thang > 12) {
        alert("Data not found");
        return;
    }

    let ketQua = ql.addConFigMonth(thang, nam, soTien);

    if (ketQua === "Da ton tai") {
        alert("Thất bại: Tháng " + thang + "/" + nam + " đã tồn tại cấu hình ngân sách!");
    } else if (ketQua === "Them duoc") {
        alert("Thành công: Đã thêm cấu hình ngân sách cho tháng " + thang + "/" + nam);
        render(ql, currentMonth, currentYear);; // Cập nhật giao diện
    }
});

// --- SỰ KIỆN 1: BẤM NÚT THÊM DANH MỤC ---
document.getElementById("btnThemDanhMuc").addEventListener("click", function (e) {
    // ĐƯA VÀO TRONG: Lấy giá trị ngay tại thời điểm CLICK
    e.preventDefault();
    const txtTenInput = document.getElementById("txtTenDanhMuc");
    const txtHanMucInput = document.getElementById("txtHanMuc");

    const tenHanMuc = txtTenInput.value.trim();
    const hanMuc = parseInt(txtHanMucInput.value);

    // Kiểm tra dữ liệu hợp lệ
    if (tenHanMuc.length === 0 || isNaN(hanMuc) || hanMuc <= 0) {
        alert("Data not found");
        return;
    }

    let kq = ql.addDanhMuc(tenHanMuc, hanMuc);

    if (kq === "Thất bại: Tên danh mục này đã tồn tại!") {
        alert("Không thể thêm danh mục: Tên đã tồn tại!");
    } else {
        alert("Thêm danh mục thành công");
        render(ql, currentMonth, currentYear);; // Vẽ lại giao diện

        // CÁCH XÓA FORM ĐÚNG: Gán rỗng vào .value của thẻ ô nhập liệu
        txtTenInput.value = "";
        txtHanMucInput.value = "";
    }
});

// --- SỰ KIỆN 2: BẤM NÚT SỬA / XÓA (Event Delegation từ cha tbody) ---
body.addEventListener("click", function (e) {
    const target = e.target;
    const id = parseInt(target.getAttribute("data-id"));
    if (!id) return;

    // Xử lý nếu bấm nút XÓA
    if (target.classList.contains("btn-xoa")) {
        if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            const ketQua = ql.deleteDanhMuc(id);
            alert(ketQua);
            render(ql, currentMonth, currentYear);;
        }
    }

    // Xử lý nếu bấm nút SỬA (ĐÃ SỬA: Đổi từ btn-xoa thành btn-sua)
    if (target.classList.contains("btn-sua")) {
        const tenMoi = prompt("Nhập tên danh mục mới:");
        const hanMucMoi = parseInt(prompt("Nhập hạn mức mới:"));

        if (tenMoi && !isNaN(hanMucMoi) && hanMucMoi > 0) {
            const ketQua = ql.updateDanhMuc(id, tenMoi, hanMucMoi);
            alert(ketQua);
            render(ql, currentMonth, currentYear);; // ĐÃ SỬA: Đổi từ renderTable() thành render(ql, currentMonth, currentYear);
        } else {
            alert("Thông tin sửa không hợp lệ!");
        }
    }
});

document.getElementById("btnLuuGiaoDich").addEventListener("click",function (e){
    e.preventDefault()
    const money=parseInt(document.getElementById("txtMoney").value);
    const cate=parseInt(document.getElementById("selCategory").value)
    const ghiChu=document.getElementById("txtGhiChu").value.trim()
    const time=document.getElementById("txtNgayGiaoDich").value
    if (isNaN(money) || money===0 || isNaN(cate) || cate==="" || time===""){
        alert("Data not found")
        return
    }
    const newGd=ql.addGiaoDich(money,cate,ghiChu,time)
    alert(newGd)
    render(ql, currentMonth, currentYear);
    // Xóa sạch dữ liệu form sau khi lưu thành công
    // Thay vì reset từng ô, gọi hàm reset của cả form:
    document.getElementById("formGiaoDich").reset();
})
// 6. LẮNG NGHE SỰ KIỆN: XÓA GIAO DỊCH (F03-4)
document.getElementById("lichSuGiaoDich").addEventListener("click",function (e){
    e.preventDefault()
    const target=e.target
    if (target.classList.contains("btn-xoa-gd")){
        const id=parseInt(target.getAttribute("data-id"))
        if (confirm("Bạn có chắc chắn muốn xóa giao dịch này không?")){
            const  kq=ql.removeGiaoDich(id)
            alert(kq);
            render(ql, currentMonth, currentYear);
        }
    }
})
