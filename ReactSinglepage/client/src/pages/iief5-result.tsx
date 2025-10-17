import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowLeft, MapPin, ExternalLink } from 'lucide-react';

interface IIEF5Assessment {
  score: number;
  riskLevel: string;
  message: string;
  answers: Array<{
    question: string;
    answer: string;
    answerIndex: number;
  }>;
}

const IIEF5ResultPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [assessment, setAssessment] = useState<IIEF5Assessment | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedAssessment = sessionStorage.getItem('iief5Assessment');
    if (savedAssessment) {
      setAssessment(JSON.parse(savedAssessment));
    } else {
      // Nếu không có dữ liệu, chuyển về trang đánh giá
      setLocation('/danh-gia-muc-do-cuong-cung-duong-vat-iief5');
    }
  }, [setLocation]);

  const provincesAndHospitals = {
    'all': [
      {
        name: "Bệnh viện Bình Dân - Khoa Nam học",
        address: "326 Điện Biên Phủ, Phường Vườn Lài, Thành phố Hồ Chí Minh",
        province: "Hồ Chí Minh"
      },
      {
        name: "Bệnh viện Chợ Rẫy – Đơn vị Nam khoa",
        address: "201B, Nguyễn Chí Thanh, Phường Chợ Lớn, Thành phố Hồ Chí Minh",
        province: "Hồ Chí Minh"
      },
      {
        name: "Bệnh viện Đại học Y Dược TPHCM (cơ sở 1) – Khoa Tiết niệu",
        address: "215 Hồng Bàng, Phường Chợ Lớn, Thành phố Hồ Chí Minh",
        province: "Hồ Chí Minh"
      },
      {
        name: "Bệnh viện Nhân dân 115 - Khoa Ngoại Niệu – Ghép thận",
        address: "527 Sư Vạn Hạnh, Phường Hòa Hưng, Thành phố Hồ Chí Minh",
        province: "Hồ Chí Minh"
      },
      {
        name: "Bệnh viện ĐK Tâm Anh TP HCM",
        address: "2B Phổ Quang, P. 2, Q. Tân Bình, Hồ Chí Minh",
        province: "Hồ Chí Minh"
      },
      {
        name: "Bệnh viện Đại học Y Hà Nội – Khoa Nam học",
        address: "Số 1 Tôn Thất Tùng, Đống Đa, Hà Nội",
        province: "Hà Nội"
      },
      {
        name: "Bệnh viện ĐK Tâm Anh Hà Nội",
        address: "108 Hoàng Như Tiếp, P. Bồ Đề, Q. Long Biên, Hà Nội",
        province: "Hà Nội"
      },
      {
        name: "Bệnh viện Hữu nghị Việt Đức – Trung tâm Nam học",
        address: "Số 16 - 18 Phủ Doãn, Hoàn Kiếm, Hà Nội",
        province: "Hà Nội"
      },
      {
        name: "Bệnh viện Bạch Mai",
        address: "78 Giải Phóng, P. Phương Mai, Q. Đống Đa, Hà Nội",
        province: "Hà Nội"
      }
    ],
    'Hồ Chí Minh': [
      {
        name: "Bệnh viện Bình Dân - Khoa Nam học",
        address: "326 Điện Biên Phủ, Phường Vườn Lài, Thành phố Hồ Chí Minh",
        province: "Hồ Chí Minh"
      },
      {
        name: "Bệnh viện Chợ Rẫy – Đơn vị Nam khoa",
        address: "201B, Nguyễn Chí Thanh, Phường Chợ Lớn, Thành phố Hồ Chí Minh",
        province: "Hồ Chí Minh"
      },
      {
        name: "Bệnh viện Đại học Y Dược TPHCM (cơ sở 1) – Khoa Tiết niệu",
        address: "215 Hồng Bàng, Phường Chợ Lớn, Thành phố Hồ Chí Minh",
        province: "Hồ Chí Minh"
      },
      {
        name: "Bệnh viện Nhân dân 115 - Khoa Ngoại Niệu – Ghép thận",
        address: "527 Sư Vạn Hạnh, Phường Hòa Hưng, Thành phố Hồ Chí Minh",
        province: "Hồ Chí Minh"
      },
      {
        name: "Bệnh viện ĐK Tâm Anh TP HCM",
        address: "2B Phổ Quang, P. 2, Q. Tân Bình, Hồ Chí Minh",
        province: "Hồ Chí Minh"
      }
    ],
    'Hà Nội': [
      {
        name: "Bệnh viện Đại học Y Hà Nội – Khoa Nam học",
        address: "Số 1 Tôn Thất Tùng, Đống Đa, Hà Nội",
        province: "Hà Nội"
      },
      {
        name: "Bệnh viện ĐK Tâm Anh Hà Nội",
        address: "108 Hoàng Như Tiếp, P. Bồ Đề, Q. Long Biên, Hà Nội",
        province: "Hà Nội"
      },
      {
        name: "Bệnh viện Hữu nghị Việt Đức – Trung tâm Nam học",
        address: "Số 16 - 18 Phủ Doãn, Hoàn Kiếm, Hà Nội",
        province: "Hà Nội"
      },
      {
        name: "Bệnh viện Bạch Mai",
        address: "78 Giải Phóng, P. Phương Mai, Q. Đống Đa, Hà Nội",
        province: "Hà Nội"
      }
    ]
  };

  const getRiskLevelInfo = (riskLevel: string) => {
    switch (riskLevel) {
      case 'normal':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          condition: "Bạn có chức năng cương dương bình thường và không có dấu hiệu rối loạn cương dương.",
          advice: [
            "Duy trì lối sống lành mạnh: Ăn uống cân bằng, tập thể dục thường xuyên, ngủ đủ giấc và tránh hút thuốc lá, hạn chế uống rượu bia quá nhiều.",
            "Tiếp tục duy trì các thói quen tốt và theo dõi định kỳ sức khỏe sinh sản."
          ]
        };
      case 'mild':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          condition: "Bạn vẫn có thể cương cứng và kiểm soát sự cương cứng của mình, tuy nhiên thời gian không duy trì được lâu để quan hệ tình dục trọn vẹn như mong muốn.",
          advice: [
            "Duy trì lối sống lành mạnh: Ăn uống cân bằng, tập thể dục thường xuyên, ngủ đủ giấc và tránh hút thuốc lá, hạn chế uống rượu bia quá nhiều.",
            "Tiếp tục theo dõi, nếu tình trạng kéo dài và trở nên nặng hơn nên đi khám nam khoa."
          ]
        };
      case 'mild-moderate':
        return {
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          condition: "Bạn gặp một số khó khăn trong việc đạt được và duy trì sự cương cứng, có thể ảnh hưởng đến chất lượng quan hệ tình dục.",
          advice: [
            "Duy trì lối sống lành mạnh: Ăn uống cân bằng, tập thể dục thường xuyên, ngủ đủ giấc và tránh hút thuốc lá, hạn chế uống rượu bia quá nhiều.",
            "Nên đi khám nam khoa để được tư vấn và điều trị sớm."
          ]
        };
      case 'moderate':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          condition: "Bạn gặp khó khăn đáng kể trong việc đạt được và duy trì sự cương cứng, ảnh hưởng nhiều đến quan hệ tình dục.",
          advice: [
            "Duy trì lối sống lành mạnh: Ăn uống cân bằng, tập thể dục thường xuyên, ngủ đủ giấc và tránh hút thuốc lá, hạn chế uống rượu bia quá nhiều.",
            "Cần đi khám nam khoa ngay để được chẩn đoán và điều trị kịp thời."
          ]
        };
      case 'severe':
        return {
          color: 'text-red-700',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-300',
          condition: "Bạn gặp khó khăn nghiêm trọng trong việc đạt được và duy trì sự cương cứng, ảnh hưởng hoàn toàn đến quan hệ tình dục.",
          advice: [
            "Duy trì lối sống lành mạnh: Ăn uống cân bằng, tập thể dục thường xuyên, ngủ đủ giấc và tránh hút thuốc lá, hạn chế uống rượu bia quá nhiều.",
            "Cần đi khám nam khoa ngay lập tức để được chẩn đoán và điều trị chuyên sâu."
          ]
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          condition: "Không thể xác định tình trạng.",
          advice: ["Vui lòng làm lại bài đánh giá."]
        };
    }
  };

  const filteredHospitals = selectedProvince === 'all' 
    ? provincesAndHospitals.all 
    : provincesAndHospitals[selectedProvince as keyof typeof provincesAndHospitals] || [];

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  const riskInfo = getRiskLevelInfo(assessment.riskLevel);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <button 
            onClick={() => setLocation("/")}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Trang chủ
          </button>
          <span className="mx-2">›</span>
          <button 
            onClick={() => setLocation("/kiem-tra-suc-khoe")}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Kiểm tra sức khỏe
          </button>
          <span className="mx-2">›</span>
          <button 
            onClick={() => setLocation("/danh-gia-muc-do-cuong-cung-duong-vat-iief5")}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Đánh giá mức độ cương cứng của dương vật IIEF-5 (SHIM)
          </button>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-medium">Kết quả đánh giá</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Kết quả chính */}
          <Card className="shadow-lg mb-6">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center items-center mb-6">
                <CheckCircle className="h-16 w-16 text-blue-600 mr-4" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Kết quả kiểm tra
                  </h1>
                  <div className={`text-2xl font-bold ${riskInfo.color}`}>
                    {assessment.message}
                  </div>
                  <div className="text-lg text-gray-600 mt-2">
                    Điểm số: {assessment.score}/25
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin chi tiết */}
          <Card className="shadow-lg mb-6">
            <CardContent className="p-8">
              <div className={`${riskInfo.bgColor} ${riskInfo.borderColor} border-l-4 p-6 rounded-lg`}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Tình trạng</h2>
                <p className="text-gray-700 mb-6">{riskInfo.condition}</p>

                <h2 className="text-xl font-bold text-gray-900 mb-4">Lời khuyên dành cho bạn</h2>
                <ul className="space-y-3">
                  {riskInfo.advice.map((advice, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-700">{advice}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Miễn trừ trách nhiệm</h2>
                  <p className="text-sm text-gray-600 mb-2">
                    Nguồn tham khảo: Tổng hội y học Việt Nam, Nhà xuất bản y học
                  </p>
                  <p className="text-sm text-gray-600">
                    *Thông tin này chỉ có tính tham khảo, không dùng để thay thế ý kiến tham vấn của chuyên viên Y tế. 
                    Bệnh nhân phải được bác sĩ thăm khám, chẩn đoán và điều trị y tế chuyên môn.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gợi ý bệnh viện */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Gợi ý bệnh viện khám bệnh</h2>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Chọn Thành Phố/Tỉnh</option>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHospitals.map((hospital, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">{hospital.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{hospital.address}</p>
                    <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Xem bản đồ
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Nút hành động */}
          <div className="flex justify-center mt-8 space-x-4">
            <Button
              onClick={() => setLocation('/danh-gia-muc-do-cuong-cung-duong-vat-iief5')}
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Làm lại đánh giá
            </Button>
            <Button
              onClick={() => setLocation('/kiem-tra-suc-khoe')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Kiểm tra sức khỏe khác
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default IIEF5ResultPage;
