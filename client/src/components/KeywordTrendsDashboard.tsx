/**
 * client/src/components/KeywordTrendsDashboard.tsx
 * 키워드 트렌드 관리자 대시보드
 */
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, TrendingUp, Activity, Zap } from "lucide-react";

const COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#f97316"];

export function KeywordTrendsDashboard() {
  const [category, setCategory] = useState<string | undefined>();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5초

  // 최신 트렌드 조회
  const { data: latestTrends, isLoading: isLoadingLatest, refetch: refetchLatest } = trpc.keywords.getLatest.useQuery(
    { limit: 20, category },
    { enabled: true }
  );

  // 상위 트렌딩 키워드 조회
  const { data: topTrending, isLoading: isLoadingTop } = trpc.keywords.getTopTrending.useQuery(
    { limit: 10, category },
    { enabled: true }
  );

  // 자동 새로고침
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refetchLatest();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refetchLatest]);

  // 차트 데이터 변환
  const chartData = topTrending?.map((trend) => ({
    keyword: trend.keyword.substring(0, 10),
    searchVolume: trend.searchVolume,
    trendScore: trend.trendScore,
    fullKeyword: trend.keyword,
  })) || [];

  // 카테고리별 분포
  const categoryDistribution = latestTrends
    ? Array.from(
        latestTrends.reduce((acc, trend) => {
          const cat = trend.category || "general";
          acc.set(cat, (acc.get(cat) || 0) + 1);
          return acc;
        }, new Map<string, number>())
      ).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">키워드 트렌드 대시보드</h1>
          <p className="text-slate-600 mt-1">실시간 검색 트렌드 모니터링</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => refetchLatest()}
            disabled={isLoadingLatest}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoadingLatest ? "새로고침 중..." : "새로고침"}
          </Button>
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "default" : "outline"}
            className={autoRefresh ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {autoRefresh ? "자동 새로고침 ON" : "자동 새로고침 OFF"}
          </Button>
        </div>
      </div>

      {/* 필터 및 설정 */}
      <div className="flex gap-4 items-end bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">카테고리 필터</label>
          <Select value={category || ""} onValueChange={(val) => setCategory(val || undefined)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="모든 카테고리" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">모든 카테고리</SelectItem>
              <SelectItem value="treatment">시술</SelectItem>
              <SelectItem value="equipment">장비</SelectItem>
              <SelectItem value="ingredient">성분</SelectItem>
              <SelectItem value="general">일반</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">자동 새로고침 간격</label>
          <Select value={refreshInterval.toString()} onValueChange={(val) => setRefreshInterval(parseInt(val))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3000">3초</SelectItem>
              <SelectItem value="5000">5초</SelectItem>
              <SelectItem value="10000">10초</SelectItem>
              <SelectItem value="30000">30초</SelectItem>
              <SelectItem value="60000">1분</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              총 모니터링 키워드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{latestTrends?.length || 0}</div>
            <p className="text-xs text-slate-500 mt-1">개의 키워드 추적 중</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              상위 트렌딩
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{topTrending?.[0]?.keyword || "-"}</div>
            <p className="text-xs text-slate-500 mt-1">
              {topTrending?.[0]?.trendScore ? `${topTrending[0].trendScore > 0 ? "+" : ""}${topTrending[0].trendScore}%` : "데이터 없음"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              평균 검색량
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {latestTrends ? Math.round(latestTrends.reduce((sum, t) => sum + t.searchVolume, 0) / latestTrends.length) : 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">상대 검색량 (0-100)</p>
          </CardContent>
        </Card>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 검색량 차트 */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>상위 키워드 검색량</CardTitle>
            <CardDescription>상대 검색량 기준 상위 10개</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTop ? (
              <div className="h-80 flex items-center justify-center text-slate-500">로딩 중...</div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="keyword" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px", color: "#f1f5f9" }}
                    formatter={(value) => [`${value}`, "검색량"]}
                    labelFormatter={(label) => {
                      const item = chartData.find((d) => d.keyword === label);
                      return item?.fullKeyword || label;
                    }}
                  />
                  <Bar dataKey="searchVolume" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-500">데이터 없음</div>
            )}
          </CardContent>
        </Card>

        {/* 트렌드 점수 차트 */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>트렌드 변화율</CardTitle>
            <CardDescription>키워드별 증감률 (%)</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTop ? (
              <div className="h-80 flex items-center justify-center text-slate-500">로딩 중...</div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="keyword" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px", color: "#f1f5f9" }}
                    formatter={(value) => [`${value}%`, "변화율"]}
                    labelFormatter={(label) => {
                      const item = chartData.find((d) => d.keyword === label);
                      return item?.fullKeyword || label;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="trendScore"
                    stroke="#ec4899"
                    strokeWidth={2}
                    dot={{ fill: "#ec4899", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-500">데이터 없음</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 카테고리 분포 및 최신 데이터 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 카테고리 분포 */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>카테고리 분포</CardTitle>
            <CardDescription>모니터링 중인 키워드 분포</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}개`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">데이터 없음</div>
            )}
          </CardContent>
        </Card>

        {/* 최신 키워드 리스트 */}
        <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>최신 모니터링 키워드</CardTitle>
            <CardDescription>최근 수집된 키워드 트렌드</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {isLoadingLatest ? (
                <div className="text-center py-8 text-slate-500">로딩 중...</div>
              ) : latestTrends && latestTrends.length > 0 ? (
                latestTrends.slice(0, 15).map((trend, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{trend.keyword}</p>
                      <p className="text-xs text-slate-500">{trend.category || "general"}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${trend.searchVolume}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-slate-900 w-10">{trend.searchVolume}</span>
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          trend.trendScore > 0 ? "text-green-600" : trend.trendScore < 0 ? "text-red-600" : "text-slate-600"
                        }`}
                      >
                        {trend.trendScore > 0 ? "+" : ""}
                        {trend.trendScore}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>모니터링 중인 키워드가 없습니다.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
