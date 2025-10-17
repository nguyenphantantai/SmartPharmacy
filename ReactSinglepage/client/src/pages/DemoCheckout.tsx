import React, { useMemo, useState } from 'react';
import CheckoutSavings from '../components/CheckoutSavings';

export default function DemoCheckout() {
  const [items, setItems] = useState([
    // Demo data; trong app thực tế thay bằng giỏ hàng thật
    { productId: 'p1', quantity: 2, price: 120000, categoryId: 'cat1' },
    { productId: 'p2', quantity: 1, price: 250000, categoryId: 'cat2' },
  ]);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.quantity, 0), [items]);
  const [finalPricing, setFinalPricing] = useState<any>(null);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Demo Checkout</h1>

      <div className="rounded border p-3 text-sm">
        <div className="font-medium mb-2">Giỏ hàng</div>
        {items.map((it, idx) => (
          <div key={idx} className="flex justify-between py-1">
            <span>{it.productId} x{it.quantity}</span>
            <span>{(it.price * it.quantity).toLocaleString('vi-VN')}đ</span>
          </div>
        ))}
        <div className="flex justify-between border-t pt-2 mt-2">
          <span>Tạm tính</span>
          <span>{subtotal.toLocaleString('vi-VN')}đ</span>
        </div>
      </div>

      <CheckoutSavings
        items={items}
        subtotal={subtotal}
        onPricingChange={setFinalPricing}
      />

      {finalPricing && (
        <div className="rounded border p-3 text-sm">
          <div className="font-medium mb-2">Kết quả</div>
          <div>Thành tiền: <b>{finalPricing.finalTotal.toLocaleString('vi-VN')}đ</b></div>
        </div>
      )}
    </div>
  );
}


