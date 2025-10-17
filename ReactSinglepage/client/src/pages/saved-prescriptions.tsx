import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  RotateCcw,
  Save,
  FileText,
  Clock
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SavedPrescriptionItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  notes?: string;
}

interface SavedPrescription {
  _id: string;
  name: string;
  description?: string;
  items: SavedPrescriptionItem[];
  totalAmount: number;
  createdAt: string;
  prescriptionId?: {
    _id: string;
    doctorName: string;
    hospitalName?: string;
  };
  orderId?: {
    _id: string;
    orderNumber: string;
    createdAt: string;
  };
}

export default function SavedPrescriptionsPage() {
  const [, setLocation] = useLocation();
  const [savedPrescriptions, setSavedPrescriptions] = useState<SavedPrescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  const format = (n: number) => new Intl.NumberFormat("vi-VN").format(n);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const fetchSavedPrescriptions = async () => {
      try {
        const [prescriptionsResponse, statsResponse] = await Promise.all([
          apiRequest("/saved-prescriptions"),
          apiRequest("/saved-prescriptions/stats")
        ]);

        const prescriptionsData = await prescriptionsResponse.json();
        const statsData = await statsResponse.json();

        if (prescriptionsData.success) {
          setSavedPrescriptions(prescriptionsData.data);
        }
        if (statsData.success) {
          setStats(statsData.data);
        }
      } catch (error) {
        console.error('Error fetching saved prescriptions:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách đơn thuốc đã lưu",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPrescriptions();
  }, [toast]);

  const handleReorder = async (prescriptionId: string) => {
    try {
      const response = await apiRequest(`/saved-prescriptions/${prescriptionId}/reorder`, {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        // Navigate to cart with reorder items
        setLocation('/cart');
        toast({
          title: "Thành công",
          description: "Đã thêm đơn thuốc vào giỏ hàng",
        });
      }
    } catch (error) {
      console.error('Error reordering:', error);
      toast({
        title: "Lỗi",
        description: "Không thể mua lại đơn thuốc",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (prescriptionId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đơn thuốc này?')) {
      return;
    }

    try {
      const response = await apiRequest(`/saved-prescriptions/${prescriptionId}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        setSavedPrescriptions(prev => 
          prev.filter(p => p._id !== prescriptionId)
        );
        toast({
          title: "Thành công",
          description: "Đã xóa đơn thuốc",
        });
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa đơn thuốc",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (prescriptionId: string) => {
    setLocation(`/account/chinh-sua-don-thuoc/${prescriptionId}`);
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header searchQuery="" onSearchChange={() => {}} />
        <main className="flex-1 mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header searchQuery="" onSearchChange={() => {}} />

      <main className="flex-1 mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/account")}
            className="inline-flex items-center gap-2 hover:underline p-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Tài khoản
          </Button>
          <span>/</span>
          <span>Đơn thuốc đã lưu</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Đơn thuốc đã lưu</h1>
          <Button onClick={() => setLocation("/account/luu-don-thuoc-moi")}>
            <Plus className="h-4 w-4 mr-2" />
            Lưu đơn thuốc mới
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.totalSaved}</div>
                    <div className="text-sm text-muted-foreground">Đơn đã lưu</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.totalItems}</div>
                    <div className="text-sm text-muted-foreground">Tổng thuốc</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">{Math.round(stats.averageItemsPerPrescription)}</div>
                    <div className="text-sm text-muted-foreground">TB thuốc/đơn</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Save className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">{format(stats.totalValue)}đ</div>
                    <div className="text-sm text-muted-foreground">Tổng giá trị</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Saved Prescriptions List */}
        {savedPrescriptions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chưa có đơn thuốc nào được lưu</h3>
              <p className="text-muted-foreground mb-4">
                Bạn có thể lưu đơn thuốc từ đơn hàng đã mua hoặc tạo đơn thuốc mới.
              </p>
              <div className="space-x-2">
                <Button onClick={() => setLocation("/account/lich-su-don-hang")}>
                  Xem đơn hàng
                </Button>
                <Button variant="outline" onClick={() => setLocation("/account/luu-don-thuoc-moi")}>
                  Tạo đơn thuốc mới
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedPrescriptions.map((prescription) => (
              <Card key={prescription._id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{prescription.name}</h3>
                        <Badge variant="secondary">
                          {prescription.items.length} thuốc
                        </Badge>
                      </div>
                      {prescription.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {prescription.description}
                        </p>
                      )}
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="h-4 w-4" />
                          Lưu ngày: {formatDate(prescription.createdAt)}
                        </div>
                        {prescription.prescriptionId && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            Bác sĩ: {prescription.prescriptionId.doctorName}
                            {prescription.prescriptionId.hospitalName && 
                              ` - ${prescription.prescriptionId.hospitalName}`
                            }
                          </div>
                        )}
                        {prescription.orderId && (
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            Đơn hàng: #{prescription.orderId.orderNumber}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-red-500">
                        {format(prescription.totalAmount)}đ
                      </div>
                    </div>
                  </div>

                  {/* Prescription Items */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Danh sách thuốc:</h4>
                    <div className="space-y-2">
                      {prescription.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div className="flex-1">
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-muted-foreground">
                              {item.quantity} {item.unit} - {format(item.price)}đ
                            </div>
                            {item.notes && (
                              <div className="text-xs text-blue-600">
                                Ghi chú: {item.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {prescription.items.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          +{prescription.items.length - 3} thuốc khác
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReorder(prescription._id)}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Mua lại
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(prescription._id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Chỉnh sửa
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(prescription._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
