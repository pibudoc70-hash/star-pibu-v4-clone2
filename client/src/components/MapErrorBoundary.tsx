/**
 * MapErrorBoundary
 * 지도 컴포넌트 로드 실패 시 지도 임베드 없이 카카오맵 링크만 표시하는 에러 바운더리.
 * App.tsx에서 분리하여 단일 책임 원칙을 준수한다.
 *
 * REFACTOR-P3-2: App.tsx 인라인 클래스에서 전용 파일로 분리
 */
import { Component, ReactNode } from "react";
import LocationLinkPanel from "@/components/contact/LocationLinkPanel";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class MapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("[MapErrorBoundary] Map component failed to load:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto w-full max-w-3xl px-4 py-12">
          <LocationLinkPanel
            address="부산 서면 아이온시티빌딩 4층(접수·진료) / 2층(줄기세포 연구센터)"
            buttonLabel="카카오맵에서 보기"
            href="https://map.kakao.com/link/search/부산광역시 부산진구 서면로 74 아이온시티빌딩"
          />
        </div>
      );
    }
    return this.props.children;
  }
}

export default MapErrorBoundary;
