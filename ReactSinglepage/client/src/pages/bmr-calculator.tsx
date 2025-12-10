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

export default function BMRCalculatorPage() {
  const [, setLocation] = useLocation();
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [gender, setGender] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [bmrResult, setBmrResult] = useState<number | null>(null);
  const [tdeeResult, setTdeeResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Activity level multipliers (Harris-Benedict equation)
  const activityMultipliers: { [key: string]: number } = {
    "sedentary": 1.2, // Không hoặc ít vận động
    "light": 1.375, // Vận động nhẹ (1-3 ngày/tuần)
    "moderate": 1.55, // Vận động vừa (3-5 ngày/tuần)
    "active": 1.725, // Vận động nhiều (6-7 ngày/tuần)
    "very-active": 1.9 // Vận động rất nhiều (2 lần/ngày)
  };

  const calculateBMR = () => {
    if (!birthDate || !gender || !height || !weight || !activityLevel) {
      return;
    }

    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age;

    const heightInCm = parseFloat(height);
    const weightInKg = parseFloat(weight);
    
    if (heightInCm <= 0 || weightInKg <= 0 || actualAge <= 0) {
      return;
    }

    // Harris-Benedict equation for BMR
    let bmr: number;
    if (gender === "male") {
      // Men: BMR = 88.362 + (13.397 × weight in kg) + (4.799 × height in cm) - (5.677 × age in years)
      bmr = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * actualAge);
    } else {
      // Women: BMR = 447.593 + (9.247 × weight in kg) + (3.098 × height in cm) - (4.330 × age in years)
      bmr = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * actualAge);
    }

    setBmrResult(Math.round(bmr));
    
    // Calculate TDEE (Total Daily Energy Expenditure)
    const multiplier = activityMultipliers[activityLevel] || 1.2;
    const tdee = Math.round(bmr * multiplier);
    setTdeeResult(tdee);
    
    setShowResult(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateBMR();
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header searchQuery="" onSearchChange={() => {}} />
      
      <div className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="text-sm text-blue-600">
              Trang chủ &gt; Công cụ sức khỏe &gt; BMR
            </div>
          </div>
        </div>

        {/* Header Banner */}
        <div className="bg-green-50 border-b border-green-200">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Tính chỉ số BMR
                </h1>
                <p className="text-gray-700 text-lg">
                  Mọi hoạt động của bạn đều tiêu tốn năng lượng, kể cả khi bạn ngủ. Công cụ tính chỉ số BMR (Basal Metabolic Rate) sẽ tính toán tỷ lệ trao đổi chất cơ bản; lượng calo mà bạn tiêu tốn nếu không vận động trong một ngày dựa trên độ tuổi, cân nặng, chiều cao và cường độ vận động của bạn.
                </p>
              </div>
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center ml-8">
                <span className="text-4xl">🔥</span>
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

                    {/* Activity Level */}
                    <div className="space-y-2">
                      <Label htmlFor="activityLevel">Cường độ vận động</Label>
                      <Select value={activityLevel} onValueChange={setActivityLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn cường độ vận động" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Không hoặc ít vận động</SelectItem>
                          <SelectItem value="light">Vận động nhẹ (1-3 ngày/tuần)</SelectItem>
                          <SelectItem value="moderate">Vận động vừa (3-5 ngày/tuần)</SelectItem>
                          <SelectItem value="active">Vận động nhiều (6-7 ngày/tuần)</SelectItem>
                          <SelectItem value="very-active">Vận động rất nhiều (2 lần/ngày)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Xem kết quả
                    </Button>
                  </form>

                  {/* Result */}
                  {showResult && bmrResult !== null && tdeeResult !== null && (
                    <div className="mt-6 space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">BMR (Tỷ lệ trao đổi chất cơ bản)</h3>
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {bmrResult.toLocaleString()} Kcal/ngày
                        </div>
                        <p className="text-sm text-gray-600">
                          Lượng calo cơ thể bạn đốt cháy khi nghỉ ngơi hoàn toàn
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">TDEE (Tổng năng lượng tiêu thụ hàng ngày)</h3>
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {tdeeResult.toLocaleString()} Kcal/ngày
                        </div>
                        <p className="text-sm text-gray-600">
                          Lượng calo bạn cần để duy trì cân nặng hiện tại
                        </p>
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
                    Công cụ tính BMR này chỉ mang tính chất tham khảo và dựa trên phương trình Harris-Benedict. 
                    Kết quả có thể không chính xác cho tất cả mọi người, đặc biệt là những người có rối loạn ăn uống 
                    hoặc các điều kiện y tế đặc biệt. Vui lòng tham khảo ý kiến bác sĩ hoặc chuyên gia dinh dưỡng để 
                    có kế hoạch dinh dưỡng phù hợp với nhu cầu cá nhân của bạn.
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
                        Tỷ lệ trao đổi chất cơ bản BMR là gì? - Định nghĩa chỉ số BMR
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        <p className="mb-2">
                          BMR (Basal Metabolic Rate) là lượng calo tối thiểu cơ thể bạn cần để duy trì các chức năng sống cơ bản 
                          (hô hấp, tuần hoàn, tiêu hóa) khi nghỉ ngơi hoàn toàn.
                        </p>
                        <p>
                          BMR cũng xác định tốc độ đốt cháy calo của cơ thể bạn, cho biết mối liên hệ giữa lượng calo và khối lượng cơ thể.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-sm font-medium text-left">
                        Calo là gì và vì sao cơ thể chúng ta cần calo?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        <p className="mb-2">
                          Calo là đơn vị đo năng lượng. Đây là năng lượng nhận được từ thực phẩm và năng lượng sử dụng trong hoạt động thể chất.
                        </p>
                        <p className="mb-2">
                          Bạn có thể kiểm tra thông tin calo trên nhãn thực phẩm, và mục tiêu giảm cân thường liên quan đến việc giảm lượng calo nạp vào.
                        </p>
                        <p className="mb-2">
                          1 kilocalorie (kcal) tương đương với 1.000 calo.
                        </p>
                        <p>
                          Việc theo dõi lượng calo nạp vào là quan trọng để quản lý cân nặng và đảm bảo cơ thể nhận đủ năng lượng cho các hoạt động hàng ngày.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-sm font-medium text-left">
                        Công thức tính BMR là gì?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        <p className="mb-2">
                          Công thức phổ biến để tính BMR là phương trình Harris-Benedict:
                        </p>
                        <p className="mb-2">
                          <strong>Nữ giới:</strong> BMR = 447,593 + (9,247 × trọng lượng tính bằng kg) + (3,098 × chiều cao tính bằng cm) – (4,330 × tuổi tính theo năm)
                        </p>
                        <p>
                          <strong>Nam giới:</strong> BMR = 88,362 + (13,397 × trọng lượng tính bằng kg) + (4,799 × chiều cao tính bằng cm) – (5,677 × tuổi tính theo năm)
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-sm font-medium text-left">
                        BMR và khối lượng cơ nạc có liên quan như thế nào?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        <p className="mb-2">
                          Lượng cơ nạc càng nhiều thì tỷ lệ BMR càng lớn.
                        </p>
                        <p className="mb-2">
                          Khối lượng cơ nạc là một phần cấu tạo cơ thể, khác với mô mỡ hoặc khối lượng không chứa chất béo.
                        </p>
                        <p>
                          Bạn có thể tăng cường trao đổi chất bằng cách tăng khối lượng cơ nạc thông qua tập luyện và tiêu thụ protein đầy đủ.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-sm font-medium text-left">
                        Sự khác biệt giữa BMR và TDEE là gì?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        <p className="mb-2">
                          <strong>BMR (Basal Metabolic Rate):</strong> Là lượng calo tối thiểu cơ thể bạn cần để duy trì các chức năng sống cơ bản khi nghỉ ngơi hoàn toàn.
                        </p>
                        <p className="mb-2">
                          <strong>TDEE (Total Daily Energy Expenditure):</strong> Là tổng năng lượng tiêu thụ hàng ngày, bao gồm cả hoạt động thể chất. 
                          TDEE được tính bằng cách nhân BMR với hệ số hoạt động thể chất.
                        </p>
                        <p>
                          TDEE = BMR × Hệ số hoạt động (1.2 - 1.9 tùy theo mức độ vận động)
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                      <AccordionTrigger className="text-sm font-medium text-left">
                        Nguồn tham khảo
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600">
                        <ul className="space-y-3">
                          <li>
                            <p className="font-medium mb-1">Cunningham JJ. (1991). Body composition as a determinant of energy expenditure: a synthetic review and a proposed general prediction equation. Am J Clin Nutr.</p>
                            <a 
                              href="https://pubmed.ncbi.nlm.nih.gov/1957828/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              https://pubmed.ncbi.nlm.nih.gov/1957828/
                            </a>
                            <p className="text-xs text-gray-500 mt-1">Ngày truy cập: 18.11.2022</p>
                          </li>
                          <li>
                            <p className="font-medium mb-1">Buch, A., Diener, J., Stern, N., Rubin, A., Kis, O., Sofer, Y., Yaron, M., Greenman, Y., Eldor, R., & Eilat-Adar, S. (2021). Comparison of Equations Estimating Resting Metabolic Rate in Older Adults with Type 2 Diabetes. Journal of clinical medicine, 10(8), 1644.</p>
                            <a 
                              href="https://pubmed.ncbi.nlm.nih.gov/33921537/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              https://pubmed.ncbi.nlm.nih.gov/33921537/
                            </a>
                            <p className="text-xs text-gray-500 mt-1">Ngày truy cập: 18.11.2022</p>
                          </li>
                          <li>
                            <p className="font-medium mb-1">Calorie Calculator. National Academy of Sports Medicine.</p>
                            <a 
                              href="https://www.nasm.org/resources/calorie-calculator" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              https://www.nasm.org/resources/calorie-calculator
                            </a>
                            <p className="text-xs text-gray-500 mt-1">Ngày truy cập: 18.11.2022</p>
                          </li>
                          <li>
                            <p className="font-medium mb-1">Resting Metabolic Rate: How to Calculate and Improve Yours. National Academy of Sports Medicine.</p>
                            <a 
                              href="https://blog.nasm.org/nutrition/resting-metabolic-rate-how-to-calculate-and-improve-yours" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
                            >
                              https://blog.nasm.org/nutrition/resting-metabolic-rate-how-to-calculate-and-improve-yours
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

