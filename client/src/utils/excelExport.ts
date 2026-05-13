/**
 * excelExport.ts - 엑셀 다운로드 유틸리티
 * - 예약 데이터를 엑셀 형식으로 내보내기
 */
import * as XLSX from 'xlsx';

export interface ReservationData {
  id: number;
  createdAt: number | Date;
  patientName: string;
  phone: string;
  treatmentName: string;
  preferredDate: number | Date;
  preferredTime: string;
  notes: string | null;
  status: string;
  adminNote?: string | null;
}

/**
 * 예약 데이터를 엑셀 파일로 다운로드
 * @param reservations 예약 데이터 배열
 * @param fileName 다운로드할 파일명 (기본값: "reservations.xlsx")
 */
export const exportReservationsToExcel = (
  reservations: ReservationData[],
  fileName: string = `예약관리_${new Date().toISOString().split('T')[0]}.xlsx`
) => {
  // 상태 매핑
  const statusMap: Record<string, string> = {
    pending: '대기 중',
    confirmed: '확정',
    completed: '완료',
    cancelled: '취소됨',
  };

  // 데이터 변환
  const data = reservations.map((reservation) => ({
    '예약 등록 일시': new Date(reservation.createdAt).toLocaleString('ko-KR'),
    '예약자명': reservation.patientName,
    '연락처': reservation.phone,
    '시술명': reservation.treatmentName,
    '희망 날짜': new Date(reservation.preferredDate).toLocaleDateString('ko-KR'),
    '희망 시간': reservation.preferredTime,
    '예약 요청사항': reservation.notes || '-',
    '상태': statusMap[reservation.status] || reservation.status,
    '관리자 메모': reservation.adminNote || '-',
  }));

  // 워크북 생성
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: [
      '예약 등록 일시',
      '예약자명',
      '연락처',
      '시술명',
      '희망 날짜',
      '희망 시간',
      '예약 요청사항',
      '상태',
      '관리자 메모',
    ],
  });

  // 열 너비 설정
  const columnWidths = [20, 15, 15, 20, 15, 10, 25, 12, 25];
  worksheet['!cols'] = columnWidths.map((width) => ({ wch: width }));

  // 워크시트를 워크북에 추가
  XLSX.utils.book_append_sheet(workbook, worksheet, '예약 관리');

  // 파일 다운로드
  XLSX.writeFile(workbook, fileName);
};
