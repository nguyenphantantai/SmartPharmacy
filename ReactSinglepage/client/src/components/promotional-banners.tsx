export default function PromotionalBanners() {
  const promotions = [
    {
      title: "LiveSpa",
      discount: "Giảm đến 10%",
      condition: "Cho đơn từ 399k",
      gradient: "from-green-400 to-blue-500",
    },
    {
      title: "Giảm đến 20%",
      discount: "Nhãn hàng Pharmacity",
      condition: "Áp dụng toàn bộ sản phẩm",
      gradient: "from-blue-400 to-purple-500",
    },
    {
      title: "NEUBRIA",
      discount: "Giảm đến 15%",
      condition: "Sản phẩm chăm sóc não bộ",
      gradient: "from-pink-400 to-red-500",
    },
    {
      title: "Tặng voucher 50K",
      discount: "Đơn hàng đầu tiên",
      condition: "Cho khách hàng mới",
      gradient: "from-yellow-400 to-green-500",
    },
  ];

  return (
    <section className="bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotions.map((promo, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${promo.gradient} rounded-xl p-6 text-white cursor-pointer hover:scale-105 transition-transform`}
              data-testid={`promotional-banner-${index}`}
            >
              <div className="text-2xl font-bold mb-2">{promo.title}</div>
              <div className="text-lg mb-4">{promo.discount}</div>
              <div className="text-sm">{promo.condition}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
