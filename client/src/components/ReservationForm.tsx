/**
 * ReservationForm - 예약 폼 진입점
 *
 * 로그인 여부에 따라 MemberReservationForm / GuestReservationForm 을 렌더링합니다.
 * 세부 로직은 ./reservation/ 디렉토리에 분리되어 있습니다.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { MemberReservationForm } from "./reservation/MemberReservationForm";
import { GuestReservationForm } from "./reservation/GuestReservationForm";

interface ReservationFormProps {
  onSuccess?: () => void;
}

export function ReservationForm({ onSuccess }: ReservationFormProps) {
  const { user } = useAuth();
  return user
    ? <MemberReservationForm onSuccess={onSuccess} />
    : <GuestReservationForm onSuccess={onSuccess} />;
}

export default ReservationForm;
