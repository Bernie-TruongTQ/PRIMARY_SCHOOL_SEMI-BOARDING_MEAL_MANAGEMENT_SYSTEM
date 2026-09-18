import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
} from 'reactstrap';
import { useMealOperations } from '../../../hooks/useMealOperations';
import { Link } from 'react-router';

export default function ReconciliationScreen() {
  const { reconciliation, finalizeReconciliation } = useMealOperations();
  const [synced, setSynced] = useState(reconciliation.accountantNotified);

  const handleSyncToAccountant = () => {
    finalizeReconciliation();
    setSynced(true);
  };

  return (
    <div className="semi-boarding-page p-4">
      {/* Editorial Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-end pb-3 mb-4 border-bottom">
        <div>
          <div className="text-muted small fw-semibold text-uppercase tracking-wider mb-1">
            Khép Kín Vận Hành • 13:00 PM Đối Soát
          </div>
          <h2 className="fw-semibold text-dark mb-1" style={{ letterSpacing: '-0.03em' }}>
            Đối Soát Suất Ăn 3 Chiều & Khóa Sổ
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '15px' }}>
            So khớp giữa số suất Đã Đặt (PO) ↔ Số Bếp Đã Giao ↔ Số Học Sinh Thực Ăn để thanh toán công nợ và trừ tiền ăn.
          </p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Link to="/coordinator/distribution" className="btn btn-apple-secondary text-decoration-none">
            ← Phân phối
          </Link>
          <Link to="/coordinator/attendance" className="btn btn-apple-secondary text-decoration-none">
            Bắt đầu ngày mới
          </Link>
        </div>
      </div>

      {synced && (
        <div className="p-3 mb-4 rounded-3 border bg-white d-flex justify-content-between align-items-center shadow-sm">
          <div className="d-flex align-items-center gap-2">
            <span className="text-success fs-5">✓</span>
            <div>
              <strong className="text-dark">Đã khóa sổ ngày và đồng bộ dữ liệu sang Cổng Kế Toán (ACC)</strong>
              <div className="text-muted small">Kế toán sẽ sử dụng số liệu này để đối chiếu hóa đơn nhà cung cấp và trừ tiền ăn tháng.</div>
            </div>
          </div>
          <span className="badge rounded-pill bg-light text-success border px-3 py-2 fw-medium">
            ĐÃ ĐỒNG BỘ
          </span>
        </div>
      )}

      {/* Balanced 2-Column Layout */}
      <Row className="g-4">
        {/* Left Column: 3-Way Reconciliation Matrix Cards */}
        <Col lg="7">
          <Card className="apple-card mb-4">
            <div className="p-4 border-bottom">
              <span className="text-muted small fw-semibold text-uppercase">Bảng Cân Đối 3 Chiều</span>
              <h5 className="fw-semibold text-dark mt-1 mb-0">Ma Trận Đối Soát Sản Lượng Ngày</h5>
            </div>
            <CardBody className="p-4">
              <Row className="g-3">
                <Col md="4">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="text-muted small fw-medium mb-1">1. Đã đặt (PO 09:00)</div>
                    <h3 className="fw-semibold text-dark mb-0">{reconciliation.totalOrdered}</h3>
                    <small className="text-muted">Suất ăn theo hợp đồng</small>
                  </div>
                </Col>
                <Col md="4">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="text-muted small fw-medium mb-1">2. Bếp giao (10:30)</div>
                    <h3 className="fw-semibold text-primary mb-0">{reconciliation.totalDelivered}</h3>
                    <small className="text-muted">Theo biên bản kiểm thực</small>
                  </div>
                </Col>
                <Col md="4">
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="text-muted small fw-medium mb-1">3. Thực tế ăn (11:30)</div>
                    <h3 className="fw-semibold text-success mb-0">{reconciliation.totalConsumed}</h3>
                    <small className="text-muted">Học sinh + Giáo viên</small>
                  </div>
                </Col>
              </Row>

              <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold text-dark">Chênh lệch thừa / thiếu cuối ngày:</div>
                  <small className="text-muted">Dư nằm trong ngưỡng đệm an toàn dự phòng</small>
                </div>
                <div className="text-end">
                  <h4 className="fw-bold text-dark mb-0">
                    {reconciliation.surplusDeficit >= 0 ? `+${reconciliation.surplusDeficit}` : reconciliation.surplusDeficit} suất
                  </h4>
                  <span className="badge rounded-pill bg-light text-success border px-2 py-1">
                    An toàn
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Discrepancy Note Ledger */}
          <Card className="apple-card">
            <div className="p-4 border-bottom">
              <h5 className="fw-semibold text-dark mb-0">Biên Bản Ghi Nhận Lý Do Biến Động</h5>
            </div>
            <CardBody className="p-4">
              <ul className="list-unstyled mb-0">
                {reconciliation.reasons.map((reason, idx) => (
                  <li key={idx} className="d-flex align-items-start gap-3 py-2 border-bottom">
                    <span className="badge rounded-pill bg-light text-muted border mt-1">{idx + 1}</span>
                    <span className="text-dark small leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </Col>

        {/* Right Column: Close Day & Accountant Sync Action */}
        <Col lg="5">
          <Card className="apple-card-parchment p-4 mb-4">
            <span className="text-muted small fw-semibold text-uppercase">Khóa Sổ Vận Hành</span>
            <h5 className="fw-semibold text-dark mt-1 mb-2">Chốt Số Liệu Thanh Toán</h5>
            <p className="text-muted small mb-3">
              Khi thực hiện khóa sổ, sản lượng suất ăn thực tế và danh sách học sinh vắng có phép sẽ được niêm phong để làm căn cứ:
            </p>

            <div className="p-3 bg-white rounded border mb-3">
              <div className="fw-semibold text-dark small mb-1">1. Phụ huynh học sinh</div>
              <div className="text-muted small">Tự động trừ tiền ăn các ngày vắng có phép vào phiếu thu học phí tháng sau.</div>
            </div>

            <div className="p-3 bg-white rounded border mb-3">
              <div className="fw-semibold text-dark small mb-1">2. Đơn vị nấu (Catering)</div>
              <div className="text-muted small">Chốt số lượng suất ăn giao nhận đạt chuẩn để làm biên bản nghiệm thu công nợ.</div>
            </div>

            <div className="p-3 bg-white rounded border mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small text-muted">Trạng thái đồng bộ:</span>
                <span className={`badge rounded-pill ${synced ? 'bg-light text-success border' : 'bg-light text-warning text-dark border'}`}>
                  {synced ? '✓ Đã đồng bộ sang Kế toán' : '⏳ Chờ chốt sổ ngày'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-apple-primary w-100 py-3 text-center fw-semibold fs-6"
              disabled={synced}
              onClick={handleSyncToAccountant}
            >
              {synced ? '✓ Đã Khóa Sổ & Đồng Bộ Kế Toán' : 'Khóa Sổ & Chuyển Số Liệu Kế Toán'}
            </button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
