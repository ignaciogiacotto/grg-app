import React from 'react';

interface EnvelopesData {
  cigarettes: number;
  recharges: number;
}

interface EnvelopesProps {
  envelopes: EnvelopesData | null;
  todayProfit: number;
}

const Envelopes: React.FC<EnvelopesProps> = ({ envelopes, todayProfit }) => {
  return (
    <>
      <h4 className="mb-3">Gestión de Sobres</h4>
      <div className="row row-cols-1 g-3">
        <div className="col">
          <div className="card border-primary shadow-sm">
            <div className="card-body d-flex align-items-center">
              <i className="bi bi-box-seam me-3 text-primary fs-3"></i>
              <div>
                <h6 className="card-subtitle mb-1"> Sobre Cigarrillos</h6>
                <h4 className="mb-0">
                  ${envelopes?.cigarettes.toLocaleString("es-AR") || "0"}
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card border-success shadow-sm">
            <div className="card-body d-flex align-items-center">
              <i className="bi bi-phone-fill me-3 text-success fs-3"></i>
              <div>
                <h6 className="card-subtitle mb-1">Sobre Telerecargas</h6>
                <h4 className="mb-0">
                  ${envelopes?.recharges.toLocaleString("es-AR") || "0"}
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card border-dark shadow-sm">
            <div className="card-body d-flex align-items-center">
              <i className="bi bi-wallet2 me-3 text-dark fs-3"></i>
              <div>
                <h6 className="card-subtitle mb-1">Sobre GRG</h6>
                <h4 className="mb-0">
                  ${todayProfit.toLocaleString("es-AR") || "0"}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Envelopes;
