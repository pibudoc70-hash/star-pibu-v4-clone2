/**
 * MapErrorBoundary
 * 지도 컴포넌트 로드 실패 시 카카오맵 링크로 대체 UI를 표시하는 에러 바운더리.
 * App.tsx에서 분리하여 단일 책임 원칙을 준수한다.
 *
 * REFACTOR-P3-2: App.tsx 인라인 클래스에서 전용 파일로 분리
 */
import { Component, ReactNode } from "react";

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
        <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-2xl">
          <a
            href="https://map.kakao.com/link/search/부산광역시 부산진구 서면로 74 아이온시티빌딩"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 text-center px-6 py-8 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "#FFCD00" }}
            >
              <span className="text-2xl font-bold" style={{ color: "#3C1E1E" }}>K</span>
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">카카오맵에서 보기</p>
              <p className="text-gray-500 text-sm mt-1">
                부산 서면 아이온시티빌딩 4층(접수·진료) / 2층(줄기세포 연구센터)
              </p>
            </div>
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

export default MapErrorBoundary;
