# Data Services

Thư mục này chứa các service class để quản lý dữ liệu của ứng dụng một cách tập trung và dễ dàng bảo trì.

## Cấu trúc

```
data/
├── index.ts                 # Export tất cả services
├── disease-data.ts          # Service quản lý dữ liệu bệnh
├── beauty-care.ts           # Dữ liệu sản phẩm chăm sóc sắc đẹp
├── medical-devices.ts       # Dữ liệu thiết bị y tế
├── mom-baby.ts             # Dữ liệu sản phẩm mẹ và bé
├── personal-care.ts        # Dữ liệu sản phẩm chăm sóc cá nhân
├── supplements.ts          # Dữ liệu thực phẩm chức năng
└── vietnam-addresses.ts    # Dữ liệu địa chỉ Việt Nam
```

## DiseaseDataService

Service chính để quản lý dữ liệu về bệnh và các thông tin y tế.

### Các phương thức chính:

#### `getPopularDiseases(): DiseaseItem[]`
Lấy danh sách các bệnh phổ biến với hình ảnh.

#### `getBodyParts(): BodyPart[]`
Lấy danh sách các bộ phận cơ thể với link navigation.

#### `getSeasonalDiseases(): DiseaseItem[]`
Lấy danh sách các bệnh theo mùa.

#### `getSpecialties(): Specialty[]`
Lấy danh sách các chuyên khoa y tế.

#### `getSpecialtyItems(): Record<string, string[]>`
Lấy dữ liệu bệnh theo từng chuyên khoa.

#### `getDiseaseGroups(): DiseaseGroup[]`
Lấy danh sách nhóm bệnh theo đối tượng (người cao tuổi, nam giới, nữ giới, trẻ em, v.v.).

#### `searchDiseases(query: string): DiseaseItem[]`
Tìm kiếm bệnh theo từ khóa.

#### `getDiseasesBySpecialty(specialtyKey: string): string[]`
Lấy danh sách bệnh theo chuyên khoa cụ thể.

#### `getDiseasesByBodyPart(bodyPartKey: string): string[]`
Lấy danh sách bệnh theo bộ phận cơ thể.

### Interfaces:

```typescript
interface DiseaseItem {
  label: string;
  imageUrl: string;
}

interface BodyPart {
  label: string;
  imageUrl: string;
  href?: string;
}

interface Specialty {
  key: string;
  label: string;
  imageUrl: string;
}

interface DiseaseGroup {
  title: string;
  items: string[];
  image: string;
}
```

## Cách sử dụng

```typescript
import { DiseaseDataService } from "@/data";

// Lấy danh sách bệnh phổ biến
const popularDiseases = DiseaseDataService.getPopularDiseases();

// Lấy danh sách bộ phận cơ thể
const bodyParts = DiseaseDataService.getBodyParts();

// Tìm kiếm bệnh
const searchResults = DiseaseDataService.searchDiseases("đau đầu");

// Lấy bệnh theo chuyên khoa
const respiratoryDiseases = DiseaseDataService.getDiseasesBySpecialty("hohap");
```

## Lợi ích

1. **Tập trung hóa dữ liệu**: Tất cả dữ liệu được quản lý ở một nơi
2. **Dễ bảo trì**: Thay đổi dữ liệu chỉ cần sửa ở một file
3. **Tái sử dụng**: Có thể sử dụng ở nhiều component khác nhau
4. **Type safety**: Sử dụng TypeScript interfaces để đảm bảo type safety
5. **Tách biệt logic**: Logic xử lý dữ liệu tách biệt khỏi UI components
6. **Dễ test**: Có thể viết unit test cho các service methods

## Mở rộng

Để thêm dữ liệu mới hoặc chức năng mới:

1. Thêm method mới vào class service
2. Cập nhật interface nếu cần
3. Export trong file index.ts
4. Cập nhật documentation này
