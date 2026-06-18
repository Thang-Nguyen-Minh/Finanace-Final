export function render(ql, currentMonth, currentYear) {
    // 🔥 LƯU Ý: Vì file này nằm độc lập, bạn cần lấy lại các thẻ DOM cần dùng bên trong hàm
    const body = document.getElementById("danhSachDanhMuc");
    const ul = document.getElementById("listNganSach");
    const selCategory = document.getElementById("selCategory");
    const bangTongHopBody = document.getElementById("bảngTongHopCacThang");
    const lichSuContainer = document.getElementById("lichSuGiaoDich");

    // 1. CẬP NHẬT DASHBOARD
    const soDuTong = ql.getSoDuHienTai();
    document.getElementById("dashSoDuTong").innerText = soDuTong.toLocaleString() + " đ";

    const thuThang = ql.getThuThangNay(currentMonth, currentYear);
    const chiThang = ql.getChiThangNay(currentMonth, currentYear);
    document.getElementById("dashTongThu").innerText = thuThang.toLocaleString() + " đ";
    document.getElementById("dashTongChi").innerText = chiThang.toLocaleString() + " đ";

    const nganSachThang = ql.getNganSachThang(currentMonth, currentYear);
    document.getElementById("labelNganSachThang").innerText = `Ngân sách tổng (Tháng ${currentMonth})`;

    let phanTramDaDung = nganSachThang > 0 ? (chiThang * 100) / nganSachThang : (chiThang > 0 ? 100 : 0);
    document.getElementById("labelPhanTramDaDung").innerText = `Đã dùng ${phanTramDaDung.toFixed(0)}%`;

    const barTienDo = document.getElementById("barTienDo");
    barTienDo.style.width = `${Math.min(phanTramDaDung, 100)}%`;
    barTienDo.className = phanTramDaDung > 100 ? "bg-red-500 h-2.5 rounded-full transition-all duration-500" : "bg-green-600 h-2.5 rounded-full transition-all duration-500";

    const boxConLai = document.getElementById("boxConLai");
    const soTienConLai = nganSachThang - chiThang;
    if (soTienConLai >= 0) {
        boxConLai.className = "bg-gray-50 text-gray-600 rounded-lg p-2.5 text-xs font-medium";
        boxConLai.innerHTML = `Còn lại <span class="text-green-600 font-bold">${soTienConLai.toLocaleString()} đ</span> trong ngân sách tháng. Trạng thái: <strong>Đạt</strong>`;
    } else {
        boxConLai.className = "bg-red-50 text-red-700 rounded-lg p-2.5 text-xs font-medium";
        boxConLai.innerHTML = `Bạn đã tiêu vượt quá ngân sách hạn mức <span class="font-bold">${Math.abs(soTienConLai).toLocaleString()} đ</span>! Trạng thái: <strong>Vượt</strong>`;
    }

    // 2. IN NGÂN SÁCH THÁNG
    ul.innerHTML = "";
    for (let config of ql.dsNganSach) {
        let li = document.createElement("li");
        li.innerText = `Month : ${config.thang}/${config.nam} - Budget : ${config.soTienNganSach}`;
        ul.appendChild(li);
    }

    // 3. IN DANH MỤC & CẢNH BÁO
    body.innerHTML = "";
    let htmlContent = "";
    for (let dm of ql.dsDanhMuc) {
        const daChiDM = ql.getMoneyTradeNowMonth(dm.id, currentMonth, currentYear);
        let mauChuDaChi = daChiDM > dm.hanMuc ? "text-red-600 font-bold animate-pulse" : "text-gray-900 font-medium";
        let textCanhBao = daChiDM > dm.hanMuc ? ' <span class="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded ml-1">Vượt hạn mức!</span>' : "";

        htmlContent += `
            <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-gray-500">${dm.id}</td>
                  <td class="px-6 py-4 font-semibold text-gray-900">${dm.tenDanhMuc}</td>
                  <td class="px-6 py-4 text-gray-600">${Number(dm.hanMuc).toLocaleString()} đ</td>
                  <td class="px-6 py-4 ${mauChuDaChi}">${Number(daChiDM).toLocaleString()} đ${textCanhBao}</td>
                  <td class="px-6 py-4 text-center space-x-2">
                    <button class="text-purple-600 hover:text-purple-900 font-medium btn-sua" data-id="${dm.id}">Sửa</button>
                    <button class="text-red-600 hover:text-red-900 font-medium btn-xoa" data-id="${dm.id}">Xóa</button>
                  </td>
            </tr>
        `;
    }
    body.innerHTML = htmlContent;

    // 4. ĐỔ SELECT OPTION DANH MỤC
    let htmlCate = '<option value="">-- Chọn danh mục --</option>';
    for (let dm of ql.dsDanhMuc) {
        htmlCate += `<option value="${dm.id}">${dm.tenDanhMuc}</option>`;
    }
    selCategory.innerHTML = htmlCate;

    // 5. IN LỊCH SỬ GIAO DỊCH
    let htmlLichSu = "";
    const dsThangNay = ql.getGiaoDichTheoThang(currentMonth, currentYear);
    const dsSorted = dsThangNay.sort((a, b) => b.ngayGiaoDich - a.ngayGiaoDich);

    for (let gd of dsSorted) {
        const dmThuocVe = ql.dsDanhMuc.find(item => item.id === gd.categoryId);
        const tenDM = dmThuocVe ? dmThuocVe.tenDanhMuc : "Chưa phân loại";
        const ngayHienThi = new Date(gd.ngayGiaoDich).toLocaleDateString('vi-VN');
        const isThu = gd.money >= 0;
        const colorClass = isThu ? "text-green-600 font-bold" : "text-red-500 font-bold";
        const prefixSign = isThu ? "+" : "-";

        htmlLichSu += `
            <tr class="hover:bg-gray-50 border-b border-gray-100 transition-colors">
                <td class="px-4 py-3.5 ${colorClass}">${prefixSign}${Number(Math.abs(gd.money)).toLocaleString()} đ</td>
                <td class="px-4 py-3.5 text-gray-800 font-medium">${tenDM}</td>
                <td class="px-4 py-3.5 text-gray-500 text-xs truncate max-w-[120px]">${gd.ghiChu || "<i>Không có</i>"}</td>
                <td class="px-4 py-3.5 text-gray-400 text-xs text-right">${ngayHienThi}</td>
                <td class="px-4 py-3.5 text-right">
                    <button class="text-gray-400 hover:text-red-500 transition-colors btn-xoa-gd" data-id="${gd.id}">Xóa</button>
                </td>
            </tr>
        `;
    }
    lichSuContainer.innerHTML = htmlLichSu !== "" ? htmlLichSu : `<tr><td colspan="5" class="text-center py-8 text-gray-400 italic">Tháng này chưa phát sinh giao dịch nào</td></tr>`;

    // 6. IN BẢNG TỔNG HỢP CÁC THÁNG
    let htmlSummary = "";
    const summaryData = ql.getSummaryAllMonths();
    for (let item of summaryData) {
        htmlSummary += `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 font-medium text-gray-900">Tháng ${item.thang}/${item.nam}</td>
                <td class="px-6 py-4 text-red-500 font-semibold">${Number(item.tongChi).toLocaleString()} đ</td>
            </tr>
        `;
    }
    bangTongHopBody.innerHTML = htmlSummary !== "" ? htmlSummary : `<tr><td colspan="2" class="text-center py-4 text-gray-400 italic">Chưa có dữ liệu tổng hợp</td></tr>`;
}