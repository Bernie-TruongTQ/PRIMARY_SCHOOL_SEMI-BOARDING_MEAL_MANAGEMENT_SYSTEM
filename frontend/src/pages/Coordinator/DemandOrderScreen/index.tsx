import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Badge,
} from 'reactstrap';
import { useMealOperations } from '../../../hooks/useMealOperations';
import { BufferStepper } from '../../../components/SemiBoarding/BufferStepper';
import { Link } from 'react-router';

export default function DemandOrderScreen() {
  const { demand, setBufferPercentage, submitOrderToCatering } = useMealOperations();
  const [orderSentNotification, setOrderSentNotification] = useState(demand.status !== 'DRAFT');

  const handleSendOrder = () => {
    submitOrderToCatering();
    setOrderSentNotification(true);
  };

  const estimatedTotalCost = demand.totalOrderedPortions * demand.cateringVendor.contractPricePerMeal;

  return (
    <div className="semi-boarding-page p-4">
      {/* Editorial Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-end pb-3 mb-4 border-bottom">
        <div>
          <div className="text-muted small fw-semibold text-uppercase tracking-wider mb-1">
            Vận Hành Bán Trú • 09:00 AM PO Dispatch
          </div>
          <h2 className="fw-semibold text-dark mb-1" style={{ letterSpacing: '-0.03em' }}>
            Tổng Hợp Suất Ăn & Đặt Hàng Bếp
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '15px' }}>
            Hệ thống tự động tổng hợp từ sĩ số điểm danh thực tế, áp dụng bộ đệm an toàn và phát hành đơn đặt hàng (PO).
          </p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Link to="/coordinator/attendance" className="btn btn-apple-secondary text-decoration-none">
            ← Điểm danh
          </Link>
          <Link to="/coordinator/receiving" className="btn btn-apple-secondary text-decoration-none">
            Kiểm thực 10:30 →
          </Link>
        </div>
      </div>

      {orderSentNotification && (
        <div className="p-3 mb-4 rounded-3 border bg-white d-flex justify-content-between align-items-center shadow-sm">
          <div className="d-flex align-items-center gap-2">
            <span className="text-success fs-5">✓</span>
            <div>
              <strong className="text-dark">Đã gửi đơn hàng sang Bếp Catering</strong>
              <div className="text-muted small">Đơn vị tiếp nhận: {demand.cateringVendor.name} • Giờ giao cam kết: 10:30 AM</div>
            </div>
          </div>
          <span className="badge rounded-pill bg-light text-success border px-3 py-2 fw-medium">
            ĐÃ CHỐT PO
          </span>
        </div>
      )}

      {/* Balanced 2-Column Layout */}
      <Row className="g-4">
        {/* Left Column: Calculation Summary & Vendor PO Details */}
        <Col lg="5">
          <Card className="apple-card mb-4">
            <div className="p-4 border-bottom">
              <span className="text-muted small fw-semibold text-uppercase">Cơ Sở Tính Toán Định Lượng</span>
              <h4 className="fw-semibold text-dark mt-1 mb-0">Tổng Suất Ăn: {demand.totalOrderedPortions} suất</h4>
            </div>
            <CardBody className="p-4">
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Học sinh có mặt ăn trưa:</span>
                <strong className="text-dark">{demand.totalPresentStudents} suất</strong>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Cán bộ & Giáo viên bán trú:</span>
                <strong className="text-dark">{demand.staffPortions} suất</strong>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Suất ăn kiêng / dị ứng riêng:</span>
                <span className="badge bg-warning-subtle text-dark border px-2 py-1">{demand.specialDietPortions} suất</span>
              </div>

              {/* Buffer Stepper Row */}
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div>
                  <div className="fw-medium text-dark">Bộ đệm an toàn (Buffer)</div>
                  <small className="text-muted">Dự phòng phát sinh, đổ vỡ</small>
                </div>
                <BufferStepper
                  value={demand.bufferPercentage}
                  onChange={setBufferPercentage}
                  disabled={demand.status !== 'DRAFT'}
                />
              </div>

              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Số suất đệm tăng thêm:</span>
                <strong className="text-primary">+{demand.calculatedBufferPortions} suất</strong>
              </div>

              <div className="d-flex justify-content-between pt-3">
                <span className="fw-semibold text-dark">Đơn giá hợp đồng / suất:</span>
                <strong className="text-dark">{demand.cateringVendor.contractPricePerMeal.toLocaleString('vi-VN')} đ</strong>
              </div>
              <div className="d-flex justify-content-between pt-2">
                <span className="fw-semibold text-dark">Tổng dự toán tạm tính:</span>
                <h5 className="fw-bold text-primary mb-0">{estimatedTotalCost.toLocaleString('vi-VN')} đ</h5>
              </div>
            </CardBody>
          </Card>

          {/* Vendor Dispatch Card */}
          <Card className="apple-card-parchment p-4">
            <div className="text-muted small fw-semibold text-uppercase mb-1">Đơn vị cung ứng dịch vụ</div>
            <h5 className="fw-semibold text-dark mb-1">{demand.cateringVendor.name}</h5>
            <div className="text-muted small mb-3">
              Hotline: <strong className="text-dark">{demand.cateringVendor.contactPhone}</strong>
            </div>

            <button
              type="button"
              className="btn-apple-primary w-100 py-3 text-center fw-semibold fs-6"
              disabled={demand.status !== 'DRAFT'}
              onClick={handleSendOrder}
            >
              {demand.status === 'DRAFT' ? 'Khóa Sổ & Gửi Đơn Cho Bếp (09:00 AM)' : '✓ Đã Gửi Đơn Đặt Hàng'}
            </button>
          </Card>
        </Col>

        {/* Right Column: Menu Dish Inventory */}
        <Col lg="7">
          <Card className="apple-card mb-4">
            <div className="p-4 border-bottom">
              <h5 className="fw-semibold text-dark mb-1">Chi Tiết Thực Đơn & Định Lượng Chốt</h5>
              <div className="text-muted small">Quy cách định lượng suất ăn trưa tiêu chuẩn trường học</div>
            </div>
            <CardBody className="p-0">
              <Table responsive hover className="apple-table mb-0 align-middle">
                <thead>
                  <tr>
                    <th className="ps-4">Tên Món Ăn</th>
                    <th>Phân Loại</th>
                    <th>Yêu Cầu Nhiệt Độ</th>
                    <th className="text-end pe-4">Số Lượng Đặt</th>
                  </tr>
                </thead>
                <tbody>
                  {demand.dishes.map((item) => (
                    <tr key={item.dish.id}>
                      <td className="ps-4">
                        <div className="fw-medium text-dark">{item.dish.name}</div>
                        {item.dish.allergens.length > 0 && (
                          <div className="small text-muted">Chứa: {item.dish.allergens.join(', ')}</div>
                        )}
                      </td>
                      <td>
                        <span className="badge rounded-pill bg-light text-secondary border px-2 py-1">
                          {item.dish.category === 'MAIN' ? 'Món mặn' : item.dish.category === 'SOUP' ? 'Canh' : item.dish.category === 'SIDE' ? 'Món xào' : 'Tráng miệng'}
                        </span>
                      </td>
                      <td>
                        <span className="text-dark fw-medium">≥ {item.dish.targetTemp}°C</span>
                      </td>
                      <td className="text-end pe-4 fw-semibold text-dark">
                        {item.requiredQty} {item.dish.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>

          {/* Nutrition & Safety Standard Card */}
          <Card className="apple-card-parchment p-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-semibold text-dark mb-0">Tiêu Chuẩn Dinh Dưỡng Học Đường</h6>
              <span className="badge rounded-pill bg-light text-success border">Viện Dinh Dưỡng Quốc Gia</span>
            </div>
            <p className="text-muted small mb-3">
              Thực đơn đáp ứng 650 - 720 kcal/bữa trưa cho học sinh tiểu học, tỷ lệ P:L:C cân đối (13-15% : 20-25% : 60-65%), hàm lượng canxi và sắt đạt khuyến nghị.
            </p>
            <div className="row g-2 text-center">
              <div className="col-4">
                <div className="p-2 bg-white rounded border">
                  <div className="text-muted small">Năng lượng</div>
                  <strong className="text-dark">685 kcal</strong>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2 bg-white rounded border">
                  <div className="text-muted small">Chất đạm (P)</div>
                  <strong className="text-dark">26.5 g</strong>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2 bg-white rounded border">
                  <div className="text-muted small">Chất béo (L)</div>
                  <strong className="text-dark">18.2 g</strong>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
