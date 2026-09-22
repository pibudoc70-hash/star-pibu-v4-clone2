/**
 * MapErrorBoundary
 * 지도 컴포넌트 로드 실패 시 안정적인 Google 지도 iframe을 표시하는 에러 바운더리.
 * App.tsx에서 분리하여 단일 책임 원칙을 준수한다.
 *
 * REFACTOR-P3-2: App.tsx 인라인 클래스에서 전용 파일로 분리
 */
import { Component, ReactNode } from "react";
import ClinicMapEmbed from "@/components/contact/ClinicMapEmbed";

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
          <ClinicMapEmbed title="스타피부과 위치 지도" />
        </div>
      );
    }
    return this.props.children;
  }
}

export default MapErrorBoundary;
