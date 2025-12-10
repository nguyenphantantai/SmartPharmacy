import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function BMICalculatorPage() {
  const [, setLocation] = useLocation();
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [gender, setGender] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  const calculateBMI = () => {
    if (!birthDate || !gender || !height || !weight) {
      return;
    }

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (heightInMeters <= 0 || weightInKg <= 0) {
      return;
    }

    const bmi = weightInKg / (heightInMeters * heightInMeters);
    setBmiResult(parseFloat(bmi.toFixed(1)));

    // Determine BMI category based on Vietnamese health standards
    let category = "";
    if (bmi < 18.5) {
      category = "Thiếu cân";
    } else if (bmi < 23) {
      category = "Bình thường";
    } else if (bmi < 25) {
      category = "Thừa cân";
    } else if (bmi < 30) {
      category = "Béo phì độ I";
    } else {
      category = "Béo phì độ II";
    }
    
    setBmiCategory(category);
    setShowResult(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateBMI();
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header searchQuery="" onSearchChange={() => {}} />
      
      <div className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="text-sm text-blue-600">
              Trang chủ &gt; Công cụ sức khỏe &gt; BMI
            </div>
          </div>
        </div>

        {/* Header Banner */}
        <div className="bg-orange-50 border-b border-orange-200">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Tính chỉ số BMI – Chỉ số khối cơ thể
                </h1>
                <p className="text-gray-700 text-lg">
                  Hỗ trợ bạn kiểm tra chỉ số khối cơ thể BMI (Body Mass Index) bản thân để đo lường bạn đang ở mức cân nặng lý tưởng và phù hợp với thể trạng hay không. Bạn cũng có thể kiểm tra chỉ số BMI cho người thân tại đây.
                </p>
              </div>
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center ml-8">
                <span className="text-4xl">⚖️</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Birth Date */}
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Ngày sinh</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !birthDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {birthDate ? (
                              format(birthDate, "dd/MM/yyyy", { locale: vi })
                            ) : (
                              <span>Chọn ngày sinh</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <DatePicker
                            selected={birthDate}
                            onSelect={setBirthDate}
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <Label htmlFor="gender">Giới tính</Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Nam</SelectItem>
                          <SelectItem value="female">Nữ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Height */}
                    <div className="space-y-2">
                      <Label htmlFor="height">Chiều cao (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="Nhập thông tin chiều cao"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        min="0"
                        max="300"
                      />
                    </div>

                    {/* Weight */}
                    <div className="space-y-2">
                      <Label htmlFor="weight">Cân nặng (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="Nhập số cân nặng"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        min="0"
                        max="500"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Xem kết quả
                    </Button>
                  </form>

                  {/* Result */}
                  {showResult && bmiResult !== null && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Kết quả BMI</h3>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {bmiResult}
                      </div>
                      <div className="text-lg font-medium text-gray-700">
                        {bmiCategory}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Miễn trừ trách nhiệm
                  </h3>
                  <p className="text-sm text-gray-600">
                    Công cụ tính BMI này chỉ mang tính chất tham khảo và không thay thế cho chẩn đoán y khoa chuyên nghiệp. 
                    Nếu bạn có bất kỳ lo ngại nào về sức khỏe hoặc cân nặng của mình, vui lòng tham khảo ý kiến bác sĩ hoặc 
                    chuyên gia y tế. Đặc biệt, nếu bạn có rối loạn ăn uống, vui lòng tìm kiếm sự hỗ trợ từ các chuyên gia y tế.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - FAQ */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Câu hỏi thường gặp
                  </h3>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-sm font-medium text-left">
                        Chỉ số BMI là gì? - Định nghĩa chỉ số khối cơ thể BMI
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        BMI (Body Mass Index) là một chỉ số đo lường cân nặng của một người so với chiều cao của họ. 
                        BMI có thể cho biết một người có cân nặng bình thường, béo phì, thừa cân, hoặc thiếu cân/suy dinh dưỡng so với chiều cao của họ.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-sm font-medium text-left">
                        Giải thích chỉ số BMI
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        <p className="mb-2">
                          <strong>Đối với người lớn (từ 20 tuổi trở lên):</strong> BMI được tính toán dựa trên các phân loại tình trạng cân nặng tiêu chuẩn, 
                          giống nhau cho cả nam và nữ ở mọi loại cơ thể và độ tuổi.
                        </p>
                        <p className="mb-2">
                          <strong>Đối với trẻ em và thanh thiếu niên:</strong> BMI được phân biệt theo độ tuổi và giới tính, thường được gọi là "BMI theo độ tuổi". 
                          Lượng mỡ trong cơ thể cao ở trẻ em có thể dẫn đến các bệnh liên quan đến cân nặng và các vấn đề sức khỏe khác. Thiếu cân cũng có thể làm tăng nguy cơ mắc một số tình trạng sức khỏe và bệnh tật.
                        </p>
                        <p>
                          BMI cao thường cho thấy tình trạng thừa cân. BMI không đo trực tiếp lượng mỡ trong cơ thể nhưng có tương quan với các phương pháp đo mỡ cơ thể trực tiếp.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-sm font-medium text-left">
                        Công thức tính BMI là gì?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        <p className="mb-2">
                          BMI có thể được kiểm tra bằng cách sử dụng chiều cao và cân nặng.
                        </p>
                        <p className="mb-2">
                          <strong>Công thức cho người lớn:</strong> BMI = Cân nặng (kg) / (Chiều cao (m) × Chiều cao (m))
                        </p>
                        <p className="mb-2">
                          <strong>Phân loại cho người lớn:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>18.5 - 24.9: Cân nặng bình thường hoặc khỏe mạnh</li>
                          <li>≥ 25.0: Thừa cân</li>
                          <li>&lt; 18.5: Thiếu cân</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-sm font-medium text-left">
                        Tại sao bạn nên biết về chỉ số BMI?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        <p className="mb-2">
                          Biết chỉ số BMI của bạn cho phép bạn theo dõi tỷ lệ phần trăm mỡ trong cơ thể so với chiều cao và hiểu các nguy cơ sức khỏe liên quan.
                        </p>
                        <p className="mb-2">
                          BMI cao có thể dẫn đến các nguy cơ thừa cân, bao gồm bệnh tiểu đường type 2, bệnh tim mạch và tăng huyết áp.
                        </p>
                        <p>
                          Hiểu chỉ số BMI giúp bạn và chuyên gia chăm sóc sức khỏe quản lý sức khỏe tốt hơn.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-sm font-medium text-left">
                        Chỉ số BMI cao có gây nguy hiểm nghiêm trọng đến sức khỏe không?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        <p className="mb-2">
                          Đo lường BMI là một công cụ sàng lọc, không phải là công cụ chẩn đoán béo phì hoặc sức khỏe cá nhân.
                        </p>
                        <p>
                          Để xác định xem BMI có gây ra nguy cơ sức khỏe tiềm ẩn hay không, các bác sĩ hoặc chuyên gia chăm sóc sức khỏe cần thực hiện các đánh giá thêm, 
                          chẳng hạn như đo độ dày nếp gấp da, đánh giá chế độ ăn uống, đánh giá hoạt động thể chất và tiền sử bệnh gia đình.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                      <AccordionTrigger className="text-sm font-medium text-left">
                        Những nguy cơ gây béo phì bạn cần nắm
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        <p className="mb-2">
                          Nếu BMI của bạn là 30.0 trở lên, nó được phân loại là béo phì.
                        </p>
                        <p className="mb-2">
                          Béo phì ảnh hưởng đến cơ thể, và những người béo phì có nguy cơ tử vong cao hơn bình thường do khả năng phát triển một số tình trạng sức khỏe cao hơn, bao gồm:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Bệnh tiểu đường type 2</li>
                          <li>Cholesterol LDL cao, cholesterol HDL thấp, hoặc mức lipid máu không khỏe mạnh (mỡ trong máu)</li>
                          <li>Bệnh động mạch vành</li>
                          <li>Đột quỵ</li>
                          <li>Bệnh túi mật</li>
                          <li>Viêm xương khớp</li>
                          <li>Ngưng thở khi ngủ và các vấn đề hô hấp khác</li>
                          <li>Viêm mãn tính và stress oxy hóa</li>
                          <li>Ung thư</li>
                          <li>Trầm cảm, rối loạn lo âu và các tình trạng sức khỏe tâm thần khác</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7">
                      <AccordionTrigger className="text-sm font-medium text-left">
                        Những nguy cơ gây thiếu cân bạn cần nắm
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        <p className="mb-2">
                          Nếu BMI của bạn dưới 18.5, nó cho thấy bạn thiếu cân so với chiều cao.
                        </p>
                        <p className="mb-2">
                          Thiếu cân có thể dẫn đến các nguy cơ sức khỏe do suy dinh dưỡng và hệ thống miễn dịch yếu, bao gồm:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Suy dinh dưỡng</li>
                          <li>Thiếu máu</li>
                          <li>Loãng xương do thiếu canxi và vitamin D</li>
                          <li>Các vấn đề về khả năng sinh sản do chu kỳ kinh nguyệt không đều</li>
                          <li>Nguy cơ cao hơn về biến chứng sau phẫu thuật</li>
                          <li>Chậm phát triển và các vấn đề phát triển khác ở trẻ em và thanh thiếu niên</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-8">
                      <AccordionTrigger className="text-sm font-medium text-left">
                        Chỉ số BMI có phải là một chỉ số tốt để đánh giá lượng mỡ trong cơ thể?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        <p className="mb-2">
                          BMI và lượng mỡ trong cơ thể có thể có tương quan chặt chẽ, nhưng hai người có cùng BMI có thể không có cùng lượng mỡ trong cơ thể.
                        </p>
                        <p className="mb-2">
                          Sự khác biệt có thể phụ thuộc vào loại cơ thể, độ tuổi, giới tính và mức độ hoạt động thể chất. Ví dụ:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Vận động viên có xu hướng có ít mỡ trong cơ thể hơn người không phải vận động viên với cùng BMI</li>
                          <li>Người cao tuổi có xu hướng có nhiều mỡ trong cơ thể hơn người trẻ tuổi</li>
                          <li>Phụ nữ thường có nhiều mỡ trong cơ thể hơn nam giới</li>
                        </ul>
                        <p className="mt-2">
                          Do đó, BMI nên được sử dụng như một công cụ sàng lọc ban đầu, không phải là phương pháp duy nhất để đánh giá sức khỏe.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-9">
                      <AccordionTrigger className="text-sm font-medium text-left">
                        Nguồn tham khảo
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        <ul className="space-y-3">
                          <li>
                            <p className="font-medium mb-1">The Health Effects of Overweight and Obesity. Centers for Disease Control and Prevention. Retrieved 31 May 2021 from</p>
                            <a 
                              href="https://www.cdc.gov/healthyweight/effects/index.html" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              https://www.cdc.gov/healthyweight/effects/index.html
                            </a>
                            <p className="text-xs text-gray-500 mt-1">Ngày truy cập: 18.11.2022</p>
                          </li>
                          <li>
                            <p className="font-medium mb-1">BMI Calculator Child and Teen. Centers for Disease Control and Prevention.</p>
                            <a 
                              href="https://www.cdc.gov/healthyweight/bmi/calculator.html" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              https://www.cdc.gov/healthyweight/bmi/calculator.html
                            </a>
                            <p className="text-xs text-gray-500 mt-1">Ngày truy cập: 18.11.2022</p>
                          </li>
                          <li>
                            <p className="font-medium mb-1">Body Mass Index Calculator. Diabetes Canada.</p>
                            <a 
                              href="https://www.diabetes.ca/managing-my-diabetes/tools—resources/body-mass-index-(bmi)-calculator" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              https://www.diabetes.ca/managing-my-diabetes/tools—resources/body-mass-index-(bmi)-calculator
                            </a>
                            <p className="text-xs text-gray-500 mt-1">Ngày truy cập: 18.11.2022</p>
                          </li>
                          <li>
                            <p className="font-medium mb-1">Body-Mass Index (BMI) in Children. HealthyChildren.org.</p>
                            <a 
                              href="https://www.healthychildren.org/English/health-issues/conditions/obesity/Pages/Body-Mass-Index-Formula.aspx" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              https://www.healthychildren.org/English/health-issues/conditions/obesity/Pages/Body-Mass-Index-Formula.aspx
                            </a>
                            <p className="text-xs text-gray-500 mt-1">Ngày truy cập: 18.11.2022</p>
                          </li>
                          <li>
                            <p className="font-medium mb-1">What is the Body Mass Index (BMI)? National Health Service UK.</p>
                            <a 
                              href="https://www.nhs.uk/common-health-questions/lifestyle/what-is-the-body-mass-index-bmi/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              https://www.nhs.uk/common-health-questions/lifestyle/what-is-the-body-mass-index-bmi/
                            </a>
                            <p className="text-xs text-gray-500 mt-1">Ngày truy cập: 18.11.2022</p>
                          </li>
                          <li>
                            <p className="font-medium mb-1">Assessing Your Weight and Health Risk. National Heart, Lung, and Blood Institute.</p>
                            <a 
                              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/risk.htm" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              https://www.nhlbi.nih.gov/health/educational/lose_wt/risk.htm
                            </a>
                            <p className="text-xs text-gray-500 mt-1">Ngày truy cập: 18.11.2022</p>
                          </li>
                          <li>
                            <p className="font-medium mb-1">Underweight Adults. National Health Service UK.</p>
                            <a 
                              href="https://www.nhs.uk/live-well/healthy-weight/advice-for-underweight-adults/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              https://www.nhs.uk/live-well/healthy-weight/advice-for-underweight-adults/
                            </a>
                            <p className="text-xs text-gray-500 mt-1">Ngày truy cập: 18.11.2022</p>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

