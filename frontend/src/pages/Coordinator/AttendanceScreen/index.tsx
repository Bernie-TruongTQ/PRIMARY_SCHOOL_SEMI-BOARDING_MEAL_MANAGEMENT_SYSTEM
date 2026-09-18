import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Table,
  Badge,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { useMealOperations } from '../../../hooks/useMealOperations';
import { AllergenChip } from '../../../components/SemiBoarding/AllergenChip';
import { Student } from '../../../mock/types';
import { Link } from 'react-router';

export default function AttendanceScreen() {
  const { rosters, updateStudentStatus, toggleLockClassRoster, lockAllAttendance } = useMealOperations();
  const [selectedClass, setSelectedClass] = useState<string>('1A');
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState<{ student: Student; targetStatus: Student['status'] } | null>(null);
  const [absenceNote, setAbsenceNote] = useState('');

  const currentRoster = rosters.find((r) => r.className === selectedClass) || rosters[0];

  let totalRegistered = 0;
  let totalEating = 0;
  let totalAbsent = 0;
  let totalAllergyStudents = 0;

  rosters.forEach((r) => {
    totalRegistered += r.registeredBoarding;
    r.students.forEach((s) => {
      if (s.isRegisteredBoarding) {
        if (s.status === 'EATING') totalEating++;
        else totalAbsent++;
        if (s.allergies && s.allergies.length > 0) totalAllergyStudents++;
      }
    });
  });

  const handleStatusClick = (student: Student, newStatus: Student['status']) => {
    if (newStatus === 'EATING') {
      updateStudentStatus(selectedClass, student.id, 'EATING', undefined);
    } else {
      setActiveStudent({ student, targetStatus: newStatus });
      setAbsenceNote(student.absenceReason || '');
      setReasonModalOpen(true);
    }
  };

  const saveAbsenceWithNote = () => {
    if (activeStudent) {
      updateStudentStatus(selectedClass, activeStudent.student.id, activeStudent.targetStatus, absenceNote);
    }
    setReasonModalOpen(false);
    setActiveStudent(null);
  };

  return (
    <div className="semi-boarding-page p-4">
      {/* Editorial Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-end pb-3 mb-4 border-bottom">
        <div>
          <div className="text-muted small fw-semibold text-uppercase tracking-wider mb-1">
            Vận Hành Bán Trú • 08:30 AM Cutoff
          </div>
          <h2 className="fw-semibold text-dark mb-1" style={{ letterSpacing: '-0.03em' }}>
            Điểm Danh & Khóa Sổ Ăn Bán Trú
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '15px' }}>
            Ghi nhận sĩ số học sinh ăn thực tế trước giờ chốt đơn hàng sang đơn vị nấu lúc 08:30 sáng.
          </p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Button color="light" className="btn-apple-secondary" onClick={() => lockAllAttendance()}>
            Khóa Sổ Toàn Trường
          </Button>
          <Link to="/coordinator/demand" className="btn btn-apple-primary text-decoration-none">
            Tính Nhu Cầu Bếp →
          </Link>
        </div>
      </div>

      {/* Harmonized Metric Tiles (No Clashing Pastel Colors) */}
      <Row className="g-3 mb-4">
        <Col md="3">
          <div className="metric-tile">
            <div className="metric-tile-label">Đăng ký bán trú</div>
            <div className="metric-tile-value">{totalRegistered}</div>
            <div className="metric-tile-sub">Sĩ số danh sách toàn trường</div>
          </div>
        </Col>
        <Col md="3">
          <div className="metric-tile">
            <div className="metric-tile-label">Có mặt (Ăn trưa)</div>
            <div className="metric-tile-value text-success">{totalEating}</div>
            <div className="metric-tile-sub">Đã xác nhận có mặt tại lớp</div>
          </div>
        </Col>
        <Col md="3">
          <div className="metric-tile">
            <div className="metric-tile-label">Vắng mặt (Nghỉ ăn)</div>
            <div className="metric-tile-value text-secondary">{totalAbsent}</div>
            <div className="metric-tile-sub">Sẽ được khấu trừ tiền ăn</div>
          </div>
        </Col>
        <Col md="3">
          <div className="metric-tile">
            <div className="metric-tile-label">Hồ sơ dị ứng</div>
            <div className="metric-tile-value text-dark">{totalAllergyStudents}</div>
            <div className="metric-tile-sub">Cần cấp phát khay khẩu phần riêng</div>
          </div>
        </Col>
      </Row>

      {/* Class Selector Segmented Bar */}
      <div className="d-flex flex-wrap gap-2 align-items-center mb-4 p-2 bg-white rounded-pill border shadow-sm" style={{ width: 'fit-content' }}>
        <span className="text-muted small fw-semibold ps-3 pe-1">Lớp học:</span>
        {rosters.map((r) => {
          const isSelected = r.className === selectedClass;
          return (
            <button
              key={r.className}
              type="button"
              className={`btn btn-sm px-3 rounded-pill fw-medium transition-all ${
                isSelected
                  ? 'btn-apple-primary shadow-none'
                  : 'btn-link text-dark text-decoration-none'
              }`}
              onClick={() => setSelectedClass(r.className)}
              style={{ fontSize: '13px' }}
            >
              Lớp {r.className} {r.isLocked ? '• Đã chốt' : ''}
            </button>
          );
        })}
      </div>

      {/* Main Student List Table */}
      <Card className="apple-card">
        <div className="p-4 border-bottom d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h5 className="fw-semibold text-dark mb-1">Danh Sách Học Sinh — Lớp {currentRoster.className}</h5>
            <div className="text-muted small">
              Giáo viên phụ trách: <span className="text-dark fw-medium">{currentRoster.teacherName}</span> • {currentRoster.room}
            </div>
          </div>
          <div className="d-flex align-items-center gap-3 mt-2 mt-md-0">
            {currentRoster.isLocked ? (
              <span className="badge rounded-pill bg-light text-success border px-3 py-2 fw-medium">
                ✓ Đã chốt lúc {currentRoster.lockedAt || '08:20 AM'}
              </span>
            ) : (
              <span className="badge rounded-pill bg-light text-muted border px-3 py-2 fw-medium">
                Đang chờ giáo viên chốt
              </span>
            )}
            <button
              type="button"
              className="btn-apple-secondary py-1 px-3 text-nowrap"
              onClick={() => toggleLockClassRoster(currentRoster.className)}
            >
              {currentRoster.isLocked ? 'Mở khóa lại' : 'Khóa sổ lớp này'}
            </button>
          </div>
        </div>

        <CardBody className="p-0">
          <Table responsive hover className="apple-table mb-0 align-middle">
            <thead>
              <tr>
                <th className="ps-4">Mã HS</th>
                <th>Họ và Tên</th>
                <th>Giới Tính</th>
                <th>Cảnh Báo Kiêng Ăn</th>
                <th>Điểm Danh Bữa Trưa</th>
                <th>Lý Do / Ghi Chú</th>
              </tr>
            </thead>
            <tbody>
              {currentRoster.students.map((student) => {
                const isEating = student.status === 'EATING';
                const isExcused = student.status === 'ABSENT_EXCUSED';
                const isUnexcused = student.status === 'ABSENT_UNEXCUSED';

                return (
                  <tr key={student.id}>
                    <td className="ps-4 font-monospace text-muted small">{student.code}</td>
                    <td className="fw-medium text-dark">{student.fullName}</td>
                    <td className="text-muted small">{student.gender === 'MALE' ? 'Nam' : 'Nữ'}</td>
                    <td>
                      <AllergenChip allergens={student.allergies} />
                      {(!student.allergies || student.allergies.length === 0) && (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                    <td>
                      <div className="segmented-pills">
                        <button
                          type="button"
                          className={`segmented-pill-btn ${isEating ? 'active-eating' : ''}`}
                          onClick={() => handleStatusClick(student, 'EATING')}
                        >
                          Ăn bán trú
                        </button>
                        <button
                          type="button"
                          className={`segmented-pill-btn ${isExcused ? 'active-absent' : ''}`}
                          onClick={() => handleStatusClick(student, 'ABSENT_EXCUSED')}
                        >
                          Vắng có phép
                        </button>
                        <button
                          type="button"
                          className={`segmented-pill-btn ${isUnexcused ? 'active-absent' : ''}`}
                          onClick={() => handleStatusClick(student, 'ABSENT_UNEXCUSED')}
                        >
                          Không phép
                        </button>
                      </div>
                    </td>
                    <td>
                      {student.absenceReason ? (
                        <span className="text-dark small bg-light px-2 py-1 rounded border">
                          {student.absenceReason}
                        </span>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Absence Note Modal */}
      <Modal isOpen={reasonModalOpen} toggle={() => setReasonModalOpen(!reasonModalOpen)} centered>
        <ModalHeader toggle={() => setReasonModalOpen(!reasonModalOpen)} className="border-bottom">
          Ghi nhận lý do vắng: {activeStudent?.student.fullName}
        </ModalHeader>
        <ModalBody className="p-4">
          <p className="text-muted small mb-3">
            Học sinh vắng ăn có phép sẽ được hệ thống khấu trừ tiền ăn vào kỳ hóa đơn tháng kế tiếp.
          </p>
          <Input
            type="textarea"
            rows={3}
            value={absenceNote}
            onChange={(e) => setAbsenceNote(e.target.value)}
            placeholder="Ví dụ: Phụ huynh gửi đơn xin nghỉ ốm; việc gia đình..."
            className="form-control rounded-3"
          />
        </ModalBody>
        <ModalFooter className="border-top">
          <button type="button" className="btn-apple-secondary" onClick={() => setReasonModalOpen(false)}>
            Hủy
          </button>
          <button type="button" className="btn-apple-primary" onClick={saveAbsenceWithNote}>
            Xác nhận
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
