import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { useMealOperations } from '../../../hooks/useMealOperations';
import { TemperatureBadge } from '../../../components/SemiBoarding/TemperatureBadge';
import { Link } from 'react-router';

export default function ReceivingScreen() {
  const { inspection, updateInspection } = useMealOperations();
  const [probeTemp, setProbeTemp] = useState<number>(inspection.temperatureProbeCelsius);
  const [containersCount, setContainersCount] = useState<number>(inspection.deliveredContainersCount);
  const [sealChecked, setSealChecked] = useState<boolean>(inspection.sealIntact);
  const [sensoryChecked, setSensoryChecked] = useState<boolean>(inspection.sensoryColorSmellTastePassed);
  const [sampleSaved, setSampleSaved] = useState<boolean>(inspection.sampleRetained24h);
  const [inspectorNotes, setInspectorNotes] = useState<string>(inspection.notes);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveInspection = () => {
    const isPassed = probeTemp >= 65 && sealChecked && sensoryChecked && sampleSaved;
    updateInspection({
      temperatureProbeCelsius: probeTemp,
      deliveredContainersCount: containersCount,
      sealIntact: sealChecked,
      sensoryColorSmellTastePassed: sensoryChecked,
      sampleRetained24h: sampleSaved,
      overallPassed: isPassed,
      notes: inspectorNotes,
    });
    setSavedSuccess(true);
  };

  return (
    <div className="semi-boarding-page p-4">
      {/* Editorial Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-end pb-3 mb-4 border-bottom">
        <div>
          <div className="text-muted small fw-semibold text-uppercase tracking-wider mb-1">
            An Toàn Thực Phẩm • 10:30 AM Tiếp Nhận
          </div>
          <h2 className="fw-semibold text-dark mb-1" style={{ letterSpacing: '-0.03em' }}>
            Biên Bản Kiểm Thực 3 Bước
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '15px' }}>
            Kiểm tra nguồn gốc, điều kiện niêm phong vận chuyển, nhiệt độ tâm món ăn và lưu mẫu 24 giờ.
          </p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Link to="/coordinator/demand" className="btn btn-apple-secondary text-decoration-none">
            ← Đặt bếp
          </Link>
          <Link to="/coordinator/distribution" className="btn btn-apple-secondary text-decoration-none">
            Phân phối 11:00 →
          </Link>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 mb-4 rounded-3 border bg-white d-flex justify-content-between align-items-center shadow-sm">
          <div className="d-flex align-items-center gap-2">
            <span className="text-success fs-5">✓</span>
            <div>
              <strong className="text-dark">Đã hoàn tất ký nhận kiểm thực 3 bước</strong>
              <div className="text-muted small">Suất ăn đạt tiêu chuẩn tiếp nhận và chuyển giao sang tổ phân phối.</div>
            </div>
          </div>
          <span className="badge rounded-pill bg-light text-success border px-3 py-2 fw-medium">
            ĐẠT TIÊU CHUẨN AN TOÀN
          </span>
        </div>
      )}

      {/* 2-Column Balanced Inspection Form */}
      <Row className="g-4">
        {/* Left Column: 3 Inspection Steps */}
        <Col lg="7">
          <Card className="apple-card mb-4">
            <div className="p-4 border-bottom">
              <span className="text-muted small fw-semibold text-uppercase">Quy Trình Kiểm Tra Bắt Buộc</span>
              <h5 className="fw-semibold text-dark mb-0 mt-1">Các Hạng Mục Kiểm Thực Tại Chỗ</h5>
            </div>
            <CardBody className="p-4">
              {/* Step 1 */}
              <div className="mb-4 pb-4 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-semibold text-dark">Bước 1: Niêm phong & Thùng cách nhiệt</span>
                  <span className="badge rounded-pill bg-light text-secondary border">Vận chuyển</span>
                </div>
                <p className="text-muted small mb-3">
                  Kiểm tra xe chuyên dụng của bếp, số lượng thùng inox giữ nhiệt và tem niêm phong còn nguyên vẹn.
                </p>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span className="text-muted small">Số thùng nhận thực tế:</span>
                  <Input
                    type="number"
                    value={containersCount}
                    onChange={(e) => setContainersCount(Number(e.target.value))}
                    className="form-control text-center fw-semibold"
                    style={{ width: '80px', borderRadius: '8px' }}
                  />
                  <span className="text-muted small">/ {inspection.expectedContainersCount} thùng tiêu chuẩn</span>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="sealCheck"
                    checked={sealChecked}
                    onChange={(e) => setSealChecked(e.target.checked)}
                  />
                  <label className="form-check-label text-dark fw-medium small" htmlFor="sealCheck">
                    Tem niêm phong xuất xưởng còn nguyên vẹn, không có dấu hiệu rách hỏng
                  </label>
                </div>
              </div>

              {/* Step 2 */}
              <div className="mb-4 pb-4 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-semibold text-dark">Bước 2: Đo nhiệt độ tâm suất ăn</span>
                  <TemperatureBadge temperature={probeTemp} />
                </div>
                <p className="text-muted small mb-3">
                  Sử dụng nhiệt kế đầu dò điện tử cắm sâu vào tâm thức ăn (Quy định bắt buộc: ≥ 65°C đối với món nóng).
                </p>
                <div className="d-flex align-items-center gap-3">
                  <span className="text-muted small">Nhiệt độ đo (°C):</span>
                  <Input
                    type="number"
                    step="0.1"
                    value={probeTemp}
                    onChange={(e) => setProbeTemp(Number(e.target.value))}
                    className="form-control text-center fw-semibold"
                    style={{ width: '100px', borderRadius: '8px' }}
                  />
                  <span className="text-muted small">
                    {probeTemp >= 65 ? 'Đạt chuẩn an toàn VSTP' : 'Không đạt chuẩn (Cần hâm nóng lại)'}
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-semibold text-dark">Bước 3: Cảm quan & Lưu mẫu nghiệm 24h</span>
                  <span className="badge rounded-pill bg-light text-secondary border">Mẫu lưu</span>
                </div>
                <p className="text-muted small mb-3">
                  Đánh giá màu sắc, mùi vị, độ chín và thực hiện trích xuất mẫu lưu vào tủ chuyên dụng có khóa.
                </p>
                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="sensoryCheck"
                    checked={sensoryChecked}
                    onChange={(e) => setSensoryChecked(e.target.checked)}
                  />
                  <label className="form-check-label text-dark fw-medium small" htmlFor="sensoryCheck">
                    Cảm quan món ăn tươi mới, mùi thơm tự nhiên, chín kỹ, không có dị vật
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="sampleCheck"
                    checked={sampleSaved}
                    onChange={(e) => setSampleSaved(e.target.checked)}
                  />
                  <label className="form-check-label text-dark fw-medium small" htmlFor="sampleCheck">
                    Đã lấy mẫu lưu nghiệm đủ 100g/món, dán nhãn niêm phong lưu tủ lạnh 24 giờ
                  </label>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Right Column: Sign-off & Inspection Certificate */}
        <Col lg="5">
          <Card className="apple-card-parchment p-4 mb-4">
            <span className="text-muted small fw-semibold text-uppercase">Xác Nhận Biên Bản</span>
            <h5 className="fw-semibold text-dark mt-1 mb-2">Chữ Ký Tiếp Nhận Suất Ăn</h5>
            <p className="text-muted small mb-3">
              Biên bản kiểm thực là chứng từ pháp lý bảo đảm chất lượng bữa ăn học đường theo quy định của Phòng GD&ĐT.
            </p>

            <div className="mb-3">
              <label className="form-label text-dark small fw-medium">Cán bộ kiểm tra / Đại diện trường:</label>
              <div className="p-2 bg-white rounded border text-dark fw-medium small">
                {inspection.inspectorName}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-dark small fw-medium">Thời điểm ghi nhận:</label>
              <div className="p-2 bg-white rounded border text-dark small">
                {inspection.inspectionTime} • Ngày {new Date().toLocaleDateString('vi-VN')}
              </div>
            </div>

            {/* Live Inspection Result Summary Checklist */}
            <div className="p-3 bg-white rounded border mb-3">
              <div className="text-muted small fw-semibold text-uppercase mb-2">Tóm Tắt Chỉ Số Kiểm Thực</div>
              <div className="d-flex justify-content-between align-items-center py-1 border-bottom">
                <span className="small text-muted">1. Số lượng thùng:</span>
                <span className="small fw-semibold text-dark">{containersCount} / {inspection.expectedContainersCount} thùng</span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-1 border-bottom">
                <span className="small text-muted">2. Tem niêm phong:</span>
                <span className={`small fw-semibold ${sealChecked ? 'text-success' : 'text-danger'}`}>
                  {sealChecked ? '✓ Còn nguyên vẹn' : '✗ Vi phạm / Rách'}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-1 border-bottom">
                <span className="small text-muted">3. Nhiệt độ tâm thức ăn:</span>
                <span className={`small fw-semibold ${probeTemp >= 65 ? 'text-success' : 'text-danger'}`}>
                  {probeTemp}°C ({probeTemp >= 65 ? 'Đạt ≥ 65°C' : 'Không đạt'})
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-1">
                <span className="small text-muted">4. Cảm quan & Lưu mẫu:</span>
                <span className={`small fw-semibold ${sensoryChecked && sampleSaved ? 'text-success' : 'text-danger'}`}>
                  {sensoryChecked && sampleSaved ? '✓ Đã lưu mẫu 24h' : 'Chưa đủ điều kiện'}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-dark small fw-medium">Ghi chú bổ sung (nếu có):</label>
              <textarea
                className="form-control"
                rows={3}
                value={inspectorNotes}
                onChange={(e) => setInspectorNotes(e.target.value)}
                placeholder="Ghi chú về tình trạng thùng xe, tài xế giao nhận..."
                style={{ borderRadius: '8px', fontSize: '13px' }}
              />
            </div>

            <button
              type="button"
              className="btn-apple-primary w-100 py-3 text-center fw-semibold fs-6"
              onClick={handleSaveInspection}
            >
              Ký Nhận & Xác Nhận Đạt Chuẩn
            </button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
