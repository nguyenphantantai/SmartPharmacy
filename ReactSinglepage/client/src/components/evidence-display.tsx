import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  ExternalLink, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Info,
  GraduationCap,
  Calendar,
  Users,
  Award
} from "lucide-react";
import { useState } from "react";

interface ScientificEvidence {
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
  url?: string;
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  studyType: 'RCT' | 'Meta-analysis' | 'Cohort' | 'Case-control' | 'Cross-sectional' | 'Systematic Review';
  sampleSize?: number;
  reliability: number; // 0-100
}

interface AssessmentReliability {
  overallReliability: number;
  evidenceCount: number;
  lastUpdated: string;
  validationStatus: 'Validated' | 'Under Review' | 'Preliminary';
  methodology: string;
  limitations: string[];
}

interface EvidenceDisplayProps {
  assessmentId: string;
  assessmentName: string;
  evidence: ScientificEvidence[];
  reliability: AssessmentReliability;
  onViewEvidence?: (evidence: ScientificEvidence) => void;
}

export default function EvidenceDisplay({ 
  assessmentId, 
  assessmentName, 
  evidence, 
  reliability,
  onViewEvidence 
}: EvidenceDisplayProps) {
  const [showAllEvidence, setShowAllEvidence] = useState(false);

  const getEvidenceLevelColor = (level: string) => {
    switch (level) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEvidenceLevelDescription = (level: string) => {
    switch (level) {
      case 'A': return 'Bằng chứng mạnh - RCT hoặc Meta-analysis';
      case 'B': return 'Bằng chứng trung bình - Cohort studies';
      case 'C': return 'Bằng chứng yếu - Case-control studies';
      case 'D': return 'Bằng chứng rất yếu - Expert opinion';
      default: return 'Không xác định';
    }
  };

  const getStudyTypeDescription = (type: string) => {
    switch (type) {
      case 'RCT': return 'Thử nghiệm ngẫu nhiên có đối chứng';
      case 'Meta-analysis': return 'Phân tích tổng hợp';
      case 'Cohort': return 'Nghiên cứu đoàn hệ';
      case 'Case-control': return 'Nghiên cứu bệnh-chứng';
      case 'Cross-sectional': return 'Nghiên cứu cắt ngang';
      case 'Systematic Review': return 'Tổng quan hệ thống';
      default: return type;
    }
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReliabilityDescription = (score: number) => {
    if (score >= 90) return 'Độ tin cậy rất cao';
    if (score >= 80) return 'Độ tin cậy cao';
    if (score >= 70) return 'Độ tin cậy trung bình';
    return 'Độ tin cậy thấp';
  };

  const displayedEvidence = showAllEvidence ? evidence : evidence.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Assessment Reliability Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Độ tin cậy của đánh giá</h3>
              <p className="text-sm text-muted-foreground">
                {assessmentName}
              </p>
            </div>
            <Badge 
              variant={reliability.validationStatus === 'Validated' ? 'default' : 'secondary'}
              className="flex items-center gap-1"
            >
              <Shield className="h-3 w-3" />
              {reliability.validationStatus}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getReliabilityColor(reliability.overallReliability)}`}>
                {reliability.overallReliability}%
              </div>
              <div className="text-sm text-muted-foreground">
                {getReliabilityDescription(reliability.overallReliability)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {reliability.evidenceCount}
              </div>
              <div className="text-sm text-muted-foreground">
                Nghiên cứu
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {evidence.filter(e => e.evidenceLevel === 'A' || e.evidenceLevel === 'B').length}
              </div>
              <div className="text-sm text-muted-foreground">
                Bằng chứng mạnh
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {evidence.reduce((sum, e) => sum + (e.sampleSize || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Tổng mẫu
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Phương pháp:</span>
              <span>{reliability.methodology}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-green-500" />
              <span className="font-medium">Cập nhật lần cuối:</span>
              <span>{reliability.lastUpdated}</span>
            </div>
          </div>

          {reliability.limitations.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Hạn chế:</span>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                {reliability.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-600">•</span>
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scientific Evidence */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Dẫn chứng khoa học</h3>
              <Badge variant="outline">{evidence.length} nghiên cứu</Badge>
            </div>
            {evidence.length > 3 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAllEvidence(!showAllEvidence)}
              >
                {showAllEvidence ? 'Thu gọn' : `Xem thêm ${evidence.length - 3} nghiên cứu`}
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {displayedEvidence.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.authors} ({item.year})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <em>{item.journal}</em>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getEvidenceLevelColor(item.evidenceLevel)}>
                      Mức {item.evidenceLevel}
                    </Badge>
                    <Badge variant="outline">
                      {item.reliability}%
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{getStudyTypeDescription(item.studyType)}</span>
                  </div>
                  {item.sampleSize && (
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      <span>{item.sampleSize.toLocaleString()} người tham gia</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-blue-600 mb-2">
                  {getEvidenceLevelDescription(item.evidenceLevel)}
                </div>

                <div className="flex items-center gap-2">
                  {item.doi && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`https://doi.org/${item.doi}`, '_blank')}
                      className="text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      DOI
                    </Button>
                  )}
                  {item.url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(item.url, '_blank')}
                      className="text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Xem nghiên cứu
                    </Button>
                  )}
                  {onViewEvidence && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewEvidence(item)}
                      className="text-xs"
                    >
                      <Info className="h-3 w-3 mr-1" />
                      Chi tiết
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {evidence.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có dẫn chứng khoa học cho đánh giá này</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Lưu ý quan trọng:</p>
              <p>
                Đánh giá này chỉ mang tính chất tham khảo và không thay thế cho việc khám bệnh trực tiếp với bác sĩ. 
                Kết quả dựa trên các nghiên cứu khoa học đã được công bố nhưng có thể không phù hợp với từng trường hợp cụ thể.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
