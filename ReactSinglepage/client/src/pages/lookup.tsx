import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useState } from "react";
import { DiseaseDataService } from "@/data";

export default function LookupPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState<string>("hohap");

  // Sử dụng service để lấy dữ liệu
  const popular = DiseaseDataService.getPopularDiseases();
  const bodyParts = DiseaseDataService.getBodyParts();
  const seasonal = DiseaseDataService.getSeasonalDiseases();
  const specialties = DiseaseDataService.getSpecialties();
  const specialtyItems = DiseaseDataService.getSpecialtyItems();
  const groups = DiseaseDataService.getDiseaseGroups();

  return (
    <div className="bg-background min-h-screen">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="mx-auto max-w-screen-2xl px-6 py-8">
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Bệnh</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Những điều cần biết về bệnh</h1>
          <div className="relative w-[340px] max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm thông tin về bệnh..." className="pl-9" />
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Bộ phận cơ thể</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {bodyParts.map((bp) => (
              <Card key={bp.label} className={`p-4 text-center ${bp.href ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
                {bp.href ? (
                  <a href={bp.href}>
                    <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 mb-2 overflow-hidden">
                      <img 
                        src={bp.imageUrl} 
                        alt={bp.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm">{bp.label}</div>
                  </a>
                ) : (
                  <>
                    <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 mb-2 overflow-hidden">
                      <img 
                        src={bp.imageUrl} 
                        alt={bp.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm">{bp.label}</div>
                  </>
                )}
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Bệnh phổ biến</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {popular.map((disease, idx) => (
              <Card key={disease.label} className={`p-0 border rounded-xl overflow-hidden ${disease.href ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
                {disease.href ? (
                  <a href={disease.href}>
                    <div className="h-28 bg-muted">
                      <img 
                        src={disease.imageUrl} 
                        alt={disease.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="px-4 py-3 text-sm font-medium">{disease.label}</div>
                  </a>
                ) : (
                  <>
                    <div className="h-28 bg-muted">
                      <img 
                        src={disease.imageUrl} 
                        alt={disease.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="px-4 py-3 text-sm font-medium">{disease.label}</div>
                  </>
                )}
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="outline">Xem thêm</Button>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Nhóm bệnh theo mùa</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {seasonal.map((disease) => (
              <Card key={disease.label} className={`p-0 border rounded-xl overflow-hidden ${disease.href ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
                {disease.href ? (
                  <a href={disease.href}>
                    <div className="h-20 bg-muted">
                      <img 
                        src={disease.imageUrl} 
                        alt={disease.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="px-4 py-3 text-sm font-medium line-clamp-2">{disease.label}</div>
                  </a>
                ) : (
                  <>
                    <div className="h-20 bg-muted">
                      <img 
                        src={disease.imageUrl} 
                        alt={disease.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="px-4 py-3 text-sm font-medium line-clamp-2">{disease.label}</div>
                  </>
                )}
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="outline">Xem thêm</Button>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Bệnh theo đối tượng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((g) => (
              <Card key={g.title} className="p-0 border rounded-xl overflow-hidden">
                <div className="grid grid-cols-[1fr_120px] gap-0">
                  <div className="p-5">
                    <div className="font-semibold mb-2">{g.title}</div>
                    <ul className="list-disc list-inside space-y-1 text-[13px] text-foreground/90">
                      {g.items.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                  <img src={g.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex justify-end p-3 pt-0">
                  {g.title === "Bệnh Người Cao Tuổi" ? (
                    <Button size="sm" variant="secondary" asChild>
                      <a href="/benh/nguoi-cao-tuoi">Xem</a>
                    </Button>
                  ) : g.title === "Bệnh Nam Giới" ? (
                    <Button size="sm" variant="secondary" asChild>
                      <a href="/benh/nam-gioi">Xem</a>
                    </Button>
                  ) : g.title === "Bệnh Nữ Giới" ? (
                    <Button size="sm" variant="secondary" asChild>
                      <a href="/benh/nu-gioi">Xem</a>
                    </Button>
                  ) : g.title === "Bệnh Trẻ Em" ? (
                    <Button size="sm" variant="secondary" asChild>
                      <a href="/benh/tre-em">Xem</a>
                    </Button>
                  ) : g.title === "Bệnh Tuổi Dậy Thì" ? (
                    <Button size="sm" variant="secondary" asChild>
                      <a href="/benh/tuoi-day-thi">Xem</a>
                    </Button>
                  ) : g.title === "Bệnh Phụ Nữ Mang Thai" ? (
                    <Button size="sm" variant="secondary" asChild>
                      <a href="/benh/phu-nu-mang-thai">Xem</a>
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary">Xem</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Chuyên trang bệnh học</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {specialties.slice(0, 6).map((s) => (
              <div key={s.key} className={`text-center ${s.key === 'timMach' || s.key === 'coXuong' || s.key === 'hohap' || s.key === 'truyenNhiem' || s.key === 'thanKinh' || s.key === 'da' ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
                {s.key === 'timMach' ? (
                  <a href="/benh/tim-mach">
                    <div className="mx-auto h-20 w-20 rounded-full bg-cyan-50 border border-cyan-200 mb-2 overflow-hidden">
                      <img 
                        src={s.imageUrl} 
                        alt={s.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm font-medium">{s.label}</div>
                  </a>
                ) : s.key === 'coXuong' ? (
                  <a href="/benh/co-xuong-khop">
                    <div className="mx-auto h-20 w-20 rounded-full bg-cyan-50 border border-cyan-200 mb-2 overflow-hidden">
                      <img 
                        src={s.imageUrl} 
                        alt={s.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm font-medium">{s.label}</div>
                  </a>
                ) : s.key === 'hohap' ? (
                  <a href="/benh/ho-hap">
                    <div className="mx-auto h-20 w-20 rounded-full bg-cyan-50 border border-cyan-200 mb-2 overflow-hidden">
                      <img 
                        src={s.imageUrl} 
                        alt={s.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm font-medium">{s.label}</div>
                  </a>
                ) : s.key === 'truyenNhiem' ? (
                  <a href="/benh/truyen-nhiem">
                    <div className="mx-auto h-20 w-20 rounded-full bg-cyan-50 border border-cyan-200 mb-2 overflow-hidden">
                      <img 
                        src={s.imageUrl} 
                        alt={s.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm font-medium">{s.label}</div>
                  </a>
                ) : s.key === 'thanKinh' ? (
                  <a href="/benh/than-kinh">
                    <div className="mx-auto h-20 w-20 rounded-full bg-cyan-50 border border-cyan-200 mb-2 overflow-hidden">
                      <img 
                        src={s.imageUrl} 
                        alt={s.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm font-medium">{s.label}</div>
                  </a>
                ) : s.key === 'da' ? (
                  <a href="/benh/ve-da">
                    <div className="mx-auto h-20 w-20 rounded-full bg-cyan-50 border border-cyan-200 mb-2 overflow-hidden">
                      <img 
                        src={s.imageUrl} 
                        alt={s.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm font-medium">{s.label}</div>
                  </a>
                ) : (
                  <>
                    <div className="mx-auto h-20 w-20 rounded-full bg-cyan-50 border border-cyan-200 mb-2 overflow-hidden">
                      <img 
                        src={s.imageUrl} 
                        alt={s.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm font-medium">{s.label}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Nhóm bệnh chuyên khoa</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {specialties.map((s) => (
              <Button
                key={s.key}
                onClick={() => setActiveSpecialty(s.key)}
                variant={activeSpecialty === s.key ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {s.label}
              </Button>
            ))}
          </div>

          {/* Hiển thị các bệnh liên quan */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {specialties.find(s => s.key === activeSpecialty)?.label} - Các bệnh liên quan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((col) => (
                <ul key={col} className="space-y-3">
                  {specialtyItems[activeSpecialty].filter((_, i) => i % 3 === col).slice(0, 10).map((name) => (
                    <li key={name}>
                      <a href="#" className="text-sky-700 hover:underline text-[15px]">{name}</a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button variant="outline">Xem thêm</Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


