import React from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Table,
} from 'reactstrap';
import { useMealOperations } from '../../../hooks/useMealOperations';
import { Link } from 'react-router';

export default function DistributionScreen() {
  const { distributions, confirmTrayDelivery } = useMealOperations();

  const totalAllocated = distributions.reduce((sum, d) => sum + d.allocatedTrays, 0);
  const totalAllergyTrays = distributions.reduce((sum, d) => sum + d.specialAllergyTrays, 0);
  const deliveredCount = distributions.filter((d) => d.status === 'CONFIRMED').length;

  return (
    <div className="semi-boarding-page p-4">
      {/* Editorial Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-end pb-3 mb-4 border-bottom">
        <div>
          <div className="text-muted small fw-semibold text-uppercase tracking-wider mb-1">
            Vận Hành Bán Trú • 11:00 AM Phân Phối
          </div>
          <h2 className="fw-semibold text-dark mb-1" style={{ letterSpacing: '-0.03em' }}>
            Phân Phối Khay Ăn & Xe Đẩy Về Lớp
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '15px' }}>
            Điều phối khay cơm theo xe đẩy về từng phòng học, đảm bảo đúng sĩ số và khẩu phần dị ứng riêng.
          </p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Link to="/coordinator/receiving" className="btn btn-apple-secondary text-decoration-none">
            ← Kiểm thực
          </Link>
          <Link to="/coordinator/reconciliation" className="btn btn-apple-primary text-decoration-none">
            Đối soát 13:00 →
          </Link>
        </div>
      </div>

      {/* Harmonized Metric Tiles */}
      <Row className="g-3 mb-4">
        <Col md="4">
          <div className="metric-tile">
            <div className="metric-tile-label">Tổng khay ăn đã chia</div>
            <div className="metric-tile-value">{totalAllocated}</div>
            <div className="metric-tile-sub">Khẩu phần chuẩn bị cho học sinh</div>
          </div>
        </Col>
        <Col md="4">
          <div className="metric-tile">
            <div className="metric-tile-label">Khay dị ứng riêng</div>
            <div className="metric-tile-value text-dark">{totalAllergyTrays}</div>
            <div className="metric-tile-sub">Có tem cảnh báo thành phần</div>
          </div>
        </Col>
        <Col md="4">
          <div className="metric-tile">
            <div className="metric-tile-label">Tiến độ bàn giao</div>
            <div className="metric-tile-value text-success">{deliveredCount} / {distributions.length}</div>
            <div className="metric-tile-sub">Phòng học đã tiếp nhận đủ</div>
          </div>
        </Col>
      </Row>

      {/* Trolley Distribution Table */}
      <Card className="apple-card">
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
          <div>
            <h5 className="fw-semibold text-dark mb-1">Danh Sách Bàn Giao Xe Đẩy Về Các Khối Lớp</h5>
            <div className="text-muted small">Thời gian xe xuất phát từ khu vực chia cơm: 11:00 AM – 11:20 AM</div>
          </div>
        </div>
        <CardBody className="p-0">
          <Table responsive hover className="apple-table mb-0 align-middle">
            <thead>
              <tr>
                <th className="ps-4">Lớp Học</th>
                <th>Mã Xe Đẩy / Khu Vực</th>
                <th>Khay Tiêu Chuẩn</th>
                <th>Khay Dị Ứng Riêng</th>
                <th>Giờ Xuất Xe</th>
                <th>Người Nhận</th>
                <th>Trạng Thái</th>
                <th className="text-end pe-4">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {distributions.map((item) => {
                const isConfirmed = item.status === 'CONFIRMED';
                const isDispatched = item.status === 'DISPATCHED';

                return (
                  <tr key={item.className}>
                    <td className="ps-4 fw-semibold text-dark">Lớp {item.className}</td>
                    <td>
                      <span className="badge rounded-pill bg-light text-secondary border px-2 py-1">
                        {item.trolleyId}
                      </span>
                    </td>
                    <td className="fw-medium text-dark">{item.allocatedTrays} khay</td>
                    <td>
                      {item.specialAllergyTrays > 0 ? (
                        <span className="badge rounded-pill bg-warning-subtle text-dark border px-2 py-1">
                          {item.specialAllergyTrays} khay riêng
                        </span>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                    <td className="text-muted small">{item.dispatchedTime}</td>
                    <td className="text-dark small fw-medium">{item.receivedBy}</td>
                    <td>
                      {isConfirmed && (
                        <span className="badge rounded-pill bg-light text-success border px-2 py-1 fw-medium">
                          ✓ Đã nhận
                        </span>
                      )}
                      {isDispatched && (
                        <span className="badge rounded-pill bg-light text-primary border px-2 py-1 fw-medium">
                          Đang giao
                        </span>
                      )}
                      {item.status === 'PENDING' && (
                        <span className="badge rounded-pill bg-light text-muted border px-2 py-1 fw-medium">
                          Chờ xuất
                        </span>
                      )}
                    </td>
                    <td className="text-end pe-4">
                      {!isConfirmed ? (
                        <button
                          type="button"
                          className="btn-apple-secondary py-1 px-3"
                          onClick={() => confirmTrayDelivery(item.className, 'Bảo mẫu / GV')}
                        >
                          Xác nhận
                        </button>
                      ) : (
                        <span className="text-muted small">Hoàn tất</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
