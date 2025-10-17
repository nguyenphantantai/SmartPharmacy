import { useEffect, useMemo, useState } from 'react';

function parseTimeToToday(target: string) {
  const [h, m] = target.split(':').map(Number);
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}

export function useFlashSaleCountdown(dailyStartTime?: string, dailyEndTime?: string) {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const { isActive, remainingMs, label } = useMemo(() => {
    if (!dailyStartTime || !dailyEndTime) {
      return { isActive: false, remainingMs: 0, label: '' };
    }
    const start = parseTimeToToday(dailyStartTime);
    const end = parseTimeToToday(dailyEndTime);
    const active = now >= start && now <= end;
    const remain = active ? end.getTime() - now.getTime() : 0;
    const l = active ? 'Đang diễn ra' : 'Sắp diễn ra';
    return { isActive: active, remainingMs: remain, label: l };
  }, [now, dailyStartTime, dailyEndTime]);

  const hh = Math.max(0, Math.floor(remainingMs / 3600000));
  const mm = Math.max(0, Math.floor((remainingMs % 3600000) / 60000));
  const ss = Math.max(0, Math.floor((remainingMs % 60000) / 1000));

  return { isActive, remainingMs, label, hh, mm, ss };
}


