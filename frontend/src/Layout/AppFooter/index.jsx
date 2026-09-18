import { Fragment } from 'react';

const AppFooter = () => {
  return (
    <Fragment>
      <div className="app-wrapper-footer">
        <div className="app-footer">
          <div className="app-footer__inner">
            <div className="app-footer-left">
              <span className="text-muted small">
                © 2026 <strong>Hệ Thống Quản Lý Bán Trú Tiểu Học</strong> • Phiên bản 1.0 (MVP)
              </span>
            </div>
            <div className="app-footer-right">
              <span className="text-muted small me-3">Hỗ trợ kỹ thuật: <strong>024.3823.xxxx</strong></span>
              <span className="badge rounded-pill bg-light text-success border px-2 py-1">
                Hệ Thống Trực Tuyến
              </span>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AppFooter;
