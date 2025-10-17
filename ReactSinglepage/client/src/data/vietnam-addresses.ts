// Dữ liệu địa chỉ Việt Nam
export interface Province {
  code: string;
  name: string;
  districts: District[];
}

export interface District {
  code: string;
  name: string;
  wards: Ward[];
}

export interface Ward {
  code: string;
  name: string;
}

export const vietnamProvinces: Province[] = [
  {
    code: "01",
    name: "Thành phố Hà Nội",
    districts: [
      {
        code: "001",
        name: "Quận Ba Đình",
        wards: [
          { code: "00001", name: "Phường Phúc Xá" },
          { code: "00004", name: "Phường Trúc Bạch" },
          { code: "00006", name: "Phường Vĩnh Phú" },
          { code: "00007", name: "Phường Cống Vị" },
          { code: "00008", name: "Phường Liễu Giai" },
          { code: "00010", name: "Phường Nguyễn Trung Trực" },
          { code: "00013", name: "Phường Quán Thánh" },
          { code: "00016", name: "Phường Ngọc Hà" },
          { code: "00019", name: "Phường Điện Biên" },
          { code: "00022", name: "Phường Đội Cấn" },
          { code: "00025", name: "Phường Ngọc Khánh" },
          { code: "00028", name: "Phường Kim Mã" },
          { code: "00031", name: "Phường Giảng Võ" },
          { code: "00034", name: "Phường Thành Công" }
        ]
      },
      {
        code: "002",
        name: "Quận Hoàn Kiếm",
        wards: [
          { code: "00037", name: "Phường Phúc Tân" },
          { code: "00040", name: "Phường Đồng Xuân" },
          { code: "00043", name: "Phường Hàng Mã" },
          { code: "00046", name: "Phường Hàng Buồm" },
          { code: "00049", name: "Phường Hàng Đào" },
          { code: "00052", name: "Phường Hàng Bồ" },
          { code: "00055", name: "Phường Cửa Đông" },
          { code: "00058", name: "Phường Lý Thái Tổ" },
          { code: "00061", name: "Phường Hàng Bạc" },
          { code: "00064", name: "Phường Hàng Gai" },
          { code: "00067", name: "Phường Chương Dương Độ" },
          { code: "00070", name: "Phường Hàng Trống" },
          { code: "00073", name: "Phường Cửa Nam" },
          { code: "00076", name: "Phường Hàng Bông" },
          { code: "00079", name: "Phường Tràng Tiền" },
          { code: "00082", name: "Phường Tràng Thi" },
          { code: "00085", name: "Phường Quang Trung" },
          { code: "00088", name: "Phường Phan Chu Trinh" },
          { code: "00091", name: "Phường Hàng Bài" }
        ]
      },
      {
        code: "003",
        name: "Quận Tây Hồ",
        wards: [
          { code: "00094", name: "Phường Phú Thượng" },
          { code: "00097", name: "Phường Nhật Tân" },
          { code: "00100", name: "Phường Tứ Liên" },
          { code: "00103", name: "Phường Quảng An" },
          { code: "00106", name: "Phường Xuân La" },
          { code: "00109", name: "Phường Yên Phụ" },
          { code: "00112", name: "Phường Bưởi" },
          { code: "00115", name: "Phường Thụy Khuê" }
        ]
      },
      {
        code: "004",
        name: "Quận Long Biên",
        wards: [
          { code: "00118", name: "Phường Thượng Thanh" },
          { code: "00121", name: "Phường Ngọc Thụy" },
          { code: "00124", name: "Phường Giang Biên" },
          { code: "00127", name: "Phường Đức Giang" },
          { code: "00130", name: "Phường Việt Hưng" },
          { code: "00133", name: "Phường Gia Thụy" },
          { code: "00136", name: "Phường Ngọc Lâm" },
          { code: "00139", name: "Phường Phúc Lợi" },
          { code: "00142", name: "Phường Bồ Đề" },
          { code: "00145", name: "Phường Sài Đồng" },
          { code: "00148", name: "Phường Long Biên" },
          { code: "00151", name: "Phường Thạch Bàn" },
          { code: "00154", name: "Phường Phúc Đồng" },
          { code: "00157", name: "Phường Cự Khối" }
        ]
      },
      {
        code: "005",
        name: "Quận Cầu Giấy",
        wards: [
          { code: "00160", name: "Phường Nghĩa Đô" },
          { code: "00163", name: "Phường Nghĩa Tân" },
          { code: "00166", name: "Phường Mai Dịch" },
          { code: "00169", name: "Phường Dịch Vọng" },
          { code: "00172", name: "Phường Dịch Vọng Hậu" },
          { code: "00175", name: "Phường Quan Hoa" },
          { code: "00178", name: "Phường Yên Hòa" },
          { code: "00181", name: "Phường Trung Hòa" }
        ]
      }
    ]
  },
  {
    code: "79",
    name: "Thành phố Hồ Chí Minh",
    districts: [
      {
        code: "760",
        name: "Quận 1",
        wards: [
          { code: "26734", name: "Phường Tân Định" },
          { code: "26737", name: "Phường Đa Kao" },
          { code: "26740", name: "Phường Bến Nghé" },
          { code: "26743", name: "Phường Bến Thành" },
          { code: "26746", name: "Phường Nguyễn Thái Bình" },
          { code: "26749", name: "Phường Phạm Ngũ Lão" },
          { code: "26752", name: "Phường Cầu Ông Lãnh" },
          { code: "26755", name: "Phường Cô Giang" },
          { code: "26758", name: "Phường Nguyễn Cư Trinh" },
          { code: "26761", name: "Phường Cầu Kho" }
        ]
      },
      {
        code: "761",
        name: "Quận 2",
        wards: [
          { code: "26764", name: "Phường Thủ Thiêm" },
          { code: "26767", name: "Phường Thạnh Mỹ Lợi" },
          { code: "26770", name: "Phường An Phú" },
          { code: "26773", name: "Phường An Khánh" },
          { code: "26776", name: "Phường Bình An" },
          { code: "26779", name: "Phường Bình Khánh" },
          { code: "26782", name: "Phường Bình Trưng Đông" },
          { code: "26785", name: "Phường Bình Trưng Tây" },
          { code: "26788", name: "Phường Cát Lái" },
          { code: "26791", name: "Phường Thạnh Mỹ Lợi 2" },
          { code: "26794", name: "Phường Thủ Thiêm 2" }
        ]
      },
      {
        code: "762",
        name: "Quận 3",
        wards: [
          { code: "26797", name: "Phường 1" },
          { code: "26800", name: "Phường 2" },
          { code: "26803", name: "Phường 3" },
          { code: "26806", name: "Phường 4" },
          { code: "26809", name: "Phường 5" },
          { code: "26812", name: "Phường 6" },
          { code: "26815", name: "Phường 7" },
          { code: "26818", name: "Phường 8" },
          { code: "26821", name: "Phường 9" },
          { code: "26824", name: "Phường 10" },
          { code: "26827", name: "Phường 11" },
          { code: "26830", name: "Phường 12" },
          { code: "26833", name: "Phường 13" },
          { code: "26836", name: "Phường 14" }
        ]
      },
      {
        code: "763",
        name: "Quận 4",
        wards: [
          { code: "26839", name: "Phường 1" },
          { code: "26842", name: "Phường 2" },
          { code: "26845", name: "Phường 3" },
          { code: "26848", name: "Phường 4" },
          { code: "26851", name: "Phường 5" },
          { code: "26854", name: "Phường 6" },
          { code: "26857", name: "Phường 8" },
          { code: "26860", name: "Phường 9" },
          { code: "26863", name: "Phường 10" },
          { code: "26866", name: "Phường 12" },
          { code: "26869", name: "Phường 13" },
          { code: "26872", name: "Phường 14" },
          { code: "26875", name: "Phường 15" },
          { code: "26878", name: "Phường 16" },
          { code: "26881", name: "Phường 18" }
        ]
      },
      {
        code: "764",
        name: "Quận 5",
        wards: [
          { code: "26884", name: "Phường 1" },
          { code: "26887", name: "Phường 2" },
          { code: "26890", name: "Phường 3" },
          { code: "26893", name: "Phường 4" },
          { code: "26896", name: "Phường 5" },
          { code: "26899", name: "Phường 6" },
          { code: "26902", name: "Phường 7" },
          { code: "26905", name: "Phường 8" },
          { code: "26908", name: "Phường 9" },
          { code: "26911", name: "Phường 10" },
          { code: "26914", name: "Phường 11" },
          { code: "26917", name: "Phường 12" },
          { code: "26920", name: "Phường 13" },
          { code: "26923", name: "Phường 14" }
        ]
      },
      {
        code: "763",
        name: "Quận 4",
        wards: [
          { code: "26830", name: "Phường 1" },
          { code: "26833", name: "Phường 2" },
          { code: "26836", name: "Phường 3" },
          { code: "26839", name: "Phường 4" },
          { code: "26842", name: "Phường 5" },
          { code: "26845", name: "Phường 6" },
          { code: "26848", name: "Phường 8" },
          { code: "26851", name: "Phường 9" },
          { code: "26854", name: "Phường 10" },
          { code: "26857", name: "Phường 12" },
          { code: "26860", name: "Phường 13" },
          { code: "26863", name: "Phường 14" },
          { code: "26866", name: "Phường 15" },
          { code: "26869", name: "Phường 16" },
          { code: "26872", name: "Phường 18" }
        ]
      },
      {
        code: "765",
        name: "Quận 5",
        wards: [
          { code: "26875", name: "Phường 1" },
          { code: "26878", name: "Phường 2" },
          { code: "26881", name: "Phường 3" },
          { code: "26884", name: "Phường 4" },
          { code: "26887", name: "Phường 5" },
          { code: "26890", name: "Phường 6" },
          { code: "26893", name: "Phường 7" },
          { code: "26896", name: "Phường 8" },
          { code: "26899", name: "Phường 9" },
          { code: "26902", name: "Phường 10" },
          { code: "26905", name: "Phường 11" },
          { code: "26908", name: "Phường 12" },
          { code: "26911", name: "Phường 13" },
          { code: "26914", name: "Phường 14" },
          { code: "26917", name: "Phường 15" }
        ]
      },
      {
        code: "766",
        name: "Quận 6",
        wards: [
          { code: "26920", name: "Phường 1" },
          { code: "26923", name: "Phường 2" },
          { code: "26926", name: "Phường 3" },
          { code: "26929", name: "Phường 4" },
          { code: "26932", name: "Phường 5" },
          { code: "26935", name: "Phường 6" },
          { code: "26938", name: "Phường 7" },
          { code: "26941", name: "Phường 8" },
          { code: "26944", name: "Phường 9" },
          { code: "26947", name: "Phường 10" },
          { code: "26950", name: "Phường 11" },
          { code: "26953", name: "Phường 12" },
          { code: "26956", name: "Phường 13" },
          { code: "26959", name: "Phường 14" }
        ]
      },
      {
        code: "766",
        name: "Quận 7",
        wards: [
          { code: "26962", name: "Phường Tân Thuận Đông" },
          { code: "26965", name: "Phường Tân Thuận Tây" },
          { code: "26968", name: "Phường Tân Kiểng" },
          { code: "26971", name: "Phường Tân Hưng" },
          { code: "26974", name: "Phường Bình Thuận" },
          { code: "26977", name: "Phường Tân Quy" },
          { code: "26980", name: "Phường Phú Thuận" },
          { code: "26983", name: "Phường Tân Phú" },
          { code: "26986", name: "Phường Tân Phong" },
          { code: "26989", name: "Phường Phú Mỹ" }
        ]
      },
      {
        code: "767",
        name: "Quận 8",
        wards: [
          { code: "26992", name: "Phường 1" },
          { code: "26995", name: "Phường 2" },
          { code: "26998", name: "Phường 3" },
          { code: "27001", name: "Phường 4" },
          { code: "27004", name: "Phường 5" },
          { code: "27007", name: "Phường 6" },
          { code: "27010", name: "Phường 7" },
          { code: "27013", name: "Phường 8" },
          { code: "27016", name: "Phường 9" },
          { code: "27019", name: "Phường 10" },
          { code: "27022", name: "Phường 11" },
          { code: "27025", name: "Phường 12" },
          { code: "27028", name: "Phường 13" },
          { code: "27031", name: "Phường 14" },
          { code: "27034", name: "Phường 15" },
          { code: "27037", name: "Phường 16" }
        ]
      },
      {
        code: "768",
        name: "Quận 9",
        wards: [
          { code: "27040", name: "Phường Long Bình" },
          { code: "27043", name: "Phường Long Thạnh Mỹ" },
          { code: "27046", name: "Phường Tân Phú" },
          { code: "27049", name: "Phường Hiệp Phú" },
          { code: "27052", name: "Phường Tăng Nhơn Phú A" },
          { code: "27055", name: "Phường Tăng Nhơn Phú B" },
          { code: "27058", name: "Phường Phước Long A" },
          { code: "27061", name: "Phường Phước Long B" },
          { code: "27064", name: "Phường Trường Thạnh" },
          { code: "27067", name: "Phường Long Phước" },
          { code: "27070", name: "Phường Long Trường" },
          { code: "27073", name: "Phường Phước Bình" },
          { code: "27076", name: "Phường Phú Hữu" },
          { code: "27079", name: "Phường Thạnh Mỹ Lợi" },
          { code: "27082", name: "Phường An Phú" },
          { code: "27085", name: "Phường An Khánh" },
          { code: "27088", name: "Phường Bình An" },
          { code: "27091", name: "Phường Bình Khánh" },
          { code: "27094", name: "Phường Bình Trưng Đông" },
          { code: "27097", name: "Phường Bình Trưng Tây" },
          { code: "27100", name: "Phường Cát Lái" }
        ]
      },
      {
        code: "769",
        name: "Quận 10",
        wards: [
          { code: "27103", name: "Phường 1" },
          { code: "27106", name: "Phường 2" },
          { code: "27109", name: "Phường 3" },
          { code: "27112", name: "Phường 4" },
          { code: "27115", name: "Phường 5" },
          { code: "27118", name: "Phường 6" },
          { code: "27121", name: "Phường 7" },
          { code: "27124", name: "Phường 8" },
          { code: "27127", name: "Phường 9" },
          { code: "27130", name: "Phường 10" },
          { code: "27133", name: "Phường 11" },
          { code: "27136", name: "Phường 12" },
          { code: "27139", name: "Phường 13" },
          { code: "27142", name: "Phường 14" },
          { code: "27145", name: "Phường 15" }
        ]
      },
      {
        code: "770",
        name: "Quận 11",
        wards: [
          { code: "27148", name: "Phường 1" },
          { code: "27151", name: "Phường 2" },
          { code: "27154", name: "Phường 3" },
          { code: "27157", name: "Phường 4" },
          { code: "27160", name: "Phường 5" },
          { code: "27163", name: "Phường 6" },
          { code: "27166", name: "Phường 7" },
          { code: "27169", name: "Phường 8" },
          { code: "27172", name: "Phường 9" },
          { code: "27175", name: "Phường 10" },
          { code: "27178", name: "Phường 11" },
          { code: "27181", name: "Phường 12" },
          { code: "27184", name: "Phường 13" },
          { code: "27187", name: "Phường 14" },
          { code: "27190", name: "Phường 15" },
          { code: "27193", name: "Phường 16" }
        ]
      },
      {
        code: "771",
        name: "Quận 12",
        wards: [
          { code: "27196", name: "Phường Thạnh Xuân" },
          { code: "27199", name: "Phường Thạnh Lộc" },
          { code: "27202", name: "Phường Hiệp Thành" },
          { code: "27205", name: "Phường Thới An" },
          { code: "27208", name: "Phường Tân Chánh Hiệp" },
          { code: "27211", name: "Phường An Phú Đông" },
          { code: "27214", name: "Phường Tân Thới Hiệp" },
          { code: "27217", name: "Phường Trung Mỹ Tây" },
          { code: "27220", name: "Phường Tân Hưng Thuận" },
          { code: "27223", name: "Phường Đông Hưng Thuận" },
          { code: "27226", name: "Phường Tân Thới Nhì" },
          { code: "27229", name: "Phường Tân Thới Nhất" },
          { code: "27232", name: "Phường Linh Xuân" },
          { code: "27235", name: "Phường Linh Trung" },
          { code: "27238", name: "Phường Tân Phú" },
          { code: "27241", name: "Phường Hiệp Bình Phước" },
          { code: "27244", name: "Phường Hiệp Bình Chánh" },
          { code: "27247", name: "Phường Tam Bình" },
          { code: "27250", name: "Phường Tam Phú" },
          { code: "27253", name: "Phường Linh Chiểu" },
          { code: "27256", name: "Phường Linh Tây" },
          { code: "27259", name: "Phường Linh Đông" },
          { code: "27262", name: "Phường Bình Thọ" },
          { code: "27265", name: "Phường Trường Thọ" }
        ]
      },
      {
        code: "772",
        name: "Quận Thủ Đức",
        wards: [
          { code: "27268", name: "Phường Linh Xuân" },
          { code: "27271", name: "Phường Linh Trung" },
          { code: "27274", name: "Phường Tân Phú" },
          { code: "27277", name: "Phường Hiệp Bình Phước" },
          { code: "27280", name: "Phường Hiệp Bình Chánh" },
          { code: "27283", name: "Phường Tam Bình" },
          { code: "27286", name: "Phường Tam Phú" },
          { code: "27289", name: "Phường Linh Chiểu" },
          { code: "27292", name: "Phường Linh Tây" },
          { code: "27295", name: "Phường Linh Đông" },
          { code: "27298", name: "Phường Bình Thọ" },
          { code: "27301", name: "Phường Trường Thọ" },
          { code: "27304", name: "Phường Long Bình" },
          { code: "27307", name: "Phường Long Thạnh Mỹ" },
          { code: "27310", name: "Phường Tân Phú" },
          { code: "27313", name: "Phường Hiệp Phú" },
          { code: "27316", name: "Phường Tăng Nhơn Phú A" },
          { code: "27319", name: "Phường Tăng Nhơn Phú B" },
          { code: "27322", name: "Phường Phước Long A" },
          { code: "27325", name: "Phường Phước Long B" },
          { code: "27328", name: "Phường Trường Thạnh" },
          { code: "27331", name: "Phường Long Phước" },
          { code: "27334", name: "Phường Long Trường" },
          { code: "27337", name: "Phường Phước Bình" },
          { code: "27340", name: "Phường Phú Hữu" },
          { code: "27343", name: "Phường Thạnh Mỹ Lợi" },
          { code: "27346", name: "Phường An Phú" },
          { code: "27349", name: "Phường An Khánh" },
          { code: "27352", name: "Phường Bình An" },
          { code: "27355", name: "Phường Bình Khánh" },
          { code: "27358", name: "Phường Bình Trưng Đông" },
          { code: "27361", name: "Phường Bình Trưng Tây" },
          { code: "27364", name: "Phường Cát Lái" }
        ]
      },
      {
        code: "773",
        name: "Quận Gò Vấp",
        wards: [
          { code: "27367", name: "Phường 1" },
          { code: "27370", name: "Phường 3" },
          { code: "27373", name: "Phường 4" },
          { code: "27376", name: "Phường 5" },
          { code: "27379", name: "Phường 6" },
          { code: "27382", name: "Phường 7" },
          { code: "27385", name: "Phường 8" },
          { code: "27388", name: "Phường 9" },
          { code: "27391", name: "Phường 10" },
          { code: "27394", name: "Phường 11" },
          { code: "27397", name: "Phường 12" },
          { code: "27400", name: "Phường 13" },
          { code: "27403", name: "Phường 14" },
          { code: "27406", name: "Phường 15" },
          { code: "27409", name: "Phường 16" },
          { code: "27412", name: "Phường 17" }
        ]
      },
      {
        code: "774",
        name: "Quận Bình Thạnh",
        wards: [
          { code: "27415", name: "Phường 1" },
          { code: "27418", name: "Phường 2" },
          { code: "27421", name: "Phường 3" },
          { code: "27424", name: "Phường 5" },
          { code: "27427", name: "Phường 6" },
          { code: "27430", name: "Phường 7" },
          { code: "27433", name: "Phường 11" },
          { code: "27436", name: "Phường 12" },
          { code: "27439", name: "Phường 13" },
          { code: "27442", name: "Phường 14" },
          { code: "27445", name: "Phường 15" },
          { code: "27448", name: "Phường 17" },
          { code: "27451", name: "Phường 19" },
          { code: "27454", name: "Phường 21" },
          { code: "27457", name: "Phường 22" },
          { code: "27460", name: "Phường 24" },
          { code: "27463", name: "Phường 25" },
          { code: "27466", name: "Phường 26" },
          { code: "27469", name: "Phường 27" },
          { code: "27472", name: "Phường 28" }
        ]
      },
      {
        code: "775",
        name: "Quận Tân Bình",
        wards: [
          { code: "27475", name: "Phường 1" },
          { code: "27478", name: "Phường 2" },
          { code: "27481", name: "Phường 3" },
          { code: "27484", name: "Phường 4" },
          { code: "27487", name: "Phường 5" },
          { code: "27490", name: "Phường 6" },
          { code: "27493", name: "Phường 7" },
          { code: "27496", name: "Phường 8" },
          { code: "27499", name: "Phường 9" },
          { code: "27502", name: "Phường 10" },
          { code: "27505", name: "Phường 11" },
          { code: "27508", name: "Phường 12" },
          { code: "27511", name: "Phường 13" },
          { code: "27514", name: "Phường 14" },
          { code: "27517", name: "Phường 15" }
        ]
      },
      {
        code: "776",
        name: "Quận Tân Phú",
        wards: [
          { code: "27520", name: "Phường Tân Sơn Nhì" },
          { code: "27523", name: "Phường Tây Thạnh" },
          { code: "27526", name: "Phường Sơn Kỳ" },
          { code: "27529", name: "Phường Tân Quý" },
          { code: "27532", name: "Phường Tân Thành" },
          { code: "27535", name: "Phường Phú Thọ Hòa" },
          { code: "27538", name: "Phường Phú Thạnh" },
          { code: "27541", name: "Phường Phú Trung" },
          { code: "27544", name: "Phường Hòa Thạnh" },
          { code: "27547", name: "Phường Hiệp Tân" },
          { code: "27550", name: "Phường Tân Thới Hòa" }
        ]
      },
      {
        code: "777",
        name: "Quận Phú Nhuận",
        wards: [
          { code: "27553", name: "Phường 1" },
          { code: "27556", name: "Phường 2" },
          { code: "27559", name: "Phường 3" },
          { code: "27562", name: "Phường 4" },
          { code: "27565", name: "Phường 5" },
          { code: "27568", name: "Phường 7" },
          { code: "27571", name: "Phường 8" },
          { code: "27574", name: "Phường 9" },
          { code: "27577", name: "Phường 10" },
          { code: "27580", name: "Phường 11" },
          { code: "27583", name: "Phường 13" },
          { code: "27586", name: "Phường 15" },
          { code: "27589", name: "Phường 17" }
        ]
      },
      {
        code: "778",
        name: "Huyện Hóc Môn",
        wards: [
          { code: "27592", name: "Thị trấn Hóc Môn" },
          { code: "27595", name: "Xã Tân Hiệp" },
          { code: "27598", name: "Xã Nhị Bình" },
          { code: "27601", name: "Xã Đông Thạnh" },
          { code: "27604", name: "Xã Tân Thới Nhì" },
          { code: "27607", name: "Xã Thới Tam Thôn" },
          { code: "27610", name: "Xã Xuân Thới Sơn" },
          { code: "27613", name: "Xã Tân Xuân" },
          { code: "27616", name: "Xã Xuân Thới Đông" },
          { code: "27619", name: "Xã Trung Chánh" },
          { code: "27622", name: "Xã Xuân Thới Thượng" },
          { code: "27625", name: "Xã Bà Điểm" }
        ]
      },
      {
        code: "779",
        name: "Huyện Củ Chi",
        wards: [
          { code: "27628", name: "Thị trấn Củ Chi" },
          { code: "27631", name: "Xã Phú Mỹ Hưng" },
          { code: "27634", name: "Xã An Phú" },
          { code: "27637", name: "Xã Trung Lập Thượng" },
          { code: "27640", name: "Xã Trung Lập Hạ" },
          { code: "27643", name: "Xã Trung An" },
          { code: "27646", name: "Xã Phước Hiệp" },
          { code: "27649", name: "Xã Nhị Bình" },
          { code: "27652", name: "Xã Đông Thạnh" },
          { code: "27655", name: "Xã Tân Thạnh Đông" },
          { code: "27658", name: "Xã Tân Thạnh Tây" },
          { code: "27661", name: "Xã Tân Phú Trung" },
          { code: "27664", name: "Xã Thái Mỹ" },
          { code: "27667", name: "Xã Tân Hòa" },
          { code: "27670", name: "Xã Tăng Nhơn Phú" },
          { code: "27673", name: "Xã Tân An Hội" },
          { code: "27676", name: "Xã Phước Vĩnh An" },
          { code: "27679", name: "Xã Thái Mỹ" },
          { code: "27682", name: "Xã Tân Bình" },
          { code: "27685", name: "Xã Bình Mỹ" },
          { code: "27688", name: "Xã Tân Nhựt" },
          { code: "27691", name: "Xã Tân Kiên" },
          { code: "27694", name: "Xã Hưng Long" },
          { code: "27697", name: "Xã Đa Phước" },
          { code: "27700", name: "Xã Tân Quý Tây" },
          { code: "27703", name: "Xã Bình Chánh" },
          { code: "27706", name: "Xã Quy Đức" }
        ]
      },
      {
        code: "780",
        name: "Huyện Bình Chánh",
        wards: [
          { code: "27709", name: "Thị trấn Tân Túc" },
          { code: "27712", name: "Xã Phạm Văn Hai" },
          { code: "27715", name: "Xã Vĩnh Lộc A" },
          { code: "27718", name: "Xã Vĩnh Lộc B" },
          { code: "27721", name: "Xã Bình Lợi" },
          { code: "27724", name: "Xã Lê Minh Xuân" },
          { code: "27727", name: "Xã Tân Nhựt" },
          { code: "27730", name: "Xã Tân Kiên" },
          { code: "27733", name: "Xã Bình Hưng" },
          { code: "27736", name: "Xã Phong Phú" },
          { code: "27739", name: "Xã An Phú Tây" },
          { code: "27742", name: "Xã Hưng Long" },
          { code: "27745", name: "Xã Đa Phước" },
          { code: "27748", name: "Xã Tân Quý Tây" },
          { code: "27751", name: "Xã Bình Chánh" },
          { code: "27754", name: "Xã Quy Đức" }
        ]
      },
      {
        code: "781",
        name: "Huyện Nhà Bè",
        wards: [
          { code: "27757", name: "Thị trấn Nhà Bè" },
          { code: "27760", name: "Xã Phước Kiển" },
          { code: "27763", name: "Xã Phước Lộc" },
          { code: "27766", name: "Xã Nhơn Đức" },
          { code: "27769", name: "Xã Phú Xuân" },
          { code: "27772", name: "Xã Long Thới" },
          { code: "27775", name: "Xã Hiệp Phước" }
        ]
      },
      {
        code: "782",
        name: "Huyện Cần Giờ",
        wards: [
          { code: "27778", name: "Thị trấn Cần Thạnh" },
          { code: "27781", name: "Xã Bình Khánh" },
          { code: "27784", name: "Xã Tam Thôn Hiệp" },
          { code: "27787", name: "Xã An Thới Đông" },
          { code: "27790", name: "Xã Thạnh An" },
          { code: "27793", name: "Xã Long Hòa" },
          { code: "27796", name: "Xã Lý Nhơn" }
        ]
      }
    ]
  },
  {
    code: "48",
    name: "Thành phố Đà Nẵng",
    districts: [
      {
        code: "490",
        name: "Quận Hải Châu",
        wards: [
          { code: "20305", name: "Phường Thạch Thang" },
          { code: "20308", name: "Phường Hải Châu I" },
          { code: "20311", name: "Phường Hải Châu II" },
          { code: "20314", name: "Phường Phước Ninh" },
          { code: "20317", name: "Phường Hòa Thuận Tây" },
          { code: "20320", name: "Phường Hòa Thuận Đông" },
          { code: "20323", name: "Phường Nam Dương" },
          { code: "20326", name: "Phường Bình Hiên" },
          { code: "20329", name: "Phường Bình Thuận" },
          { code: "20332", name: "Phường Hòa Cường Bắc" },
          { code: "20335", name: "Phường Hòa Cường Nam" }
        ]
      },
      {
        code: "491",
        name: "Quận Thanh Khê",
        wards: [
          { code: "20338", name: "Phường Thạc Gián" },
          { code: "20341", name: "Phường An Khê" },
          { code: "20344", name: "Phường Hòa Khê" },
          { code: "20347", name: "Phường Thanh Lộc Đán" },
          { code: "20350", name: "Phường Liên Chiểu" },
          { code: "20353", name: "Phường Thanh Khê Tây" },
          { code: "20356", name: "Phường Thanh Khê Đông" },
          { code: "20359", name: "Phường Xuân Hà" },
          { code: "20362", name: "Phường Tân Chính" },
          { code: "20365", name: "Phường Chính Gián" }
        ]
      }
    ]
  },
  {
    code: "31",
    name: "Tỉnh Hải Phòng",
    districts: [
      {
        code: "311",
        name: "Quận Hồng Bàng",
        wards: [
          { code: "11551", name: "Phường Quán Toan" },
          { code: "11554", name: "Phường Hùng Vương" },
          { code: "11557", name: "Phường Sở Dầu" },
          { code: "11560", name: "Phường Thượng Lý" },
          { code: "11563", name: "Phường Hạ Lý" },
          { code: "11566", name: "Phường Minh Khai" },
          { code: "11569", name: "Phường Trại Cau" },
          { code: "11572", name: "Phường Lê Lợi" },
          { code: "11575", name: "Phường Lạc Viên" },
          { code: "11578", name: "Phường Lê Chân" },
          { code: "11581", name: "Phường Hàng Kênh" },
          { code: "11584", name: "Phường Đông Khê" },
          { code: "11587", name: "Phường Cát Dài" },
          { code: "11590", name: "Phường An Biên" }
        ]
      },
      {
        code: "312",
        name: "Quận Ngô Quyền",
        wards: [
          { code: "11593", name: "Phường Lam Sơn" },
          { code: "11596", name: "Phường An Dương" },
          { code: "11599", name: "Phường Trần Nguyên Hãn" },
          { code: "11602", name: "Phường Hồ Nam" },
          { code: "11605", name: "Phường Trại Cau" },
          { code: "11608", name: "Phường Lê Lợi" },
          { code: "11611", name: "Phường Hàng Kênh" },
          { code: "11614", name: "Phường Đông Khê" },
          { code: "11617", name: "Phường Niệm Nghĩa" },
          { code: "11620", name: "Phường Nghĩa Xá" },
          { code: "11623", name: "Phường Dư Hàng Kênh" },
          { code: "11626", name: "Phường Kênh Dương" },
          { code: "11629", name: "Phường Vĩnh Niệm" }
        ]
      }
    ]
  },
  {
    code: "92",
    name: "Tỉnh Cần Thơ",
    districts: [
      {
        code: "918",
        name: "Quận Ninh Kiều",
        wards: [
          { code: "31234", name: "Phường Cái Khế" },
          { code: "31237", name: "Phường An Hòa" },
          { code: "31240", name: "Phường Thới Bình" },
          { code: "31243", name: "Phường An Nghiệp" },
          { code: "31246", name: "Phường An Cư" },
          { code: "31249", name: "Phường Tân An" },
          { code: "31252", name: "Phường An Phú" },
          { code: "31255", name: "Phường Xuân Khánh" },
          { code: "31258", name: "Phường Hưng Lợi" },
          { code: "31261", name: "Phường An Khánh" },
          { code: "31264", name: "Phường An Bình" }
        ]
      },
      {
        code: "919",
        name: "Quận Ô Môn",
        wards: [
          { code: "31267", name: "Phường Châu Văn Liêm" },
          { code: "31270", name: "Phường Thới Hòa" },
          { code: "31273", name: "Phường Thới Long" },
          { code: "31276", name: "Phường Long Hưng" },
          { code: "31279", name: "Phường Thới An" },
          { code: "31282", name: "Phường Phước Thới" },
          { code: "31285", name: "Phường Trường Lạc" }
        ]
      }
    ]
  },
  {
    code: "56",
    name: "Tỉnh Khánh Hòa",
    districts: [
      {
        code: "568",
        name: "Thành phố Nha Trang",
        wards: [
          { code: "22423", name: "Phường Vạn Thạnh" },
          { code: "22426", name: "Phường Phương Sài" },
          { code: "22429", name: "Phường Phương Sơn" },
          { code: "22432", name: "Phường Phước Hải" },
          { code: "22435", name: "Phường Phước Tân" },
          { code: "22438", name: "Phường Lộc Thọ" },
          { code: "22441", name: "Phường Phước Tiến" },
          { code: "22444", name: "Phường Tân Lập" },
          { code: "22447", name: "Phường Phước Hòa" },
          { code: "22450", name: "Phường Vĩnh Nguyên" },
          { code: "22453", name: "Phường Phước Long" },
          { code: "22456", name: "Phường Vĩnh Trường" },
          { code: "22459", name: "Phường Vĩnh Hòa" },
          { code: "22462", name: "Phường Vĩnh Thạnh" },
          { code: "22465", name: "Phường Vĩnh Phước" },
          { code: "22468", name: "Phường Ngọc Hiệp" },
          { code: "22471", name: "Phường Vĩnh Thọ" },
          { code: "22474", name: "Phường Xương Huân" },
          { code: "22477", name: "Phường Vạn Thắng" },
          { code: "22480", name: "Phường Vạn Thạnh" },
          { code: "22483", name: "Phường Phương Sài" },
          { code: "22486", name: "Phường Phương Sơn" },
          { code: "22489", name: "Phường Phước Hải" },
          { code: "22492", name: "Phường Phước Tân" },
          { code: "22495", name: "Phường Lộc Thọ" },
          { code: "22498", name: "Phường Phước Tiến" },
          { code: "22501", name: "Phường Tân Lập" },
          { code: "22504", name: "Phường Phước Hòa" }
        ]
      }
    ]
  },
  {
    code: "36",
    name: "Tỉnh Thái Nguyên",
    districts: [
      {
        code: "360",
        name: "Thành phố Thái Nguyên",
        wards: [
          { code: "13900", name: "Phường Hoàng Văn Thụ" },
          { code: "13903", name: "Phường Tam Thanh" },
          { code: "13906", name: "Phường Đồng Quang" },
          { code: "13909", name: "Phường Tân Thịnh" },
          { code: "13912", name: "Phường Thịnh Đán" },
          { code: "13915", name: "Phường Đồng Bẩm" },
          { code: "13918", name: "Phường Lương Sơn" },
          { code: "13921", name: "Phường Chùa Hang" },
          { code: "13924", name: "Phường Mỏ Chè" },
          { code: "13927", name: "Phường Cải Đan" },
          { code: "13930", name: "Phường Thắng Lợi" },
          { code: "13933", name: "Phường Phố Cò" },
          { code: "13936", name: "Phường Tân Long" },
          { code: "13939", name: "Phường Bách Quang" },
          { code: "13942", name: "Phường Đồng Tiến" },
          { code: "13945", name: "Phường Tân Hương" },
          { code: "13948", name: "Phường Tân Thành" },
          { code: "13951", name: "Phường Hương Sơn" },
          { code: "13954", name: "Phường Tân Quang" },
          { code: "13957", name: "Phường Đồng Bẩm" }
        ]
      },
      {
        code: "361",
        name: "Thành phố Sông Công",
        wards: [
          { code: "13960", name: "Phường Bá Xuyên" },
          { code: "13963", name: "Phường Bách Quang" },
          { code: "13966", name: "Phường Đồng Tiến" },
          { code: "13969", name: "Phường Tân Hương" },
          { code: "13972", name: "Phường Tân Thành" },
          { code: "13975", name: "Phường Hương Sơn" },
          { code: "13978", name: "Phường Tân Quang" },
          { code: "13981", name: "Phường Đồng Bẩm" }
        ]
      }
    ]
  },
  {
    code: "17",
    name: "Tỉnh Hoà Bình",
    districts: [
      {
        code: "170",
        name: "Thành phố Hòa Bình",
        wards: [
          { code: "05620", name: "Phường Thịnh Lang" },
          { code: "05623", name: "Phường Hữu Nghị" },
          { code: "05626", name: "Phường Tân Thịnh" },
          { code: "05629", name: "Phường Đồng Tiến" },
          { code: "05632", name: "Phường Phương Lâm" },
          { code: "05635", name: "Phường Chăm Mát" },
          { code: "05638", name: "Phường Yên Mông" },
          { code: "05641", name: "Phường Sủ Ngòi" },
          { code: "05644", name: "Phường Dân Chủ" },
          { code: "05647", name: "Phường Thái Bình" },
          { code: "05650", name: "Phường Thịnh Lang" },
          { code: "05653", name: "Phường Hữu Nghị" },
          { code: "05656", name: "Phường Tân Thịnh" },
          { code: "05659", name: "Phường Đồng Tiến" },
          { code: "05662", name: "Phường Phương Lâm" },
          { code: "05665", name: "Phường Chăm Mát" },
          { code: "05668", name: "Phường Yên Mông" },
          { code: "05671", name: "Phường Sủ Ngòi" },
          { code: "05674", name: "Phường Dân Chủ" },
          { code: "05677", name: "Phường Thái Bình" }
        ]
      }
    ]
  },
  {
    code: "25",
    name: "Tỉnh Phú Thọ",
    districts: [
      {
        code: "250",
        name: "Thành phố Việt Trì",
        wards: [
          { code: "09025", name: "Phường Tiên Cát" },
          { code: "09028", name: "Phường Tân Dân" },
          { code: "09031", name: "Phường Vân Cơ" },
          { code: "09034", name: "Phường Nông Trang" },
          { code: "09037", name: "Phường Tân Sơn" },
          { code: "09040", name: "Phường Minh Nông" },
          { code: "09043", name: "Phường Sông Lô" },
          { code: "09046", name: "Phường Trưng Vương" },
          { code: "09049", name: "Phường Thọ Sơn" },
          { code: "09052", name: "Phường Hùng Vương" },
          { code: "09055", name: "Phường Phong Châu" },
          { code: "09058", name: "Phường Âu Cơ" },
          { code: "09061", name: "Phường Hạc Trì" },
          { code: "09064", name: "Phường Thanh Miếu" },
          { code: "09067", name: "Phường Bạch Hạc" },
          { code: "09070", name: "Phường Bến Gót" },
          { code: "09073", name: "Phường Vân Phú" },
          { code: "09076", name: "Phường Phượng Lâu" },
          { code: "09079", name: "Phường Thụy Vân" },
          { code: "09082", name: "Phường Minh Phương" },
          { code: "09085", name: "Phường Trưng Vương" },
          { code: "09088", name: "Phường Minh Nông" },
          { code: "09091", name: "Phường Sông Lô" },
          { code: "09094", name: "Phường Kim Đức" },
          { code: "09097", name: "Phường Hùng Lô" },
          { code: "09100", name: "Phường Hy Cương" },
          { code: "09103", name: "Phường Chu Hóa" },
          { code: "09106", name: "Phường Thanh Đình" }
        ]
      }
    ]
  },
  {
    code: "26",
    name: "Tỉnh Vĩnh Phúc",
    districts: [
      {
        code: "260",
        name: "Thành phố Vĩnh Yên",
        wards: [
          { code: "09109", name: "Phường Hội Hợp" },
          { code: "09112", name: "Phường Thống Nhất" },
          { code: "09115", name: "Phường Đồng Tâm" },
          { code: "09118", name: "Phường Tân Hưng" },
          { code: "09121", name: "Phường Thanh Trù" },
          { code: "09124", name: "Phường Tích Sơn" },
          { code: "09127", name: "Phường Liên Bảo" },
          { code: "09130", name: "Phường Hội Hợp" },
          { code: "09133", name: "Phường Thống Nhất" },
          { code: "09136", name: "Phường Đồng Tâm" },
          { code: "09139", name: "Phường Tân Hưng" },
          { code: "09142", name: "Phường Thanh Trù" },
          { code: "09145", name: "Phường Tích Sơn" },
          { code: "09148", name: "Phường Liên Bảo" }
        ]
      },
      {
        code: "261",
        name: "Thành phố Phúc Yên",
        wards: [
          { code: "09151", name: "Phường Xuân Hòa" },
          { code: "09154", name: "Phường Phúc Thắng" },
          { code: "09157", name: "Phường Hùng Vương" },
          { code: "09160", name: "Phường Trưng Nhị" },
          { code: "09163", name: "Phường Phúc Thắng" },
          { code: "09166", name: "Phường Xuân Hòa" },
          { code: "09169", name: "Phường Hùng Vương" },
          { code: "09172", name: "Phường Trưng Nhị" }
        ]
      }
    ]
  },
  {
    code: "27",
    name: "Tỉnh Bắc Ninh",
    districts: [
      {
        code: "270",
        name: "Thành phố Bắc Ninh",
        wards: [
          { code: "09175", name: "Phường Võ Cường" },
          { code: "09178", name: "Phường Hòa Long" },
          { code: "09181", name: "Phường Vạn An" },
          { code: "09184", name: "Phường Khúc Xuyên" },
          { code: "09187", name: "Phường Phong Khê" },
          { code: "09190", name: "Phường Kim Chân" },
          { code: "09193", name: "Phường Vân Dương" },
          { code: "09196", name: "Phường Nam Sơn" },
          { code: "09199", name: "Phường Khắc Niệm" },
          { code: "09202", name: "Phường Hạp Lĩnh" },
          { code: "09205", name: "Phường Đại Phúc" },
          { code: "09208", name: "Phường Ninh Xá" },
          { code: "09211", name: "Phường Suối Hoa" },
          { code: "09214", name: "Phường Võ Cường" },
          { code: "09217", name: "Phường Hòa Long" },
          { code: "09220", name: "Phường Vạn An" },
          { code: "09223", name: "Phường Khúc Xuyên" },
          { code: "09226", name: "Phường Phong Khê" },
          { code: "09229", name: "Phường Kim Chân" },
          { code: "09232", name: "Phường Vân Dương" },
          { code: "09235", name: "Phường Nam Sơn" },
          { code: "09238", name: "Phường Khắc Niệm" },
          { code: "09241", name: "Phường Hạp Lĩnh" },
          { code: "09244", name: "Phường Đại Phúc" },
          { code: "09247", name: "Phường Ninh Xá" },
          { code: "09250", name: "Phường Suối Hoa" }
        ]
      }
    ]
  },
  {
    code: "30",
    name: "Tỉnh Hải Dương",
    districts: [
      {
        code: "300",
        name: "Thành phố Hải Dương",
        wards: [
          { code: "11173", name: "Phường Bình Hàn" },
          { code: "11176", name: "Phường Nguyễn Trãi" },
          { code: "11179", name: "Phường Nhị Châu" },
          { code: "11182", name: "Phường Hải Tân" },
          { code: "11185", name: "Phường Lê Thanh Nghị" },
          { code: "11188", name: "Phường Hải Châu" },
          { code: "11191", name: "Phường Trần Phú" },
          { code: "11194", name: "Phường Trần Hưng Đạo" },
          { code: "11197", name: "Phường Thanh Bình" },
          { code: "11200", name: "Phường Lương Khánh Thiện" },
          { code: "11203", name: "Phường Tân Bình" },
          { code: "11206", name: "Phường Quang Trung" },
          { code: "11209", name: "Phường Phạm Ngũ Lão" },
          { code: "11212", name: "Phường Trần Đăng Ninh" },
          { code: "11215", name: "Phường Tứ Minh" },
          { code: "11218", name: "Phường Việt Hòa" },
          { code: "11221", name: "Phường Ái Quốc" },
          { code: "11224", name: "Phường An Thượng" },
          { code: "11227", name: "Phường Minh Đức" },
          { code: "11230", name: "Phường Nam Đồng" },
          { code: "11233", name: "Phường Cẩm Thượng" },
          { code: "11236", name: "Phường Hải Tân" },
          { code: "11239", name: "Phường Ái Quốc" },
          { code: "11242", name: "Phường An Thượng" },
          { code: "11245", name: "Phường Minh Đức" },
          { code: "11248", name: "Phường Nam Đồng" },
          { code: "11251", name: "Phường Cẩm Thượng" }
        ]
      }
    ]
  },
  {
    code: "33",
    name: "Tỉnh Hưng Yên",
    districts: [
      {
        code: "330",
        name: "Thành phố Hưng Yên",
        wards: [
          { code: "12100", name: "Phường Hiến Nam" },
          { code: "12103", name: "Phường An Tảo" },
          { code: "12106", name: "Phường Lê Lợi" },
          { code: "12109", name: "Phường Minh Khai" },
          { code: "12112", name: "Phường Quang Trung" },
          { code: "12115", name: "Phường Hồng Châu" },
          { code: "12118", name: "Phường Trưng Trắc" },
          { code: "12121", name: "Phường Hiến Nam" },
          { code: "12124", name: "Phường An Tảo" },
          { code: "12127", name: "Phường Lê Lợi" },
          { code: "12130", name: "Phường Minh Khai" },
          { code: "12133", name: "Phường Quang Trung" },
          { code: "12136", name: "Phường Hồng Châu" },
          { code: "12139", name: "Phường Trưng Trắc" }
        ]
      }
    ]
  },
  {
    code: "34",
    name: "Tỉnh Thái Bình",
    districts: [
      {
        code: "340",
        name: "Thành phố Thái Bình",
        wards: [
          { code: "13000", name: "Phường Lê Hồng Phong" },
          { code: "13003", name: "Phường Bồ Xuyên" },
          { code: "13006", name: "Phường Đề Thám" },
          { code: "13009", name: "Phường Kỳ Bá" },
          { code: "13012", name: "Phường Quang Trung" },
          { code: "13015", name: "Phường Vũ Phúc" },
          { code: "13018", name: "Phường Vũ Chính" },
          { code: "13021", name: "Phường Đông Thọ" },
          { code: "13024", name: "Phường Tân Bình" },
          { code: "13027", name: "Phường Lê Hồng Phong" },
          { code: "13030", name: "Phường Bồ Xuyên" },
          { code: "13033", name: "Phường Đề Thám" },
          { code: "13036", name: "Phường Kỳ Bá" },
          { code: "13039", name: "Phường Quang Trung" },
          { code: "13042", name: "Phường Vũ Phúc" },
          { code: "13045", name: "Phường Vũ Chính" },
          { code: "13048", name: "Phường Đông Thọ" },
          { code: "13051", name: "Phường Tân Bình" }
        ]
      }
    ]
  },
  {
    code: "35",
    name: "Tỉnh Hà Nam",
    districts: [
      {
        code: "350",
        name: "Thành phố Phủ Lý",
        wards: [
          { code: "13870", name: "Phường Quang Trung" },
          { code: "13873", name: "Phường Lương Khánh Thiện" },
          { code: "13876", name: "Phường Lê Hồng Phong" },
          { code: "13879", name: "Phường Minh Khai" },
          { code: "13882", name: "Phường Hai Bà Trưng" },
          { code: "13885", name: "Phường Trần Hưng Đạo" },
          { code: "13888", name: "Phường Lam Hạ" },
          { code: "13891", name: "Phường Phù Vân" },
          { code: "13894", name: "Phường Liêm Chính" },
          { code: "13897", name: "Phường Liêm Chung" },
          { code: "13900", name: "Phường Thanh Châu" },
          { code: "13903", name: "Phường Châu Sơn" },
          { code: "13906", name: "Phường Đồng Văn" },
          { code: "13909", name: "Phường Hòa Mạc" },
          { code: "13912", name: "Phường Mộc Bắc" },
          { code: "13915", name: "Phường Châu Giang" },
          { code: "13918", name: "Phường Bạch Thượng" },
          { code: "13921", name: "Phường Duy Minh" },
          { code: "13924", name: "Phường Mộc Nam" },
          { code: "13927", name: "Phường Duy Hải" },
          { code: "13930", name: "Phường Chuyên Ngoại" },
          { code: "13933", name: "Phường Yên Bắc" },
          { code: "13936", name: "Phường Trác Văn" },
          { code: "13939", name: "Phường Tiên Nội" },
          { code: "13942", name: "Phường Hoàng Đông" },
          { code: "13945", name: "Phường Yên Nam" },
          { code: "13948", name: "Phường Tiên Ngoại" },
          { code: "13951", name: "Phường Tiên Sơn" }
        ]
      }
    ]
  },
  {
    code: "96",
    name: "Tỉnh Cà Mau",
    districts: [
      {
        code: "960",
        name: "Thành phố Cà Mau",
        wards: [
          { code: "32002", name: "Phường 5" },
          { code: "32005", name: "Phường 7" },
          { code: "32008", name: "Phường 8" },
          { code: "32011", name: "Phường 6" },
          { code: "32014", name: "Phường 2" },
          { code: "32017", name: "Phường 1" },
          { code: "32020", name: "Phường 4" },
          { code: "32023", name: "Phường 3" },
          { code: "32026", name: "Phường 9" },
          { code: "32029", name: "Phường 10" }
        ]
      }
    ]
  },
  {
    code: "94",
    name: "Tỉnh Sóc Trăng",
    districts: [
      {
        code: "940",
        name: "Thành phố Sóc Trăng",
        wards: [
          { code: "31465", name: "Phường 2" },
          { code: "31468", name: "Phường 3" },
          { code: "31471", name: "Phường 5" },
          { code: "31474", name: "Phường 7" },
          { code: "31477", name: "Phường 1" },
          { code: "31480", name: "Phường 8" },
          { code: "31483", name: "Phường Nhà Mát" },
          { code: "31486", name: "Phường Vĩnh Trường" },
          { code: "31489", name: "Xã Vĩnh Tân" },
          { code: "31492", name: "Xã Lai Hòa" }
        ]
      }
    ]
  },
  {
    code: "95",
    name: "Tỉnh Bạc Liêu",
    districts: [
      {
        code: "950",
        name: "Thành phố Bạc Liêu",
        wards: [
          { code: "31738", name: "Phường 2" },
          { code: "31741", name: "Phường 3" },
          { code: "31744", name: "Phường 5" },
          { code: "31747", name: "Phường 7" },
          { code: "31750", name: "Phường 1" },
          { code: "31753", name: "Phường 8" },
          { code: "31756", name: "Phường Nhà Mát" },
          { code: "31759", name: "Phường Vĩnh Trường" },
          { code: "31762", name: "Xã Vĩnh Tân" },
          { code: "31765", name: "Xã Lai Hòa" }
        ]
      }
    ]
  },
  {
    code: "93",
    name: "Tỉnh Hậu Giang",
    districts: [
      {
        code: "930",
        name: "Thành phố Vị Thanh",
        wards: [
          { code: "31288", name: "Phường I" },
          { code: "31291", name: "Phường III" },
          { code: "31294", name: "Phường IV" },
          { code: "31297", name: "Phường V" },
          { code: "31300", name: "Phường VII" },
          { code: "31303", name: "Xã Vị Tân" },
          { code: "31306", name: "Xã Hoả Lựu" },
          { code: "31309", name: "Xã Tân Tiến" },
          { code: "31312", name: "Xã Vị Thuỷ" },
          { code: "31315", name: "Xã Vị Thắng" },
          { code: "31318", name: "Xã Vĩnh Thuận Tây" },
          { code: "31321", name: "Xã Vĩnh Trung" },
          { code: "31324", name: "Xã Vĩnh Tường" },
          { code: "31327", name: "Xã Vị Đông" },
          { code: "31330", name: "Xã Vị Thanh" },
          { code: "31333", name: "Xã Vị Bình" }
        ]
      },
      {
        code: "931",
        name: "Thành phố Ngã Bảy",
        wards: [
          { code: "31336", name: "Phường Ngã Bảy" },
          { code: "31339", name: "Phường Lái Hiếu" },
          { code: "31342", name: "Phường Hiệp Thành" },
          { code: "31345", name: "Phường Hiệp Lợi" },
          { code: "31348", name: "Xã Đại Thành" },
          { code: "31351", name: "Xã Tân Thành" },
          { code: "31354", name: "Xã Mỹ Thạnh Trung" },
          { code: "31357", name: "Xã Tân Long" },
          { code: "31360", name: "Xã Mỹ Thạnh Tây" },
          { code: "31363", name: "Xã Mỹ Thạnh Đông" },
          { code: "31366", name: "Xã Bình Thành" },
          { code: "31369", name: "Xã Tân Bình" },
          { code: "31372", name: "Xã Tân Nhuận Đông" },
          { code: "31375", name: "Xã Nhơn Nghĩa A" },
          { code: "31378", name: "Xã Nhơn Nghĩa" },
          { code: "31381", name: "Xã Đông Thạnh" },
          { code: "31384", name: "Xã Đông Phú" },
          { code: "31387", name: "Xã Mỹ Thạnh" }
        ]
      }
    ]
  },
  {
    code: "54",
    name: "Tỉnh Phú Yên",
    districts: [
      {
        code: "540",
        name: "Thành phố Tuy Hòa",
        wards: [
          { code: "21460", name: "Phường 1" },
          { code: "21463", name: "Phường 2" },
          { code: "21466", name: "Phường 3" },
          { code: "21469", name: "Phường 4" },
          { code: "21472", name: "Phường 5" },
          { code: "21475", name: "Phường 6" },
          { code: "21478", name: "Phường 7" },
          { code: "21481", name: "Phường 8" },
          { code: "21484", name: "Phường 9" },
          { code: "21487", name: "Xã Phú Đông" },
          { code: "21490", name: "Xã An Phú" },
          { code: "21493", name: "Xã An Hòa" },
          { code: "21496", name: "Xã An Mỹ" },
          { code: "21499", name: "Xã An Thạnh" },
          { code: "21502", name: "Xã An Hải" },
          { code: "21505", name: "Xã An Chấn" },
          { code: "21508", name: "Xã An Ninh" },
          { code: "21511", name: "Xã An Thọ" },
          { code: "21514", name: "Xã An Phú" },
          { code: "21517", name: "Xã An Xuân" },
          { code: "21520", name: "Xã An Lĩnh" },
          { code: "21523", name: "Xã An Hòa Hải" },
          { code: "21526", name: "Xã An Hiệp" },
          { code: "21529", name: "Xã An Mỹ" },
          { code: "21532", name: "Xã An Thạnh" },
          { code: "21535", name: "Xã An Hải" },
          { code: "21538", name: "Xã An Chấn" },
          { code: "21541", name: "Xã An Ninh" },
          { code: "21544", name: "Xã An Thọ" }
        ]
      }
    ]
  },
  {
    code: "58",
    name: "Tỉnh Ninh Thuận",
    districts: [
      {
        code: "580",
        name: "Thành phố Phan Rang-Tháp Chàm",
        wards: [
          { code: "22507", name: "Phường Đô Vinh" },
          { code: "22510", name: "Phường Phước Mỹ" },
          { code: "22513", name: "Phường Bảo An" },
          { code: "22516", name: "Phường Phủ Hà" },
          { code: "22519", name: "Phường Thanh Sơn" },
          { code: "22522", name: "Phường Mỹ Hương" },
          { code: "22525", name: "Phường Tấn Tài" },
          { code: "22528", name: "Phường Kinh Dinh" },
          { code: "22531", name: "Phường Đạo Long" },
          { code: "22534", name: "Phường Đài Sơn" },
          { code: "22537", name: "Phường Đông Hải" },
          { code: "22540", name: "Phường Mỹ Đông" },
          { code: "22543", name: "Phường Thành Hải" },
          { code: "22546", name: "Phường Văn Hải" },
          { code: "22549", name: "Phường Mỹ Bình" },
          { code: "22552", name: "Phường Mỹ Hải" }
        ]
      }
    ]
  },
  {
    code: "62",
    name: "Tỉnh Kon Tum",
    districts: [
      {
        code: "620",
        name: "Thành phố Kon Tum",
        wards: [
          { code: "19735", name: "Phường Thắng Lợi" },
          { code: "19738", name: "Phường Nguyễn Trãi" },
          { code: "19741", name: "Phường Trần Hưng Đạo" },
          { code: "19744", name: "Phường Ngô Mây" },
          { code: "19747", name: "Phường Thống Nhất" },
          { code: "19750", name: "Phường Lê Lợi" },
          { code: "19753", name: "Phường Nguyễn Du" },
          { code: "19756", name: "Phường Trần Phú" },
          { code: "19759", name: "Phường Đắk Cấm" },
          { code: "19762", name: "Phường Kroong" },
          { code: "19765", name: "Phường Ngọk Bay" },
          { code: "19768", name: "Phường Vinh Quang" },
          { code: "19771", name: "Phường Đắk Blà" },
          { code: "19774", name: "Phường Ia Chim" },
          { code: "19777", name: "Phường Đăk Năng" },
          { code: "19780", name: "Phường Đoàn Kết" },
          { code: "19783", name: "Phường Chư Hreng" },
          { code: "19786", name: "Phường Đắk Rơ Wa" },
          { code: "19789", name: "Phường Hoa Lư" },
          { code: "19792", name: "Phường Đắk Glei" },
          { code: "19795", name: "Phường Đắk Plô" },
          { code: "19798", name: "Phường Đắk Man" },
          { code: "19801", name: "Phường Đắk Choong" },
          { code: "19804", name: "Phường Xốp" },
          { code: "19807", name: "Phường Mường Hoong" },
          { code: "19810", name: "Phường Ngọc Linh" },
          { code: "19813", name: "Phường Đắk Long" },
          { code: "19816", name: "Phường Đắk KRoong" },
          { code: "19819", name: "Phường Đắk Môn" }
        ]
      }
    ]
  },
  {
    code: "64",
    name: "Tỉnh Gia Lai",
    districts: [
      {
        code: "640",
        name: "Thành phố Pleiku",
        wards: [
          { code: "20260", name: "Phường Yên Đỗ" },
          { code: "20263", name: "Phường Diên Hồng" },
          { code: "20266", name: "Phường Ia Kring" },
          { code: "20269", name: "Phường Hội Thương" },
          { code: "20272", name: "Phường Hội Phú" },
          { code: "20275", name: "Phường Phù Đổng" },
          { code: "20278", name: "Phường Hoa Lư" },
          { code: "20281", name: "Phường Tây Sơn" },
          { code: "20284", name: "Phường Thống Nhất" },
          { code: "20287", name: "Phường Đống Đa" },
          { code: "20290", name: "Phường Trà Bá" },
          { code: "20293", name: "Phường Thắng Lợi" },
          { code: "20296", name: "Phường Yên Thế" },
          { code: "20299", name: "Phường Chi Lăng" },
          { code: "20302", name: "Xã Biển Hồ" },
          { code: "20305", name: "Xã Tân Sơn" },
          { code: "20308", name: "Xã Trà Đa" },
          { code: "20311", name: "Xã Chư Á" },
          { code: "20314", name: "Xã An Phú" },
          { code: "20317", name: "Xã Diên Phú" },
          { code: "20320", name: "Xã Ia Kênh" },
          { code: "20323", name: "Xã Gào" },
          { code: "20326", name: "Xã Chư HDrông" },
          { code: "20329", name: "Xã Ia Kênh" },
          { code: "20332", name: "Xã Ia Kênh" },
          { code: "20335", name: "Xã Ia Kênh" },
          { code: "20338", name: "Xã Ia Kênh" },
          { code: "20341", name: "Xã Ia Kênh" },
          { code: "20344", name: "Xã Ia Kênh" }
        ]
      }
    ]
  },
  {
    code: "66",
    name: "Tỉnh Đắk Lắk",
    districts: [
      {
        code: "660",
        name: "Thành phố Buôn Ma Thuột",
        wards: [
          { code: "20563", name: "Phường Tân Lập" },
          { code: "20566", name: "Phường Tân Hòa" },
          { code: "20569", name: "Phường Tân An" },
          { code: "20572", name: "Phường Thống Nhất" },
          { code: "20575", name: "Phường Thành Nhất" },
          { code: "20578", name: "Phường Thắng Lợi" },
          { code: "20581", name: "Phường Tân Lợi" },
          { code: "20584", name: "Phường Thành Công" },
          { code: "20587", name: "Phường Tân Thành" },
          { code: "20590", name: "Phường Tân Tiến" },
          { code: "20593", name: "Phường Tự An" },
          { code: "20596", name: "Phường Ea Tam" },
          { code: "20599", name: "Phường Khánh Xuân" },
          { code: "20602", name: "Xã Hòa Thuận" },
          { code: "20605", name: "Xã Cư ÊBur" },
          { code: "20608", name: "Xã Ea Tu" },
          { code: "20611", name: "Xã Hòa Thắng" },
          { code: "20614", name: "Xã Ea Kao" },
          { code: "20617", name: "Xã Hòa Phú" },
          { code: "20620", name: "Xã Hòa Khánh" },
          { code: "20623", name: "Xã Hòa Xuân" },
          { code: "20626", name: "Xã Ea Drăng" },
          { code: "20629", name: "Xã Ea Siên" },
          { code: "20632", name: "Xã Ea Blang" },
          { code: "20635", name: "Xã Ea Drông" },
          { code: "20638", name: "Xã Ea H'đing" },
          { code: "20641", name: "Xã Ea Tul" },
          { code: "20644", name: "Xã Ea Kpam" },
          { code: "20647", name: "Xã Ea M'DRóh" },
          { code: "20650", name: "Xã Quảng Hiệp" },
          { code: "20653", name: "Xã Cư M'gar" },
          { code: "20656", name: "Xã Ea D'Rơng" },
          { code: "20659", name: "Xã Ea M'DRóh" },
          { code: "20662", name: "Xã Quảng Tiến" },
          { code: "20665", name: "Xã Cư Huê" },
          { code: "20668", name: "Xã Ea Tul" },
          { code: "20671", name: "Xã Ea Kpam" },
          { code: "20674", name: "Xã Ea M'DRóh" },
          { code: "20677", name: "Xã Quảng Hiệp" },
          { code: "20680", name: "Xã Cư M'gar" },
          { code: "20683", name: "Xã Ea D'Rơng" },
          { code: "20686", name: "Xã Ea M'DRóh" },
          { code: "20689", name: "Xã Quảng Tiến" },
          { code: "20692", name: "Xã Cư Huê" }
        ]
      }
    ]
  },
  {
    code: "67",
    name: "Tỉnh Đắk Nông",
    districts: [
      {
        code: "670",
        name: "Thành phố Gia Nghĩa",
        wards: [
          { code: "20875", name: "Phường Nghĩa Đức" },
          { code: "20878", name: "Phường Nghĩa Thành" },
          { code: "20881", name: "Phường Nghĩa Phú" },
          { code: "20884", name: "Phường Nghĩa Tân" },
          { code: "20887", name: "Phường Nghĩa Trung" },
          { code: "20890", name: "Xã Đắk R'Moan" },
          { code: "20893", name: "Xã Quảng Thành" },
          { code: "20896", name: "Xã Đắk Nia" },
          { code: "20899", name: "Xã Quảng Sơn" },
          { code: "20902", name: "Xã Quảng Hoà" },
          { code: "20905", name: "Xã Đắk Ha" },
          { code: "20908", name: "Xã Đắk R'Măng" },
          { code: "20911", name: "Xã Quảng Khê" },
          { code: "20914", name: "Xã Đắk Plao" },
          { code: "20917", name: "Xã Đắk Som" },
          { code: "20920", name: "Xã Nâm N'Jang" },
          { code: "20923", name: "Xã Trường Xuân" }
        ]
      }
    ]
  },
  {
    code: "68",
    name: "Tỉnh Lâm Đồng",
    districts: [
      {
        code: "680",
        name: "Thành phố Đà Lạt",
        wards: [
          { code: "21100", name: "Phường 1" },
          { code: "21103", name: "Phường 2" },
          { code: "21106", name: "Phường 3" },
          { code: "21109", name: "Phường 4" },
          { code: "21112", name: "Phường 5" },
          { code: "21115", name: "Phường 6" },
          { code: "21118", name: "Phường 7" },
          { code: "21121", name: "Phường 8" },
          { code: "21124", name: "Phường 9" },
          { code: "21127", name: "Phường 10" },
          { code: "21130", name: "Phường 11" },
          { code: "21133", name: "Phường 12" },
          { code: "21136", name: "Xã Tà Nung" },
          { code: "21139", name: "Xã Trạm Hành" },
          { code: "21142", name: "Xã Xuân Thọ" },
          { code: "21145", name: "Xã Xuân Trường" },
          { code: "21148", name: "Xã Lát" },
          { code: "21151", name: "Xã Đạ Sar" },
          { code: "21154", name: "Xã Đạ Nhim" },
          { code: "21157", name: "Xã Đạ Đờn" },
          { code: "21160", name: "Xã Đạ Ròn" },
          { code: "21163", name: "Xã Đạ M'Rông" },
          { code: "21166", name: "Xã Đạ Tông" },
          { code: "21169", name: "Xã Liêng Srônh" },
          { code: "21172", name: "Xã Đạ Rsal" },
          { code: "21175", name: "Xã Rô Men" },
          { code: "21178", name: "Xã Phi Liêng" },
          { code: "21181", name: "Xã Đạ K' Nàng" },
          { code: "21184", name: "Xã Mê Linh" },
          { code: "21187", name: "Xã Đạ Đờn" },
          { code: "21190", name: "Xã Phúc Thọ" },
          { code: "21193", name: "Xã Đạ Rsal" },
          { code: "21196", name: "Xã Đạ M'Rông" },
          { code: "21199", name: "Xã Đạ Tông" },
          { code: "21202", name: "Xã Liêng Srônh" },
          { code: "21205", name: "Xã Rô Men" },
          { code: "21208", name: "Xã Phi Liêng" },
          { code: "21211", name: "Xã Đạ K' Nàng" },
          { code: "21214", name: "Xã Mê Linh" }
        ]
      },
      {
        code: "681",
        name: "Thành phố Bảo Lộc",
        wards: [
          { code: "21217", name: "Phường 1" },
          { code: "21220", name: "Phường 2" },
          { code: "21223", name: "Phường B'Lao" },
          { code: "21226", name: "Phường Lộc Phát" },
          { code: "21229", name: "Phường Lộc Tiến" },
          { code: "21232", name: "Phường 2" },
          { code: "21235", name: "Phường 1" },
          { code: "21238", name: "Phường B'Lao" },
          { code: "21241", name: "Phường Lộc Phát" },
          { code: "21244", name: "Phường Lộc Tiến" },
          { code: "21247", name: "Xã Đạm Bri" },
          { code: "21250", name: "Xã Lộc Thanh" },
          { code: "21253", name: "Xã Lộc Nga" },
          { code: "21256", name: "Xã Lộc Châu" },
          { code: "21259", name: "Xã Đại Lào" },
          { code: "21262", name: "Xã Đạ Tông" },
          { code: "21265", name: "Xã Lộc Tân" },
          { code: "21268", name: "Xã Lộc Sơn" },
          { code: "21271", name: "Xã Đạ Rsal" },
          { code: "21274", name: "Xã Rô Men" },
          { code: "21277", name: "Xã Phi Liêng" },
          { code: "21280", name: "Xã Đạ K' Nàng" },
          { code: "21283", name: "Xã Mê Linh" },
          { code: "21286", name: "Xã Đạ Đờn" },
          { code: "21289", name: "Xã Phúc Thọ" },
          { code: "21292", name: "Xã Đạ Rsal" },
          { code: "21295", name: "Xã Đạ M'Rông" },
          { code: "21298", name: "Xã Đạ Tông" },
          { code: "21301", name: "Xã Liêng Srônh" },
          { code: "21304", name: "Xã Rô Men" },
          { code: "21307", name: "Xã Phi Liêng" },
          { code: "21310", name: "Xã Đạ K' Nàng" },
          { code: "21313", name: "Xã Mê Linh" }
        ]
      }
    ]
  }
];

// Helper functions
export const getDistrictsByProvince = (provinceCode: string): District[] => {
  const province = vietnamProvinces.find(p => p.code === provinceCode);
  return province ? province.districts : [];
};

export const getWardsByDistrict = (provinceCode: string, districtCode: string): Ward[] => {
  const province = vietnamProvinces.find(p => p.code === provinceCode);
  if (!province) return [];
  
  const district = province.districts.find(d => d.code === districtCode);
  return district ? district.wards : [];
};

export const getProvinceName = (provinceCode: string): string => {
  const province = vietnamProvinces.find(p => p.code === provinceCode);
  return province ? province.name : "";
};

export const getDistrictName = (provinceCode: string, districtCode: string): string => {
  const province = vietnamProvinces.find(p => p.code === provinceCode);
  if (!province) return "";
  
  const district = province.districts.find(d => d.code === districtCode);
  return district ? district.name : "";
};

export const getWardName = (provinceCode: string, districtCode: string, wardCode: string): string => {
  const province = vietnamProvinces.find(p => p.code === provinceCode);
  if (!province) return "";
  
  const district = province.districts.find(d => d.code === districtCode);
  if (!district) return "";
  
  const ward = district.wards.find(w => w.code === wardCode);
  return ward ? ward.name : "";
};
